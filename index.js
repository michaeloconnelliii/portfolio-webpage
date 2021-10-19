/* ======= Header and Navigation ======= */
/* Toggle the Navigation Bar on clicking outside nav when it's open. 
   
   Keep track of whether intradocument link is clicked, so header can stay open */
let keepHeader = false;

window.addEventListener('click', (event) => {
    if((event.target.classList.contains('nav-toggle') || event.target.classList.contains('hamburger')) ||
      (event.target.getAttribute('id') !== 'nav-list' && document.body.classList.contains('nav-open'))) {
        document.body.classList.toggle('nav-open');
    }

    keepHeader = event.target.classList.contains('nav-link');
});

/* Keep the header until user gets past name (Michael O'Connell) and 
   then hide the header on scroll down, insert it on scroll up.

   Header doesn't go away when nav is open.
   
   Keep the header visible directly after a user clicks an intradocument link in the nav. */
const headerToggle = document.querySelector('header');
let oldScrollVal = 0;

window.addEventListener('scroll', function(event) {
    let newScrollVal = window.pageYOffset;

    if((oldScrollVal - newScrollVal > 0 || this.window.pageYOffset === 0) || 
        document.body.classList.contains('nav-open') || keepHeader) {
        headerToggle.classList.add('header-toggle-on');
        headerToggle.classList.remove('header-toggle-off');
    } else if(oldScrollVal - newScrollVal < 0 && this.window.pageYOffset > 100) {
        headerToggle.classList.remove('header-toggle-on');
        headerToggle.classList.add('header-toggle-off');
    }

    oldScrollVal = newScrollVal;
    keepHeader = false;
});

/* Offset intradocument links such that the header doesn't cover up the section title
 * Source: https://stackoverflow.com/questions/17534661/make-anchor-link-go-some-pixels-above-where-its-linked-to */

 // The function actually applying the offset
function offsetAnchor() {
    if (location.hash.length !== 0) {
      window.scrollTo(window.scrollX, window.scrollY - 80);
    }
  }
  
// Captures click events of all <a> elements with href starting with #
window.addEventListener('hashchange', function(event) {
// Click events are captured before hashchanges. Timeout
// causes offsetAnchor to be called after the page jump.
    window.setTimeout(function() {
      offsetAnchor();
    }, 0);
  });
  
// Set the offset when entering page with hash present in the url
window.setTimeout(offsetAnchor, 0);

/* Select Header link while user is in the corresponding section. 
   For example, if user scrolls to the 'About' section, the 'About' header
   link should be selected (it should be --primary-green). */

// 1. Create an object that maps nav links to their corresponding section ID
const navLinks = document.getElementsByClassName('nav-link');
let sectionToObjects = {};

for(let link of navLinks) {
    let sectionId = link.getAttribute('href');

    if(sectionId !== '#') {
        sectionId = sectionId.substring(1);
        sectionToObjects[sectionId] = [document.getElementById(sectionId), link];
    }
}

/* 2. Use the object created in (1) to determine when we're in a specific secion and
      select the nav link if we are. */

// beginningSectionY is used s.t. we don't have the about section selected before we actually get to it scrolling
const beginningSection = sectionToObjects['about'][0];
const endingLink = sectionToObjects['contact'][1];

window.addEventListener('scroll', function(event) {
    
    // beginning of the about section
    const beginningSectionY = beginningSection.getBoundingClientRect().top;

    
    // go a little beyond the bottom of the viewport so you see the entire section header
    let offset = 50;
    
    // document y position relative to the top of the viewport + the viewport size which gives the document y position 
    // relative to the bottom of the viewport
    let bottomScrollValue = this.window.scrollY + this.window.innerHeight;
    
    // used so that as soon as we find we're between a section element, we don't keep looking for which link to select
    let linkSelected = false;

    // don't select anything yet if we haven't reached the about section
    if(bottomScrollValue > beginningSectionY + document.documentElement.scrollTop + offset) {
        for(const sectionId in sectionToObjects) {
            const section = sectionToObjects[sectionId][0];
            const link = sectionToObjects[sectionId][1];

            // bottom of viewport is in between section element
            if((bottomScrollValue > section.getBoundingClientRect().top + document.documentElement.scrollTop) && 
                (bottomScrollValue < section.getBoundingClientRect().bottom + document.documentElement.scrollTop + offset) && 
                !linkSelected) {
                link.classList.add('section-selected');
                linkSelected = true;
            }
            else {
                link.classList.remove('section-selected');
            }
        }

        // reached the end of the contact section and we go beyond the section's bottom, keep contact selected
        if(!linkSelected) {
            endingLink.classList.add('section-selected');
        }
    }
    else {
        for(const sectionId in sectionToObjects) {
            const link = sectionToObjects[sectionId][1];
            link.classList.remove('section-selected');
        }
    }
});

/* ======= Work and Experience Modal Changer ======= */
const uoButton = document.getElementById('uo');
const uoLawButton = document.getElementById('uo-law');
const pasButton = document.getElementById('pas');

/* Change which modal is visible from clicking each of the buttons
   Button will stay selected indicating which button corresponds to which modal */
let idButtonModal = {
    'uo': [uoButton, 'uo-modal'],
    'uo-law': [uoLawButton, 'uo-law-modal'],
    'pas': [pasButton, 'pas-modal']
};

for(let id in idButtonModal) {
    idButtonModal[id][0].addEventListener('click', (event) => {
        // select clicked button
        event.target.classList.add('selected');
        event.target.classList.remove('unselected');

        // show corresponding modal
        let modal = document.getElementsByClassName(idButtonModal[id][1])[0];
        modal.style.display = 'block';

        for(let otherModalId in idButtonModal) {
            if(otherModalId !== id) {
                // remove active/visible modal
                let otherModal = document.getElementsByClassName(idButtonModal[otherModalId][1])[0];
                otherModal.style.display = 'none';

                // unselect previously active button
                let activeButton = idButtonModal[otherModalId][0];
                activeButton.classList.remove('selected');
                activeButton.classList.add('unselected');
            }
        }
    });
}
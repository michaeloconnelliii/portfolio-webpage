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

/* Stop playing nav transition momentarily on viewport resize. 
   Source: https://stackoverflow.com/questions/63861504/pure-css-hamburger-menu-shows-up-when-resizing-viewport-before-disappearing */
(function () {
    const classes = document.body.classList;
    let timer = null;
    window.addEventListener('resize', function () {
      if (timer){
        clearTimeout(timer);
        timer = null;
      } else {
        classes.add('stop-transition');
      }
      timer = setTimeout(() => {
        classes.remove('stop-transition');
        timer = null;
      }, 100);
    });
  })();

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

// 1. Create an object that maps nav links to their corresponding section ID
const navLinks = document.getElementsByClassName('nav-link');
let sectionToObjects = {};

for(let link of navLinks) {
    let sectionId = link.getAttribute('href');

    // Exclude Resume
    if(sectionId !== "./Michael-O'Connell-Resume.pdf") {
        sectionId = sectionId.substring(1);
        sectionToObjects[sectionId] = [document.getElementById(sectionId), link];
    }
}

/* 2. Use the object created in (1) to determine when we're in a specific secion and
      select the nav link if we are. */

// beginningSectionY is used s.t. we don't have the about section selected before we actually get to it scrolling
const beginningSection = sectionToObjects['about'][0];
const endingLink = sectionToObjects['contact'][1];
let linkSelected = false;

window.addEventListener('scroll', onScroll);

function onScroll() {
    // beginning of the about section
    const beginningSectionY = beginningSection.getBoundingClientRect().top;
    
    // go a little beyond the bottom of the viewport so you see the entire section header
    let offset = 50;

    // document y position relative to the top of the viewport + the viewport size which gives the document y position 
    // relative to the bottom of the viewport
    let bottomScrollValue = this.window.pageYOffset + this.window.innerHeight;

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
                sectionIdSelected = sectionId;
            }
            else {
                link.classList.remove('section-selected');
            }
        }
        // reached the end of the contact section and we go beyond the section's bottom, keep contact selected
        if(!linkSelected) {
            endingLink.classList.add('section-selected');
        }

        linkSelected = false;

    }
    else {
        for(const sectionId in sectionToObjects) {
            const link = sectionToObjects[sectionId][1];
            link.classList.remove('section-selected');
        }
    }
}

/* ======= Slide in effect as user moves into focus with Section ======= */
const sections = document.querySelectorAll('.full-section-container');

const options = {
  root: null,
  threshold: 0,
  rootMargin: "-1px"
};

const observer = new IntersectionObserver(entries => {  
  entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.toggle('encountered')
        observer.unobserve(entry.target);
      }
  });
}, options);


sections.forEach(section => {
  observer.observe(section)
});


/* -- EmailJS --*/
function sendEmail(event) {
  event.preventDefault();

  const params = {
    name: `${document.getElementById("firstname").value} ${document.getElementById("lastname").value}`,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
  }

  const serviceID = "service_gmi5pdq";
  const templateID = "template_rkd4b41";

  emailjs.send(serviceID, templateID, params)
    .then((res) => {
      document.getElementById("firstname").value = "";
      document.getElementById("lastname").value = "";
      document.getElementById("email").value = "";
      document.getElementById("message").value = "";

      console.log(res);
      alert("Your message sent successfully.");
    })
    .catch((err) => {
      console.log(err);
    });

  return false;
};
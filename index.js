// TODO decouple header staying upon clicking a nav link with the two event listeners
// TODO Keep button pressed style border and text color after pressing

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
   
   Keep the header directly after a user clicks an intradocument link in the nav. */
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

/* ======= Work and Experience Modal Changer ======= */
const uoButton = document.getElementById('uo');
const uoLawButton = document.getElementById('uo-law');
const pasButton = document.getElementById('pas');

// change which modal is visible from clicking each of the buttons
let idButtonModal = {
    'uo': [uoButton, 'uo-modal'],
    'uo-law': [uoLawButton, 'uo-law-modal'],
    'pas': [pasButton, 'pas-modal']
};

for(let id in idButtonModal) {
    idButtonModal[id][0].addEventListener('click', (event) => {
        let modal = document.getElementsByClassName(idButtonModal[id][1])[0];
        modal.style.display = 'block';

        for(let otherModalId in idButtonModal) {
            if(otherModalId !== id) {
                let otherModal = document.getElementsByClassName(idButtonModal[otherModalId][1])[0];
                otherModal.style.display = 'none';
            }
        }
    });
}
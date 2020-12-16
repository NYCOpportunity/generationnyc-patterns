'use strict';

class Faq {
  
  constructor(settings) {

    this.settings = {
      selector: (settings) ? settings.selector : Faq.selector
    };

    const faqs = document.querySelectorAll(`${this.settings.selector}`);
    if (faqs) {
      
      Array.prototype.forEach.call(faqs, function (faq) {

        faq.addEventListener('click', function () {
          Faq.toggle(this);
        }, false);

      });
    }
  }
}

/**
 * Toggles the answer for FAQ
 * @param {obj} faq 
 */
Faq.toggle = function(faq) {

  // Toggle the Open and Close spans
  Array.from(faq.getElementsByTagName("span")).forEach(function(el){
    el.classList.toggle('hidden');
  })

  // Toggle the body
  let sibling = faq.parentNode.previousElementSibling;

  if (sibling.getAttribute('aria-hidden') == 'true') {
    sibling.setAttribute("aria-hidden", "false");
  } else {
    sibling.setAttribute("aria-hidden", "true");
  }

  sibling.classList.toggle('hidden');

}

/** @param  {String}  selector  The main selector for the pattern */
Faq.selector = '[js-trigger*="faq"]';

export default Faq;
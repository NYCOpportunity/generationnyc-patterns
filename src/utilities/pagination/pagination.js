'use strict';

class Pagination {
  constructor() {
    this.settings = {
      trigger: Pagination.trigger,
      hash: window.location.hash
    };

    const triggers = document.querySelectorAll(`${this.settings.trigger}`);
    if (triggers) {
      
      // initialize click events
      Array.prototype.forEach.call(triggers, function (t) {
        t.addEventListener('click', function () {
          Pagination.toggle(this);
        }, false);
      });

      // check the hash
      if (this.settings.hash) {
        const el = document.querySelector(`[href="${this.settings.hash}"]`)
        Pagination.toggle(el)
      }

    } else{
      return;
    }
  }
}

Pagination.toggle = function(element){

  // toggle active class on side navigation
  const children = Array.from(element.parentNode.children);

  children.forEach(function(child){
    child.classList.remove('active')
  })

  element.classList.toggle('active')

  // toggle sections
  const active_section = document.querySelector(`${element.getAttribute('href')}`)
  const children_sections = Array.from(active_section.parentNode.children);
  
  children_sections.forEach(function (child) {
    if (child.tagName == 'SECTION'){
      child.classList.add('hidden')
    }
  })

  active_section.classList.remove('hidden');
}

/** @param  {String}  selector  The main selector for the pattern */
Pagination.trigger = '[data-trigger="paginate"]';

export default Pagination;
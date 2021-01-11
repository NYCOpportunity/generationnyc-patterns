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
      } else {
        Pagination.toggle(triggers[0])
      }

    } else{
      return;
    }
  }
}

/**
 * Toggles the active anchor and associated sections
 */
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
      child.classList.remove('active')
    }
  })

  active_section.classList.remove('hidden');
  active_section.classList.add('active');

  // update the text on buttons
  // Pagination.updateLabel()
  
}

/**
 * Update the Previous and Next descriptions
 */
Pagination.updateLabel = function(){
  // get the anchor link that is active
  let container = document.querySelector(Pagination.anchor).parentNode;
  let el = container.querySelectorAll('.active');

  let prev = document.querySelector(Pagination.prev)
  let next = document.querySelector(Pagination.next)
  
  if(el[0].previousElementSibling) {
    prev.textContent = el[0].previousElementSibling.innerText.trim()
    prev.parentElement.parentElement.href = el[0].previousElementSibling.href
  }
  
  if(el[0].nextElementSibling) {
    next.textContent = el[0].nextElementSibling.innerText.trim()
    next.parentElement.parentElement.href = el[0].nextElementSibling.href
  }
}

/** @param  {String}  selector  The main selector for the pattern */
Pagination.trigger = '[data-trigger*="paginate"]';
Pagination.anchor = '[data-trigger*="paginate-anchor"]';
Pagination.prev = '[data-desc*="prev"]';
Pagination.next = '[data-desc*="next"]';

export default Pagination;
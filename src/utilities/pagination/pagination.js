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

      Pagination.updateLabel();

      window.addEventListener("hashchange", function(){
        Pagination.toggle()
        Pagination.updateLabel();
      }, false);


    } else{
      return;
    }
  }
}

/**
 * Toggles the active anchor and associated sections
 */
Pagination.toggle = function(element){

  if(!element) {
    element = document.querySelector(`[href="${window.location.hash}"]`)
  }

  // toggle active class on side navigation
  const children = Array.from(element.parentNode.children);

  children.forEach(function(child){
    child.classList.remove(Pagination.activeClass)
  })

  element.classList.toggle(Pagination.activeClass)

  // toggle sections
  const active_section = document.querySelector(`${element.getAttribute('href')}`)
  const children_sections = Array.from(active_section.parentNode.children);
  
  children_sections.forEach(function (child) {
    if (child.tagName == 'SECTION'){
      child.classList.add(Pagination.hiddenClass)
      child.classList.remove(Pagination.activeClass)
    }
  })

  active_section.classList.remove(Pagination.hiddenClass);
  active_section.classList.add(Pagination.activeClass);

}

/**
 * Update the Previous and Next descriptions
 */
Pagination.updateLabel = function(){
  // get the anchor link that is active
  let container = document.querySelector(Pagination.anchor).parentNode;
  let el = container.querySelectorAll(`.${Pagination.activeClass}`);

  let prev = document.querySelector(Pagination.prev)
  let next = document.querySelector(Pagination.next)
  
  if(el[0].previousElementSibling) {
    prev.textContent = el[0].previousElementSibling.innerText.trim()
    prev.parentElement.parentElement.href = el[0].previousElementSibling.hash
    prev.parentNode.parentElement.classList.remove(Pagination.hiddenClass)
    next.parentNode.parentElement.classList.remove('col-start-2')
  } else {
    prev.parentNode.parentElement.classList.add(Pagination.hiddenClass)
    next.parentNode.parentElement.classList.add('col-start-2')
  }
  
  if(el[0].nextElementSibling) {
    next.textContent = el[0].nextElementSibling.innerText.trim()
    next.parentElement.parentElement.href = el[0].nextElementSibling.hash
    next.parentNode.parentElement.classList.remove(Pagination.hiddenClass)

  } else {
    next.parentNode.parentElement.classList.add(Pagination.hiddenClass)
  }
}

/**
 * Defaults
 */
Pagination.trigger = '[data-trigger*="paginate"]';
Pagination.anchor = '[data-trigger*="paginate-anchor"]';
Pagination.prev = '[data-desc*="prev"]';
Pagination.next = '[data-desc*="next"]';
Pagination.activeClass = 'active';
Pagination.hiddenClass = 'hidden';

export default Pagination;
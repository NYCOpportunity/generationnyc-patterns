'use strict';

class Anchor {
  
  constructor() {
    this.settings = {
      trigger: Anchor.trigger,
      hash: window.location.hash
    };

    const triggers = document.querySelectorAll(`${this.settings.trigger}`);

    if (triggers) {

      // initialize click events
      Array.prototype.forEach.call(triggers, function (t) {
        t.addEventListener('click', function () {
          Anchor.toggle(this);
        }, false);
      });

      // check the hash
      if (this.settings.hash) {
        const el = document.querySelector(`[href="${this.settings.hash}"]`)
        Anchor.toggle(el)
      } else {
        Anchor.toggle(triggers[0])
      }

    } else {
      return;
    }

    // Scroll triggers
    let offsets = Array.prototype.slice.call(triggers).map(x => document.querySelector(x.hash).offsetTop)

    window.onscroll = function () {
      offsets.forEach(function(o, i){
        let sTop = document.documentElement.scrollTop;
        if (sTop >= o ) {
          Anchor.toggle(triggers[i])
        }
      })      
    };
  }
}

/**
 * Toggles the active anchor and associated sections
 */
Anchor.toggle = function (element) {
  if (!element) {
    element = document.querySelector(`[href="${window.location.hash}"]`)
  }

  // toggle active class on side navigation
  const children = Array.from(element.parentNode.children);

  children.forEach(function (child) {
    child.classList.remove(Anchor.activeClass)
  })

  element.classList.toggle(Anchor.activeClass)

  // TODO: resolve throtting on updated state
  // if (window.history.pushState) {
  //   window.history.replaceState(null, null, element.getAttribute('href'));
  // }

}

Anchor.trigger = '[data-trigger*="anchor"]';
Anchor.activeClass = 'active';
Anchor.hiddenClass = 'hidden';

export default Anchor;
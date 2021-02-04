'use strict';

class BackToTop {
  constructor() {
    this.settings = {
      selector: BackToTop.selector,
      stop: BackToTop.stop,
    }

    //check if the button exists
    if (!document.querySelector(this.settings.selector)) return;

    const button = document.querySelector(this.settings.selector);
    const stop = document.querySelector(this.settings.stop);

    window.addEventListener('scroll', function () {
      (document.documentElement.scrollTop == 0) ? button.classList.add('hidden') : button.classList.remove('hidden')

      button.style.bottom = `${BackToTop.calcBottom(stop)}px`

    });
  }
}

/**
 * 
 * Calculate the bottom value for selector
 */
BackToTop.calcBottom = function (element) {
  const eh = element.offsetHeight;
  const wh = window.innerHeight;
  let er = element.getBoundingClientRect();
  let et = er.top;
  let eb = er.bottom;

  return Math.max(0, et > 0 ? Math.min(eh, wh - et) : Math.min(eb, wh))
};

/**
 * Defaults
 */
BackToTop.selector = '[data-js="back-to-top"]'
BackToTop.stop = 'footer'

export default BackToTop;

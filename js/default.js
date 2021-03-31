var Default = (function () {
  'use strict';

  /**
   * The Simple Toggle class. This will toggle the class 'active' and 'hidden'
   * on target elements, determined by a click event on a selected link or
   * element. This will also toggle the aria-hidden attribute for targeted
   * elements to support screen readers. Target settings and other functionality
   * can be controlled through data attributes.
   *
   * This uses the .matches() method which will require a polyfill for IE
   * https://polyfill.io/v2/docs/features/#Element_prototype_matches
   *
   * @class
   */
  class Toggle {
    /**
     * @constructor
     *
     * @param  {Object}  s  Settings for this Toggle instance
     *
     * @return {Object}     The class
     */
    constructor(s) {
      // Create an object to store existing toggle listeners (if it doesn't exist)
      if (!window.hasOwnProperty(Toggle.callback))
        window[Toggle.callback] = [];

      s = (!s) ? {} : s;

      this.settings = {
        selector: (s.selector) ? s.selector : Toggle.selector,
        namespace: (s.namespace) ? s.namespace : Toggle.namespace,
        inactiveClass: (s.inactiveClass) ? s.inactiveClass : Toggle.inactiveClass,
        activeClass: (s.activeClass) ? s.activeClass : Toggle.activeClass,
        before: (s.before) ? s.before : false,
        after: (s.after) ? s.after : false,
        valid: (s.valid) ? s.valid : false,
        focusable: (s.hasOwnProperty('focusable')) ? s.focusable : true,
        jump: (s.hasOwnProperty('jump')) ? s.jump : true
      };

      // Store the element for potential use in callbacks
      this.element = (s.element) ? s.element : false;

      if (this.element) {
        this.element.addEventListener('click', (event) => {
          this.toggle(event);
        });
      } else {
        // If there isn't an existing instantiated toggle, add the event listener.
        if (!window[Toggle.callback].hasOwnProperty(this.settings.selector)) {
          let body = document.querySelector('body');

          for (let i = 0; i < Toggle.events.length; i++) {
            let tggleEvent = Toggle.events[i];

            body.addEventListener(tggleEvent, event => {
              if (!event.target.matches(this.settings.selector))
                return;

              this.event = event;

              let type = event.type.toUpperCase();

              if (
                this[event.type] &&
                Toggle.elements[type] &&
                Toggle.elements[type].includes(event.target.tagName)
              ) this[event.type](event);
            });
          }
        }
      }

      // Record that a toggle using this selector has been instantiated.
      // This prevents double toggling.
      window[Toggle.callback][this.settings.selector] = true;

      return this;
    }

    /**
     * Click event handler
     *
     * @param  {Event}  event  The original click event
     */
    click(event) {
      this.toggle(event);
    }

    /**
     * Input/select/textarea change event handler. Checks to see if the
     * event.target is valid then toggles accordingly.
     *
     * @param  {Event}  event  The original input change event
     */
    change(event) {
      let valid = event.target.checkValidity();

      if (valid && !this.isActive(event.target)) {
        this.toggle(event); // show
      } else if (!valid && this.isActive(event.target)) {
        this.toggle(event); // hide
      }
    }

    /**
     * Check to see if the toggle is active
     *
     * @param  {Object}  element  The toggle element (trigger)
     */
    isActive(element) {
      let active = false;

      if (this.settings.activeClass) {
        active = element.classList.contains(this.settings.activeClass);
      }

      // if () {
        // Toggle.elementAriaRoles
        // TODO: Add catch to see if element aria roles are toggled
      // }

      // if () {
        // Toggle.targetAriaRoles
        // TODO: Add catch to see if target aria roles are toggled
      // }

      return active;
    }

    /**
     * Get the target of the toggle element (trigger)
     *
     * @param  {Object}  el  The toggle element (trigger)
     */
    getTarget(element) {
      let target = false;

      /** Anchor Links */
      target = (element.hasAttribute('href')) ?
        document.querySelector(element.getAttribute('href')) : target;

      /** Toggle Controls */
      target = (element.hasAttribute('aria-controls')) ?
        document.querySelector(`#${element.getAttribute('aria-controls')}`) : target;

      return target;
    }

    /**
     * The toggle event proxy for getting and setting the element/s and target
     *
     * @param  {Object}  event  The main click event
     *
     * @return {Object}         The Toggle instance
     */
    toggle(event) {
      let element = event.target;
      let target = false;
      let focusable = [];

      event.preventDefault();

      target = this.getTarget(element);

      /** Focusable Children */
      focusable = (target) ?
        target.querySelectorAll(Toggle.elFocusable.join(', ')) : focusable;

      /** Main Functionality */
      if (!target) return this;
      this.elementToggle(element, target, focusable);

      /** Undo */
      if (element.dataset[`${this.settings.namespace}Undo`]) {
        const undo = document.querySelector(
          element.dataset[`${this.settings.namespace}Undo`]
        );

        undo.addEventListener('click', (event) => {
          event.preventDefault();
          this.elementToggle(element, target);
          undo.removeEventListener('click');
        });
      }

      return this;
    }

    /**
     * Get other toggles that might control the same element
     *
     * @param   {Object}    element  The toggling element
     *
     * @return  {NodeList}           List of other toggling elements
     *                               that control the target
     */
    getOthers(element) {
      let selector = false;

      if (element.hasAttribute('href')) {
        selector = `[href="${element.getAttribute('href')}"]`;
      } else if (element.hasAttribute('aria-controls')) {
        selector = `[aria-controls="${element.getAttribute('aria-controls')}"]`;
      }

      return (selector) ? document.querySelectorAll(selector) : [];
    }

    /**
     * Hide the Toggle Target's focusable children from focus.
     * If an element has the data-attribute `data-toggle-tabindex`
     * it will use that as the default tab index of the element.
     *
     * @param   {NodeList}  elements  List of focusable elements
     *
     * @return  {Object}              The Toggle Instance
     */
    toggleFocusable(elements) {
      elements.forEach(element => {
        let tabindex = element.getAttribute('tabindex');

        if (tabindex === '-1') {
          let dataDefault = element
            .getAttribute(`data-${Toggle.namespace}-tabindex`);

          if (dataDefault) {
            element.setAttribute('tabindex', dataDefault);
          } else {
            element.removeAttribute('tabindex');
          }
        } else {
          element.setAttribute('tabindex', '-1');
        }
      });

      return this;
    }

    /**
     * Jumps to Element visibly and shifts focus
     * to the element by setting the tabindex
     *
     * @param   {Object}  element  The Toggling Element
     * @param   {Object}  target   The Target Element
     *
     * @return  {Object}           The Toggle instance
     */
    jumpTo(element, target) {
      // Reset the history state. This will clear out
      // the hash when the target is toggled closed
      history.pushState('', '',
        window.location.pathname + window.location.search);

      // Focus if active
      if (target.classList.contains(this.settings.activeClass)) {
        window.location.hash = element.getAttribute('href');

        target.setAttribute('tabindex', '0');
        target.focus({preventScroll: true});
      } else {
        target.removeAttribute('tabindex');
      }

      return this;
    }

    /**
     * The main toggling method for attributes
     *
     * @param  {Object}    element    The Toggle element
     * @param  {Object}    target     The Target element to toggle active/hidden
     * @param  {NodeList}  focusable  Any focusable children in the target
     *
     * @return {Object}               The Toggle instance
     */
    elementToggle(element, target, focusable = []) {
      let i = 0;
      let attr = '';
      let value = '';

      /**
       * Store elements for potential use in callbacks
       */

      this.element = element;
      this.target = target;
      this.others = this.getOthers(element);
      this.focusable = focusable;

      /**
       * Validity method property that will cancel the toggle if it returns false
       */

      if (this.settings.valid && !this.settings.valid(this))
        return this;

      /**
       * Toggling before hook
       */

      if (this.settings.before)
        this.settings.before(this);

      /**
       * Toggle Element and Target classes
       */

      if (this.settings.activeClass) {
        this.element.classList.toggle(this.settings.activeClass);
        this.target.classList.toggle(this.settings.activeClass);

        // If there are other toggles that control the same element
        this.others.forEach(other => {
          if (other !== this.element)
            other.classList.toggle(this.settings.activeClass);
        });
      }

      if (this.settings.inactiveClass)
        target.classList.toggle(this.settings.inactiveClass);

      /**
       * Target Element Aria Attributes
       */

      for (i = 0; i < Toggle.targetAriaRoles.length; i++) {
        attr = Toggle.targetAriaRoles[i];
        value = this.target.getAttribute(attr);

        if (value != '' && value)
          this.target.setAttribute(attr, (value === 'true') ? 'false' : 'true');
      }

      /**
       * Toggle the target's focusable children tabindex
       */

      if (this.settings.focusable)
        this.toggleFocusable(this.focusable);

      /**
       * Jump to Target Element if Toggle Element is an anchor link
       */

      if (this.settings.jump && this.element.hasAttribute('href'))
        this.jumpTo(this.element, this.target);

      /**
       * Toggle Element (including multi toggles) Aria Attributes
       */

      for (i = 0; i < Toggle.elAriaRoles.length; i++) {
        attr = Toggle.elAriaRoles[i];
        value = this.element.getAttribute(attr);

        if (value != '' && value)
          this.element.setAttribute(attr, (value === 'true') ? 'false' : 'true');

        // If there are other toggles that control the same element
        this.others.forEach((other) => {
          if (other !== this.element && other.getAttribute(attr))
            other.setAttribute(attr, (value === 'true') ? 'false' : 'true');
        });
      }

      /**
       * Toggling complete hook
       */

      if (this.settings.after)
        this.settings.after(this);

      return this;
    }
  }

  /** @type  {String}  The main selector to add the toggling function to */
  Toggle.selector = '[data-js*="toggle"]';

  /** @type  {String}  The namespace for our data attribute settings */
  Toggle.namespace = 'toggle';

  /** @type  {String}  The hide class */
  Toggle.inactiveClass = 'hidden';

  /** @type  {String}  The active class */
  Toggle.activeClass = 'active';

  /** @type  {Array}  Aria roles to toggle true/false on the toggling element */
  Toggle.elAriaRoles = ['aria-pressed', 'aria-expanded'];

  /** @type  {Array}  Aria roles to toggle true/false on the target element */
  Toggle.targetAriaRoles = ['aria-hidden'];

  /** @type  {Array}  Focusable elements to hide within the hidden target element */
  Toggle.elFocusable = [
    'a', 'button', 'input', 'select', 'textarea', 'object', 'embed', 'form',
    'fieldset', 'legend', 'label', 'area', 'audio', 'video', 'iframe', 'svg',
    'details', 'table', '[tabindex]', '[contenteditable]', '[usemap]'
  ];

  /** @type  {Array}  Key attribute for storing toggles in the window */
  Toggle.callback = ['TogglesCallback'];

  /** @type  {Array}  Default events to to watch for toggling. Each must have a handler in the class and elements to look for in Toggle.elements */
  Toggle.events = ['click', 'change'];

  /** @type  {Array}  Elements to delegate to each event handler */
  Toggle.elements = {
    CLICK: ['A', 'BUTTON'],
    CHANGE: ['SELECT', 'INPUT', 'TEXTAREA']
  };

  class Accordion {
    constructor() {
      this.settings = new Toggle({
        selector: Accordion.selector
      });

      return this;
    }
  }

  /** @param  {String}  selector  The main selector for the pattern */
  Accordion.selector = '[data-js*="accordion"]';

  class BackToTop {
    constructor() {
      this.settings = {
        selector: BackToTop.selector,
        stop: BackToTop.stop,
      };

      //check if the button exists
      if (!document.querySelector(this.settings.selector)) return;

      const button = document.querySelector(this.settings.selector);
      const stop = document.querySelector(this.settings.stop);

      window.addEventListener('scroll', function () {
        (document.documentElement.scrollTop == 0) ? button.classList.add('hidden') : button.classList.remove('hidden');

        button.style.bottom = `${BackToTop.calcBottom(stop)}px`;

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
  BackToTop.selector = '[data-js="back-to-top"]';
  BackToTop.stop = 'footer';

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
    });

    // Toggle the body
    let sibling = faq.parentNode.previousElementSibling;

    if (sibling.getAttribute('aria-hidden') == 'true') {
      sibling.setAttribute("aria-hidden", "false");
    } else {
      sibling.setAttribute("aria-hidden", "true");
    }

    sibling.classList.toggle('hidden');

  };

  /** @param  {String}  selector  The main selector for the pattern */
  Faq.selector = '[js-trigger*="faq"]';

  class Navigation {
   
    constructor(settings, data) {
      this.settings = new Toggle({
        selector: Navigation.selector
      });

      return this;
    }
  }

  Navigation.selector = '[data-js*="navigation"]';

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
          const el = document.querySelector(`[href="${this.settings.hash}"]`);
          Anchor.toggle(el);
        } else {
          Anchor.toggle(triggers[0]);
        }

      } else {
        return;
      }

      // Scroll triggers
      let offsets = Array.prototype.slice.call(triggers).map(x => document.querySelector(x.hash).offsetTop);

      window.onscroll = function () {
        offsets.forEach(function(o, i){
          let sTop = document.documentElement.scrollTop;
          if (sTop >= o ) {
            Anchor.toggle(triggers[i]);
          }
        });      
      };
    }
  }

  /**
   * Toggles the active anchor and associated sections
   */
  Anchor.toggle = function (element) {
    if (!element) {
      element = document.querySelector(`[href="${window.location.hash}"]`);
    }

    // toggle active class on side navigation
    const children = Array.from(element.parentNode.children);

    children.forEach(function (child) {
      child.classList.remove(Anchor.activeClass);
    });

    element.classList.toggle(Anchor.activeClass);

    // TODO: resolve throtting on updated state
    // if (window.history.pushState) {
    //   window.history.replaceState(null, null, element.getAttribute('href'));
    // }

  };

  Anchor.trigger = '[data-trigger*="anchor"]';
  Anchor.activeClass = 'active';
  Anchor.hiddenClass = 'hidden';

  class Copy {
    constructor() {

      let copies = document.querySelectorAll(Copy.selector);

      copies.forEach(function (copy) {
        copy.addEventListener('click', function (event) {
          Copy.getCopy(event.target);
        });
      });
    }
  }

  /**
   * Copy the Markup
   */
  Copy.getCopy = function (el) {
    let curText = el.innerText;
    let content = document.querySelector(`[data-content*="${el.getAttribute('data-js')}"]`);
    let contentArea = document.createElement("textarea");

    contentArea.style.opacity = 0;
    document.body.appendChild(contentArea);
    contentArea.value = content.innerText;
    contentArea.select();
    document.execCommand("copy");
    document.body.removeChild(contentArea);

    el.innerText = 'Copied!';

    setTimeout(function () {
      el.innerText = curText;
    }, 3000);

  };
  /** @param  {String}  selector  The main selector for the pattern */
  Copy.selector = '[data-js*="copy"]';
  Copy.content = '[data-content*="copy"]';

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
          const el = document.querySelector(`[href="${this.settings.hash}"]`);
          Pagination.toggle(el);
        } else {
          Pagination.toggle(triggers[0]);
        }

        Pagination.updateLabel();

        window.addEventListener("hashchange", function(){
          Pagination.toggle();
          Pagination.updateLabel();
        }, false);


      } else {
        return;
      }
    }
  }

  /**
   * Toggles the active anchor and associated sections
   */
  Pagination.toggle = function(element){

    if(!element) {
      element = document.querySelector(`[href="${window.location.hash}"]`);
    }

    // toggle active class on side navigation
    const children = Array.from(element.parentNode.children);

    children.forEach(function(child){
      child.classList.remove(Pagination.activeClass);
    });

    element.classList.toggle(Pagination.activeClass);

    // toggle sections
    const active_section = document.querySelector(`${element.getAttribute('href')}`);
    const children_sections = Array.from(active_section.parentNode.children);
    
    children_sections.forEach(function (child) {
      if (child.tagName == 'SECTION'){
        child.classList.add(Pagination.hiddenClass);
        child.classList.remove(Pagination.activeClass);
      }
    });

    active_section.classList.remove(Pagination.hiddenClass);
    active_section.classList.add(Pagination.activeClass);

  };

  /**
   * Update the Previous and Next descriptions
   */
  Pagination.updateLabel = function(){
    // get the anchor link that is active
    let container = document.querySelector(Pagination.anchor).parentNode;
    let el = container.querySelectorAll(`.${Pagination.activeClass}`);

    let prev = document.querySelector(Pagination.prev);
    let next = document.querySelector(Pagination.next);
    
    if(el[0].previousElementSibling) {
      prev.textContent = el[0].previousElementSibling.innerText.trim();
      prev.parentElement.parentElement.href = el[0].previousElementSibling.hash;
      prev.parentNode.parentElement.classList.remove(Pagination.hiddenClass);
      next.parentNode.parentElement.classList.remove('col-start-2');
    } else {
      prev.parentNode.parentElement.classList.add(Pagination.hiddenClass);
      next.parentNode.parentElement.classList.add('col-start-2');
    }
    
    if(el[0].nextElementSibling) {
      next.textContent = el[0].nextElementSibling.innerText.trim();
      next.parentElement.parentElement.href = el[0].nextElementSibling.hash;
      next.parentNode.parentElement.classList.remove(Pagination.hiddenClass);

    } else {
      next.parentNode.parentElement.classList.add(Pagination.hiddenClass);
    }
  };

  /**
   * Defaults
   */
  Pagination.trigger = '[data-trigger*="paginate"]';
  Pagination.anchor = '[data-trigger*="paginate-anchor"]';
  Pagination.prev = '[data-desc*="prev"]';
  Pagination.next = '[data-desc*="next"]';
  Pagination.activeClass = 'active';
  Pagination.hiddenClass = 'hidden';

  /**
   * Methods for the main Patterns instance.
   */
  class Default {
    constructor() {
      console.dir('@pttrn Development Mode'); // eslint-disable-line no-console
    }

    faq() {
      return new Faq();
    }

    pagination() {
      return new Pagination();
    }

    accordion() {
      return new Accordion();
    }

    navigation() {
      return new Navigation();
    }

    anchor() {
      return new Anchor();
    }

    copy() {
      return new Copy();
    }

    back2Top() {
      return new BackToTop();
    }

  }

  return Default;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90b2dnbGUvdG9nZ2xlLmpzIiwiLi4vLi4vc3JjL2NvbXBvbmVudHMvYWNjb3JkaW9uL2FjY29yZGlvbi5qcyIsIi4uLy4uL3NyYy9jb21wb25lbnRzL2JhY2stdG8tdG9wL2JhY2stdG8tdG9wLmpzIiwiLi4vLi4vc3JjL2NvbXBvbmVudHMvY2FyZC9mYXEtY2FyZC5qcyIsIi4uLy4uL3NyYy9vYmplY3RzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5qcyIsIi4uLy4uL3NyYy91dGlsaXRpZXMvYW5jaG9yL2FuY2hvci5qcyIsIi4uLy4uL3NyYy91dGlsaXRpZXMvY29weS9jb3B5LmpzIiwiLi4vLi4vc3JjL3V0aWxpdGllcy9wYWdpbmF0aW9uL3BhZ2luYXRpb24uanMiLCIuLi8uLi9zcmMvanMvZGVmYXVsdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVGhlIFNpbXBsZSBUb2dnbGUgY2xhc3MuIFRoaXMgd2lsbCB0b2dnbGUgdGhlIGNsYXNzICdhY3RpdmUnIGFuZCAnaGlkZGVuJ1xuICogb24gdGFyZ2V0IGVsZW1lbnRzLCBkZXRlcm1pbmVkIGJ5IGEgY2xpY2sgZXZlbnQgb24gYSBzZWxlY3RlZCBsaW5rIG9yXG4gKiBlbGVtZW50LiBUaGlzIHdpbGwgYWxzbyB0b2dnbGUgdGhlIGFyaWEtaGlkZGVuIGF0dHJpYnV0ZSBmb3IgdGFyZ2V0ZWRcbiAqIGVsZW1lbnRzIHRvIHN1cHBvcnQgc2NyZWVuIHJlYWRlcnMuIFRhcmdldCBzZXR0aW5ncyBhbmQgb3RoZXIgZnVuY3Rpb25hbGl0eVxuICogY2FuIGJlIGNvbnRyb2xsZWQgdGhyb3VnaCBkYXRhIGF0dHJpYnV0ZXMuXG4gKlxuICogVGhpcyB1c2VzIHRoZSAubWF0Y2hlcygpIG1ldGhvZCB3aGljaCB3aWxsIHJlcXVpcmUgYSBwb2x5ZmlsbCBmb3IgSUVcbiAqIGh0dHBzOi8vcG9seWZpbGwuaW8vdjIvZG9jcy9mZWF0dXJlcy8jRWxlbWVudF9wcm90b3R5cGVfbWF0Y2hlc1xuICpcbiAqIEBjbGFzc1xuICovXG5jbGFzcyBUb2dnbGUge1xuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gIHMgIFNldHRpbmdzIGZvciB0aGlzIFRvZ2dsZSBpbnN0YW5jZVxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICBUaGUgY2xhc3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHMpIHtcbiAgICAvLyBDcmVhdGUgYW4gb2JqZWN0IHRvIHN0b3JlIGV4aXN0aW5nIHRvZ2dsZSBsaXN0ZW5lcnMgKGlmIGl0IGRvZXNuJ3QgZXhpc3QpXG4gICAgaWYgKCF3aW5kb3cuaGFzT3duUHJvcGVydHkoVG9nZ2xlLmNhbGxiYWNrKSlcbiAgICAgIHdpbmRvd1tUb2dnbGUuY2FsbGJhY2tdID0gW107XG5cbiAgICBzID0gKCFzKSA/IHt9IDogcztcblxuICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICBzZWxlY3RvcjogKHMuc2VsZWN0b3IpID8gcy5zZWxlY3RvciA6IFRvZ2dsZS5zZWxlY3RvcixcbiAgICAgIG5hbWVzcGFjZTogKHMubmFtZXNwYWNlKSA/IHMubmFtZXNwYWNlIDogVG9nZ2xlLm5hbWVzcGFjZSxcbiAgICAgIGluYWN0aXZlQ2xhc3M6IChzLmluYWN0aXZlQ2xhc3MpID8gcy5pbmFjdGl2ZUNsYXNzIDogVG9nZ2xlLmluYWN0aXZlQ2xhc3MsXG4gICAgICBhY3RpdmVDbGFzczogKHMuYWN0aXZlQ2xhc3MpID8gcy5hY3RpdmVDbGFzcyA6IFRvZ2dsZS5hY3RpdmVDbGFzcyxcbiAgICAgIGJlZm9yZTogKHMuYmVmb3JlKSA/IHMuYmVmb3JlIDogZmFsc2UsXG4gICAgICBhZnRlcjogKHMuYWZ0ZXIpID8gcy5hZnRlciA6IGZhbHNlLFxuICAgICAgdmFsaWQ6IChzLnZhbGlkKSA/IHMudmFsaWQgOiBmYWxzZSxcbiAgICAgIGZvY3VzYWJsZTogKHMuaGFzT3duUHJvcGVydHkoJ2ZvY3VzYWJsZScpKSA/IHMuZm9jdXNhYmxlIDogdHJ1ZSxcbiAgICAgIGp1bXA6IChzLmhhc093blByb3BlcnR5KCdqdW1wJykpID8gcy5qdW1wIDogdHJ1ZVxuICAgIH07XG5cbiAgICAvLyBTdG9yZSB0aGUgZWxlbWVudCBmb3IgcG90ZW50aWFsIHVzZSBpbiBjYWxsYmFja3NcbiAgICB0aGlzLmVsZW1lbnQgPSAocy5lbGVtZW50KSA/IHMuZWxlbWVudCA6IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlKGV2ZW50KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0aGVyZSBpc24ndCBhbiBleGlzdGluZyBpbnN0YW50aWF0ZWQgdG9nZ2xlLCBhZGQgdGhlIGV2ZW50IGxpc3RlbmVyLlxuICAgICAgaWYgKCF3aW5kb3dbVG9nZ2xlLmNhbGxiYWNrXS5oYXNPd25Qcm9wZXJ0eSh0aGlzLnNldHRpbmdzLnNlbGVjdG9yKSkge1xuICAgICAgICBsZXQgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFRvZ2dsZS5ldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgdGdnbGVFdmVudCA9IFRvZ2dsZS5ldmVudHNbaV07XG5cbiAgICAgICAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIodGdnbGVFdmVudCwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgaWYgKCFldmVudC50YXJnZXQubWF0Y2hlcyh0aGlzLnNldHRpbmdzLnNlbGVjdG9yKSlcbiAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLmV2ZW50ID0gZXZlbnQ7XG5cbiAgICAgICAgICAgIGxldCB0eXBlID0gZXZlbnQudHlwZS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHRoaXNbZXZlbnQudHlwZV0gJiZcbiAgICAgICAgICAgICAgVG9nZ2xlLmVsZW1lbnRzW3R5cGVdICYmXG4gICAgICAgICAgICAgIFRvZ2dsZS5lbGVtZW50c1t0eXBlXS5pbmNsdWRlcyhldmVudC50YXJnZXQudGFnTmFtZSlcbiAgICAgICAgICAgICkgdGhpc1tldmVudC50eXBlXShldmVudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZWNvcmQgdGhhdCBhIHRvZ2dsZSB1c2luZyB0aGlzIHNlbGVjdG9yIGhhcyBiZWVuIGluc3RhbnRpYXRlZC5cbiAgICAvLyBUaGlzIHByZXZlbnRzIGRvdWJsZSB0b2dnbGluZy5cbiAgICB3aW5kb3dbVG9nZ2xlLmNhbGxiYWNrXVt0aGlzLnNldHRpbmdzLnNlbGVjdG9yXSA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGljayBldmVudCBoYW5kbGVyXG4gICAqXG4gICAqIEBwYXJhbSAge0V2ZW50fSAgZXZlbnQgIFRoZSBvcmlnaW5hbCBjbGljayBldmVudFxuICAgKi9cbiAgY2xpY2soZXZlbnQpIHtcbiAgICB0aGlzLnRvZ2dsZShldmVudCk7XG4gIH1cblxuICAvKipcbiAgICogSW5wdXQvc2VsZWN0L3RleHRhcmVhIGNoYW5nZSBldmVudCBoYW5kbGVyLiBDaGVja3MgdG8gc2VlIGlmIHRoZVxuICAgKiBldmVudC50YXJnZXQgaXMgdmFsaWQgdGhlbiB0b2dnbGVzIGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBAcGFyYW0gIHtFdmVudH0gIGV2ZW50ICBUaGUgb3JpZ2luYWwgaW5wdXQgY2hhbmdlIGV2ZW50XG4gICAqL1xuICBjaGFuZ2UoZXZlbnQpIHtcbiAgICBsZXQgdmFsaWQgPSBldmVudC50YXJnZXQuY2hlY2tWYWxpZGl0eSgpO1xuXG4gICAgaWYgKHZhbGlkICYmICF0aGlzLmlzQWN0aXZlKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50KTsgLy8gc2hvd1xuICAgIH0gZWxzZSBpZiAoIXZhbGlkICYmIHRoaXMuaXNBY3RpdmUoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnQpOyAvLyBoaWRlXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRvIHNlZSBpZiB0aGUgdG9nZ2xlIGlzIGFjdGl2ZVxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBlbGVtZW50ICBUaGUgdG9nZ2xlIGVsZW1lbnQgKHRyaWdnZXIpXG4gICAqL1xuICBpc0FjdGl2ZShlbGVtZW50KSB7XG4gICAgbGV0IGFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3MpIHtcbiAgICAgIGFjdGl2ZSA9IGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3MpXG4gICAgfVxuXG4gICAgLy8gaWYgKCkge1xuICAgICAgLy8gVG9nZ2xlLmVsZW1lbnRBcmlhUm9sZXNcbiAgICAgIC8vIFRPRE86IEFkZCBjYXRjaCB0byBzZWUgaWYgZWxlbWVudCBhcmlhIHJvbGVzIGFyZSB0b2dnbGVkXG4gICAgLy8gfVxuXG4gICAgLy8gaWYgKCkge1xuICAgICAgLy8gVG9nZ2xlLnRhcmdldEFyaWFSb2xlc1xuICAgICAgLy8gVE9ETzogQWRkIGNhdGNoIHRvIHNlZSBpZiB0YXJnZXQgYXJpYSByb2xlcyBhcmUgdG9nZ2xlZFxuICAgIC8vIH1cblxuICAgIHJldHVybiBhY3RpdmU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB0YXJnZXQgb2YgdGhlIHRvZ2dsZSBlbGVtZW50ICh0cmlnZ2VyKVxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBlbCAgVGhlIHRvZ2dsZSBlbGVtZW50ICh0cmlnZ2VyKVxuICAgKi9cbiAgZ2V0VGFyZ2V0KGVsZW1lbnQpIHtcbiAgICBsZXQgdGFyZ2V0ID0gZmFsc2U7XG5cbiAgICAvKiogQW5jaG9yIExpbmtzICovXG4gICAgdGFyZ2V0ID0gKGVsZW1lbnQuaGFzQXR0cmlidXRlKCdocmVmJykpID9cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSkgOiB0YXJnZXQ7XG5cbiAgICAvKiogVG9nZ2xlIENvbnRyb2xzICovXG4gICAgdGFyZ2V0ID0gKGVsZW1lbnQuaGFzQXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpID9cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyl9YCkgOiB0YXJnZXQ7XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0b2dnbGUgZXZlbnQgcHJveHkgZm9yIGdldHRpbmcgYW5kIHNldHRpbmcgdGhlIGVsZW1lbnQvcyBhbmQgdGFyZ2V0XG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gIGV2ZW50ICBUaGUgbWFpbiBjbGljayBldmVudFxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgVGhlIFRvZ2dsZSBpbnN0YW5jZVxuICAgKi9cbiAgdG9nZ2xlKGV2ZW50KSB7XG4gICAgbGV0IGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XG4gICAgbGV0IHRhcmdldCA9IGZhbHNlO1xuICAgIGxldCBmb2N1c2FibGUgPSBbXTtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB0YXJnZXQgPSB0aGlzLmdldFRhcmdldChlbGVtZW50KTtcblxuICAgIC8qKiBGb2N1c2FibGUgQ2hpbGRyZW4gKi9cbiAgICBmb2N1c2FibGUgPSAodGFyZ2V0KSA/XG4gICAgICB0YXJnZXQucXVlcnlTZWxlY3RvckFsbChUb2dnbGUuZWxGb2N1c2FibGUuam9pbignLCAnKSkgOiBmb2N1c2FibGU7XG5cbiAgICAvKiogTWFpbiBGdW5jdGlvbmFsaXR5ICovXG4gICAgaWYgKCF0YXJnZXQpIHJldHVybiB0aGlzO1xuICAgIHRoaXMuZWxlbWVudFRvZ2dsZShlbGVtZW50LCB0YXJnZXQsIGZvY3VzYWJsZSk7XG5cbiAgICAvKiogVW5kbyAqL1xuICAgIGlmIChlbGVtZW50LmRhdGFzZXRbYCR7dGhpcy5zZXR0aW5ncy5uYW1lc3BhY2V9VW5kb2BdKSB7XG4gICAgICBjb25zdCB1bmRvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgZWxlbWVudC5kYXRhc2V0W2Ake3RoaXMuc2V0dGluZ3MubmFtZXNwYWNlfVVuZG9gXVxuICAgICAgKTtcblxuICAgICAgdW5kby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmVsZW1lbnRUb2dnbGUoZWxlbWVudCwgdGFyZ2V0KTtcbiAgICAgICAgdW5kby5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IG90aGVyIHRvZ2dsZXMgdGhhdCBtaWdodCBjb250cm9sIHRoZSBzYW1lIGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtICAge09iamVjdH0gICAgZWxlbWVudCAgVGhlIHRvZ2dsaW5nIGVsZW1lbnRcbiAgICpcbiAgICogQHJldHVybiAge05vZGVMaXN0fSAgICAgICAgICAgTGlzdCBvZiBvdGhlciB0b2dnbGluZyBlbGVtZW50c1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0IGNvbnRyb2wgdGhlIHRhcmdldFxuICAgKi9cbiAgZ2V0T3RoZXJzKGVsZW1lbnQpIHtcbiAgICBsZXQgc2VsZWN0b3IgPSBmYWxzZTtcblxuICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaHJlZicpKSB7XG4gICAgICBzZWxlY3RvciA9IGBbaHJlZj1cIiR7ZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1cIl1gO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKSkge1xuICAgICAgc2VsZWN0b3IgPSBgW2FyaWEtY29udHJvbHM9XCIke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyl9XCJdYDtcbiAgICB9XG5cbiAgICByZXR1cm4gKHNlbGVjdG9yKSA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpIDogW107XG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0aGUgVG9nZ2xlIFRhcmdldCdzIGZvY3VzYWJsZSBjaGlsZHJlbiBmcm9tIGZvY3VzLlxuICAgKiBJZiBhbiBlbGVtZW50IGhhcyB0aGUgZGF0YS1hdHRyaWJ1dGUgYGRhdGEtdG9nZ2xlLXRhYmluZGV4YFxuICAgKiBpdCB3aWxsIHVzZSB0aGF0IGFzIHRoZSBkZWZhdWx0IHRhYiBpbmRleCBvZiB0aGUgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtICAge05vZGVMaXN0fSAgZWxlbWVudHMgIExpc3Qgb2YgZm9jdXNhYmxlIGVsZW1lbnRzXG4gICAqXG4gICAqIEByZXR1cm4gIHtPYmplY3R9ICAgICAgICAgICAgICBUaGUgVG9nZ2xlIEluc3RhbmNlXG4gICAqL1xuICB0b2dnbGVGb2N1c2FibGUoZWxlbWVudHMpIHtcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgbGV0IHRhYmluZGV4ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG5cbiAgICAgIGlmICh0YWJpbmRleCA9PT0gJy0xJykge1xuICAgICAgICBsZXQgZGF0YURlZmF1bHQgPSBlbGVtZW50XG4gICAgICAgICAgLmdldEF0dHJpYnV0ZShgZGF0YS0ke1RvZ2dsZS5uYW1lc3BhY2V9LXRhYmluZGV4YCk7XG5cbiAgICAgICAgaWYgKGRhdGFEZWZhdWx0KSB7XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgZGF0YURlZmF1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEp1bXBzIHRvIEVsZW1lbnQgdmlzaWJseSBhbmQgc2hpZnRzIGZvY3VzXG4gICAqIHRvIHRoZSBlbGVtZW50IGJ5IHNldHRpbmcgdGhlIHRhYmluZGV4XG4gICAqXG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICBlbGVtZW50ICBUaGUgVG9nZ2xpbmcgRWxlbWVudFxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgdGFyZ2V0ICAgVGhlIFRhcmdldCBFbGVtZW50XG4gICAqXG4gICAqIEByZXR1cm4gIHtPYmplY3R9ICAgICAgICAgICBUaGUgVG9nZ2xlIGluc3RhbmNlXG4gICAqL1xuICBqdW1wVG8oZWxlbWVudCwgdGFyZ2V0KSB7XG4gICAgLy8gUmVzZXQgdGhlIGhpc3Rvcnkgc3RhdGUuIFRoaXMgd2lsbCBjbGVhciBvdXRcbiAgICAvLyB0aGUgaGFzaCB3aGVuIHRoZSB0YXJnZXQgaXMgdG9nZ2xlZCBjbG9zZWRcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSgnJywgJycsXG4gICAgICB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcblxuICAgIC8vIEZvY3VzIGlmIGFjdGl2ZVxuICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3MpKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcbiAgICAgIHRhcmdldC5mb2N1cyh7cHJldmVudFNjcm9sbDogdHJ1ZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtYWluIHRvZ2dsaW5nIG1ldGhvZCBmb3IgYXR0cmlidXRlc1xuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgIGVsZW1lbnQgICAgVGhlIFRvZ2dsZSBlbGVtZW50XG4gICAqIEBwYXJhbSAge09iamVjdH0gICAgdGFyZ2V0ICAgICBUaGUgVGFyZ2V0IGVsZW1lbnQgdG8gdG9nZ2xlIGFjdGl2ZS9oaWRkZW5cbiAgICogQHBhcmFtICB7Tm9kZUxpc3R9ICBmb2N1c2FibGUgIEFueSBmb2N1c2FibGUgY2hpbGRyZW4gaW4gdGhlIHRhcmdldFxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgVGhlIFRvZ2dsZSBpbnN0YW5jZVxuICAgKi9cbiAgZWxlbWVudFRvZ2dsZShlbGVtZW50LCB0YXJnZXQsIGZvY3VzYWJsZSA9IFtdKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCBhdHRyID0gJyc7XG4gICAgbGV0IHZhbHVlID0gJyc7XG5cbiAgICAvKipcbiAgICAgKiBTdG9yZSBlbGVtZW50cyBmb3IgcG90ZW50aWFsIHVzZSBpbiBjYWxsYmFja3NcbiAgICAgKi9cblxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy5vdGhlcnMgPSB0aGlzLmdldE90aGVycyhlbGVtZW50KTtcbiAgICB0aGlzLmZvY3VzYWJsZSA9IGZvY3VzYWJsZTtcblxuICAgIC8qKlxuICAgICAqIFZhbGlkaXR5IG1ldGhvZCBwcm9wZXJ0eSB0aGF0IHdpbGwgY2FuY2VsIHRoZSB0b2dnbGUgaWYgaXQgcmV0dXJucyBmYWxzZVxuICAgICAqL1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MudmFsaWQgJiYgIXRoaXMuc2V0dGluZ3MudmFsaWQodGhpcykpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsaW5nIGJlZm9yZSBob29rXG4gICAgICovXG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5iZWZvcmUpXG4gICAgICB0aGlzLnNldHRpbmdzLmJlZm9yZSh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSBFbGVtZW50IGFuZCBUYXJnZXQgY2xhc3Nlc1xuICAgICAqL1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3MpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3MpO1xuICAgICAgdGhpcy50YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIG90aGVyIHRvZ2dsZXMgdGhhdCBjb250cm9sIHRoZSBzYW1lIGVsZW1lbnRcbiAgICAgIHRoaXMub3RoZXJzLmZvckVhY2gob3RoZXIgPT4ge1xuICAgICAgICBpZiAob3RoZXIgIT09IHRoaXMuZWxlbWVudClcbiAgICAgICAgICBvdGhlci5jbGFzc0xpc3QudG9nZ2xlKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuaW5hY3RpdmVDbGFzcylcbiAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKHRoaXMuc2V0dGluZ3MuaW5hY3RpdmVDbGFzcyk7XG5cbiAgICAvKipcbiAgICAgKiBUYXJnZXQgRWxlbWVudCBBcmlhIEF0dHJpYnV0ZXNcbiAgICAgKi9cblxuICAgIGZvciAoaSA9IDA7IGkgPCBUb2dnbGUudGFyZ2V0QXJpYVJvbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRyID0gVG9nZ2xlLnRhcmdldEFyaWFSb2xlc1tpXTtcbiAgICAgIHZhbHVlID0gdGhpcy50YXJnZXQuZ2V0QXR0cmlidXRlKGF0dHIpO1xuXG4gICAgICBpZiAodmFsdWUgIT0gJycgJiYgdmFsdWUpXG4gICAgICAgIHRoaXMudGFyZ2V0LnNldEF0dHJpYnV0ZShhdHRyLCAodmFsdWUgPT09ICd0cnVlJykgPyAnZmFsc2UnIDogJ3RydWUnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgdGhlIHRhcmdldCdzIGZvY3VzYWJsZSBjaGlsZHJlbiB0YWJpbmRleFxuICAgICAqL1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZm9jdXNhYmxlKVxuICAgICAgdGhpcy50b2dnbGVGb2N1c2FibGUodGhpcy5mb2N1c2FibGUpO1xuXG4gICAgLyoqXG4gICAgICogSnVtcCB0byBUYXJnZXQgRWxlbWVudCBpZiBUb2dnbGUgRWxlbWVudCBpcyBhbiBhbmNob3IgbGlua1xuICAgICAqL1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuanVtcCAmJiB0aGlzLmVsZW1lbnQuaGFzQXR0cmlidXRlKCdocmVmJykpXG4gICAgICB0aGlzLmp1bXBUbyh0aGlzLmVsZW1lbnQsIHRoaXMudGFyZ2V0KTtcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSBFbGVtZW50IChpbmNsdWRpbmcgbXVsdGkgdG9nZ2xlcykgQXJpYSBBdHRyaWJ1dGVzXG4gICAgICovXG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgVG9nZ2xlLmVsQXJpYVJvbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRyID0gVG9nZ2xlLmVsQXJpYVJvbGVzW2ldO1xuICAgICAgdmFsdWUgPSB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpO1xuXG4gICAgICBpZiAodmFsdWUgIT0gJycgJiYgdmFsdWUpXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgKHZhbHVlID09PSAndHJ1ZScpID8gJ2ZhbHNlJyA6ICd0cnVlJyk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBvdGhlciB0b2dnbGVzIHRoYXQgY29udHJvbCB0aGUgc2FtZSBlbGVtZW50XG4gICAgICB0aGlzLm90aGVycy5mb3JFYWNoKChvdGhlcikgPT4ge1xuICAgICAgICBpZiAob3RoZXIgIT09IHRoaXMuZWxlbWVudCAmJiBvdGhlci5nZXRBdHRyaWJ1dGUoYXR0cikpXG4gICAgICAgICAgb3RoZXIuc2V0QXR0cmlidXRlKGF0dHIsICh2YWx1ZSA9PT0gJ3RydWUnKSA/ICdmYWxzZScgOiAndHJ1ZScpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xpbmcgY29tcGxldGUgaG9va1xuICAgICAqL1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYWZ0ZXIpXG4gICAgICB0aGlzLnNldHRpbmdzLmFmdGVyKHRoaXMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqIEB0eXBlICB7U3RyaW5nfSAgVGhlIG1haW4gc2VsZWN0b3IgdG8gYWRkIHRoZSB0b2dnbGluZyBmdW5jdGlvbiB0byAqL1xuVG9nZ2xlLnNlbGVjdG9yID0gJ1tkYXRhLWpzKj1cInRvZ2dsZVwiXSc7XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBuYW1lc3BhY2UgZm9yIG91ciBkYXRhIGF0dHJpYnV0ZSBzZXR0aW5ncyAqL1xuVG9nZ2xlLm5hbWVzcGFjZSA9ICd0b2dnbGUnO1xuXG4vKiogQHR5cGUgIHtTdHJpbmd9ICBUaGUgaGlkZSBjbGFzcyAqL1xuVG9nZ2xlLmluYWN0aXZlQ2xhc3MgPSAnaGlkZGVuJztcblxuLyoqIEB0eXBlICB7U3RyaW5nfSAgVGhlIGFjdGl2ZSBjbGFzcyAqL1xuVG9nZ2xlLmFjdGl2ZUNsYXNzID0gJ2FjdGl2ZSc7XG5cbi8qKiBAdHlwZSAge0FycmF5fSAgQXJpYSByb2xlcyB0byB0b2dnbGUgdHJ1ZS9mYWxzZSBvbiB0aGUgdG9nZ2xpbmcgZWxlbWVudCAqL1xuVG9nZ2xlLmVsQXJpYVJvbGVzID0gWydhcmlhLXByZXNzZWQnLCAnYXJpYS1leHBhbmRlZCddO1xuXG4vKiogQHR5cGUgIHtBcnJheX0gIEFyaWEgcm9sZXMgdG8gdG9nZ2xlIHRydWUvZmFsc2Ugb24gdGhlIHRhcmdldCBlbGVtZW50ICovXG5Ub2dnbGUudGFyZ2V0QXJpYVJvbGVzID0gWydhcmlhLWhpZGRlbiddO1xuXG4vKiogQHR5cGUgIHtBcnJheX0gIEZvY3VzYWJsZSBlbGVtZW50cyB0byBoaWRlIHdpdGhpbiB0aGUgaGlkZGVuIHRhcmdldCBlbGVtZW50ICovXG5Ub2dnbGUuZWxGb2N1c2FibGUgPSBbXG4gICdhJywgJ2J1dHRvbicsICdpbnB1dCcsICdzZWxlY3QnLCAndGV4dGFyZWEnLCAnb2JqZWN0JywgJ2VtYmVkJywgJ2Zvcm0nLFxuICAnZmllbGRzZXQnLCAnbGVnZW5kJywgJ2xhYmVsJywgJ2FyZWEnLCAnYXVkaW8nLCAndmlkZW8nLCAnaWZyYW1lJywgJ3N2ZycsXG4gICdkZXRhaWxzJywgJ3RhYmxlJywgJ1t0YWJpbmRleF0nLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3VzZW1hcF0nXG5dO1xuXG4vKiogQHR5cGUgIHtBcnJheX0gIEtleSBhdHRyaWJ1dGUgZm9yIHN0b3JpbmcgdG9nZ2xlcyBpbiB0aGUgd2luZG93ICovXG5Ub2dnbGUuY2FsbGJhY2sgPSBbJ1RvZ2dsZXNDYWxsYmFjayddO1xuXG4vKiogQHR5cGUgIHtBcnJheX0gIERlZmF1bHQgZXZlbnRzIHRvIHRvIHdhdGNoIGZvciB0b2dnbGluZy4gRWFjaCBtdXN0IGhhdmUgYSBoYW5kbGVyIGluIHRoZSBjbGFzcyBhbmQgZWxlbWVudHMgdG8gbG9vayBmb3IgaW4gVG9nZ2xlLmVsZW1lbnRzICovXG5Ub2dnbGUuZXZlbnRzID0gWydjbGljaycsICdjaGFuZ2UnXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBFbGVtZW50cyB0byBkZWxlZ2F0ZSB0byBlYWNoIGV2ZW50IGhhbmRsZXIgKi9cblRvZ2dsZS5lbGVtZW50cyA9IHtcbiAgQ0xJQ0s6IFsnQScsICdCVVRUT04nXSxcbiAgQ0hBTkdFOiBbJ1NFTEVDVCcsICdJTlBVVCcsICdURVhUQVJFQSddXG59O1xuXG5leHBvcnQgZGVmYXVsdCBUb2dnbGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBUb2dnbGUgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3RvZ2dsZS90b2dnbGUnO1xuXG5jbGFzcyBBY2NvcmRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gbmV3IFRvZ2dsZSh7XG4gICAgICBzZWxlY3RvcjogQWNjb3JkaW9uLnNlbGVjdG9yXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKiogQHBhcmFtICB7U3RyaW5nfSAgc2VsZWN0b3IgIFRoZSBtYWluIHNlbGVjdG9yIGZvciB0aGUgcGF0dGVybiAqL1xuQWNjb3JkaW9uLnNlbGVjdG9yID0gJ1tkYXRhLWpzKj1cImFjY29yZGlvblwiXSc7XG5cbmV4cG9ydCBkZWZhdWx0IEFjY29yZGlvbjsiLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEJhY2tUb1RvcCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICBzZWxlY3RvcjogQmFja1RvVG9wLnNlbGVjdG9yLFxuICAgICAgc3RvcDogQmFja1RvVG9wLnN0b3AsXG4gICAgfVxuXG4gICAgLy9jaGVjayBpZiB0aGUgYnV0dG9uIGV4aXN0c1xuICAgIGlmICghZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNldHRpbmdzLnNlbGVjdG9yKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNldHRpbmdzLnNlbGVjdG9yKTtcbiAgICBjb25zdCBzdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNldHRpbmdzLnN0b3ApO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID09IDApID8gYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpIDogYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG5cbiAgICAgIGJ1dHRvbi5zdHlsZS5ib3R0b20gPSBgJHtCYWNrVG9Ub3AuY2FsY0JvdHRvbShzdG9wKX1weGBcblxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogXG4gKiBDYWxjdWxhdGUgdGhlIGJvdHRvbSB2YWx1ZSBmb3Igc2VsZWN0b3JcbiAqL1xuQmFja1RvVG9wLmNhbGNCb3R0b20gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICBjb25zdCBlaCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICBjb25zdCB3aCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgbGV0IGVyID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgbGV0IGV0ID0gZXIudG9wO1xuICBsZXQgZWIgPSBlci5ib3R0b207XG5cbiAgcmV0dXJuIE1hdGgubWF4KDAsIGV0ID4gMCA/IE1hdGgubWluKGVoLCB3aCAtIGV0KSA6IE1hdGgubWluKGViLCB3aCkpXG59O1xuXG4vKipcbiAqIERlZmF1bHRzXG4gKi9cbkJhY2tUb1RvcC5zZWxlY3RvciA9ICdbZGF0YS1qcz1cImJhY2stdG8tdG9wXCJdJ1xuQmFja1RvVG9wLnN0b3AgPSAnZm9vdGVyJ1xuXG5leHBvcnQgZGVmYXVsdCBCYWNrVG9Ub3A7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEZhcSB7XG4gIFxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICBzZWxlY3RvcjogKHNldHRpbmdzKSA/IHNldHRpbmdzLnNlbGVjdG9yIDogRmFxLnNlbGVjdG9yXG4gICAgfTtcblxuICAgIGNvbnN0IGZhcXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3RoaXMuc2V0dGluZ3Muc2VsZWN0b3J9YCk7XG4gICAgaWYgKGZhcXMpIHtcbiAgICAgIFxuICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChmYXFzLCBmdW5jdGlvbiAoZmFxKSB7XG5cbiAgICAgICAgZmFxLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIEZhcS50b2dnbGUodGhpcyk7XG4gICAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVG9nZ2xlcyB0aGUgYW5zd2VyIGZvciBGQVFcbiAqIEBwYXJhbSB7b2JqfSBmYXEgXG4gKi9cbkZhcS50b2dnbGUgPSBmdW5jdGlvbihmYXEpIHtcblxuICAvLyBUb2dnbGUgdGhlIE9wZW4gYW5kIENsb3NlIHNwYW5zXG4gIEFycmF5LmZyb20oZmFxLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3BhblwiKSkuZm9yRWFjaChmdW5jdGlvbihlbCl7XG4gICAgZWwuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJyk7XG4gIH0pXG5cbiAgLy8gVG9nZ2xlIHRoZSBib2R5XG4gIGxldCBzaWJsaW5nID0gZmFxLnBhcmVudE5vZGUucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICBpZiAoc2libGluZy5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT0gJ3RydWUnKSB7XG4gICAgc2libGluZy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcImZhbHNlXCIpO1xuICB9IGVsc2Uge1xuICAgIHNpYmxpbmcuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICB9XG5cbiAgc2libGluZy5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcblxufVxuXG4vKiogQHBhcmFtICB7U3RyaW5nfSAgc2VsZWN0b3IgIFRoZSBtYWluIHNlbGVjdG9yIGZvciB0aGUgcGF0dGVybiAqL1xuRmFxLnNlbGVjdG9yID0gJ1tqcy10cmlnZ2VyKj1cImZhcVwiXSc7XG5cbmV4cG9ydCBkZWZhdWx0IEZhcTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBUb2dnbGUgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3RvZ2dsZS90b2dnbGUnO1xuXG5jbGFzcyBOYXZpZ2F0aW9uIHtcbiBcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGRhdGEpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gbmV3IFRvZ2dsZSh7XG4gICAgICBzZWxlY3RvcjogTmF2aWdhdGlvbi5zZWxlY3RvclxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuTmF2aWdhdGlvbi5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJuYXZpZ2F0aW9uXCJdJztcblxuZXhwb3J0IGRlZmF1bHQgTmF2aWdhdGlvbjsiLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEFuY2hvciB7XG4gIFxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgdHJpZ2dlcjogQW5jaG9yLnRyaWdnZXIsXG4gICAgICBoYXNoOiB3aW5kb3cubG9jYXRpb24uaGFzaFxuICAgIH07XG5cbiAgICBjb25zdCB0cmlnZ2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7dGhpcy5zZXR0aW5ncy50cmlnZ2VyfWApO1xuXG4gICAgaWYgKHRyaWdnZXJzKSB7XG5cbiAgICAgIC8vIGluaXRpYWxpemUgY2xpY2sgZXZlbnRzXG4gICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHRyaWdnZXJzLCBmdW5jdGlvbiAodCkge1xuICAgICAgICB0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIEFuY2hvci50b2dnbGUodGhpcyk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjaGVjayB0aGUgaGFzaFxuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuaGFzaCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtocmVmPVwiJHt0aGlzLnNldHRpbmdzLmhhc2h9XCJdYClcbiAgICAgICAgQW5jaG9yLnRvZ2dsZShlbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEFuY2hvci50b2dnbGUodHJpZ2dlcnNbMF0pXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFNjcm9sbCB0cmlnZ2Vyc1xuICAgIGxldCBvZmZzZXRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodHJpZ2dlcnMpLm1hcCh4ID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoeC5oYXNoKS5vZmZzZXRUb3ApXG5cbiAgICB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBvZmZzZXRzLmZvckVhY2goZnVuY3Rpb24obywgaSl7XG4gICAgICAgIGxldCBzVG9wID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgaWYgKHNUb3AgPj0gbyApIHtcbiAgICAgICAgICBBbmNob3IudG9nZ2xlKHRyaWdnZXJzW2ldKVxuICAgICAgICB9XG4gICAgICB9KSAgICAgIFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBUb2dnbGVzIHRoZSBhY3RpdmUgYW5jaG9yIGFuZCBhc3NvY2lhdGVkIHNlY3Rpb25zXG4gKi9cbkFuY2hvci50b2dnbGUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpIHtcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2hyZWY9XCIke3dpbmRvdy5sb2NhdGlvbi5oYXNofVwiXWApXG4gIH1cblxuICAvLyB0b2dnbGUgYWN0aXZlIGNsYXNzIG9uIHNpZGUgbmF2aWdhdGlvblxuICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWxlbWVudC5wYXJlbnROb2RlLmNoaWxkcmVuKTtcblxuICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoQW5jaG9yLmFjdGl2ZUNsYXNzKVxuICB9KVxuXG4gIGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShBbmNob3IuYWN0aXZlQ2xhc3MpXG5cbiAgLy8gVE9ETzogcmVzb2x2ZSB0aHJvdHRpbmcgb24gdXBkYXRlZCBzdGF0ZVxuICAvLyBpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XG4gIC8vICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsIG51bGwsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuICAvLyB9XG5cbn1cblxuQW5jaG9yLnRyaWdnZXIgPSAnW2RhdGEtdHJpZ2dlcio9XCJhbmNob3JcIl0nO1xuQW5jaG9yLmFjdGl2ZUNsYXNzID0gJ2FjdGl2ZSc7XG5BbmNob3IuaGlkZGVuQ2xhc3MgPSAnaGlkZGVuJztcblxuZXhwb3J0IGRlZmF1bHQgQW5jaG9yOyIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgQ29weSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgbGV0IGNvcGllcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQ29weS5zZWxlY3RvcilcblxuICAgIGNvcGllcy5mb3JFYWNoKGZ1bmN0aW9uIChjb3B5KSB7XG4gICAgICBjb3B5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIENvcHkuZ2V0Q29weShldmVudC50YXJnZXQpO1xuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5cbi8qKlxuICogQ29weSB0aGUgTWFya3VwXG4gKi9cbkNvcHkuZ2V0Q29weSA9IGZ1bmN0aW9uIChlbCkge1xuICBsZXQgY3VyVGV4dCA9IGVsLmlubmVyVGV4dDtcbiAgbGV0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1jb250ZW50Kj1cIiR7ZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWpzJyl9XCJdYClcbiAgbGV0IGNvbnRlbnRBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xuXG4gIGNvbnRlbnRBcmVhLnN0eWxlLm9wYWNpdHkgPSAwXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGVudEFyZWEpO1xuICBjb250ZW50QXJlYS52YWx1ZSA9IGNvbnRlbnQuaW5uZXJUZXh0O1xuICBjb250ZW50QXJlYS5zZWxlY3QoKTtcbiAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoXCJjb3B5XCIpO1xuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGNvbnRlbnRBcmVhKTtcblxuICBlbC5pbm5lclRleHQgPSAnQ29waWVkISdcblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBlbC5pbm5lclRleHQgPSBjdXJUZXh0O1xuICB9LCAzMDAwKTtcblxufVxuLyoqIEBwYXJhbSAge1N0cmluZ30gIHNlbGVjdG9yICBUaGUgbWFpbiBzZWxlY3RvciBmb3IgdGhlIHBhdHRlcm4gKi9cbkNvcHkuc2VsZWN0b3IgPSAnW2RhdGEtanMqPVwiY29weVwiXSc7XG5Db3B5LmNvbnRlbnQgPSAnW2RhdGEtY29udGVudCo9XCJjb3B5XCJdJztcblxuZXhwb3J0IGRlZmF1bHQgQ29weTsiLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIFBhZ2luYXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgdHJpZ2dlcjogUGFnaW5hdGlvbi50cmlnZ2VyLFxuICAgICAgaGFzaDogd2luZG93LmxvY2F0aW9uLmhhc2hcbiAgICB9O1xuXG4gICAgY29uc3QgdHJpZ2dlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3RoaXMuc2V0dGluZ3MudHJpZ2dlcn1gKTtcbiAgICBpZiAodHJpZ2dlcnMpIHtcbiAgICAgIFxuICAgICAgLy8gaW5pdGlhbGl6ZSBjbGljayBldmVudHNcbiAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwodHJpZ2dlcnMsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgUGFnaW5hdGlvbi50b2dnbGUodGhpcyk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjaGVjayB0aGUgaGFzaFxuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuaGFzaCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtocmVmPVwiJHt0aGlzLnNldHRpbmdzLmhhc2h9XCJdYClcbiAgICAgICAgUGFnaW5hdGlvbi50b2dnbGUoZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBQYWdpbmF0aW9uLnRvZ2dsZSh0cmlnZ2Vyc1swXSlcbiAgICAgIH1cblxuICAgICAgUGFnaW5hdGlvbi51cGRhdGVMYWJlbCgpO1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2VcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgUGFnaW5hdGlvbi50b2dnbGUoKVxuICAgICAgICBQYWdpbmF0aW9uLnVwZGF0ZUxhYmVsKCk7XG4gICAgICB9LCBmYWxzZSk7XG5cblxuICAgIH0gZWxzZXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUb2dnbGVzIHRoZSBhY3RpdmUgYW5jaG9yIGFuZCBhc3NvY2lhdGVkIHNlY3Rpb25zXG4gKi9cblBhZ2luYXRpb24udG9nZ2xlID0gZnVuY3Rpb24oZWxlbWVudCl7XG5cbiAgaWYoIWVsZW1lbnQpIHtcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2hyZWY9XCIke3dpbmRvdy5sb2NhdGlvbi5oYXNofVwiXWApXG4gIH1cblxuICAvLyB0b2dnbGUgYWN0aXZlIGNsYXNzIG9uIHNpZGUgbmF2aWdhdGlvblxuICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWxlbWVudC5wYXJlbnROb2RlLmNoaWxkcmVuKTtcblxuICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKXtcbiAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKFBhZ2luYXRpb24uYWN0aXZlQ2xhc3MpXG4gIH0pXG5cbiAgZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFBhZ2luYXRpb24uYWN0aXZlQ2xhc3MpXG5cbiAgLy8gdG9nZ2xlIHNlY3Rpb25zXG4gIGNvbnN0IGFjdGl2ZV9zZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpfWApXG4gIGNvbnN0IGNoaWxkcmVuX3NlY3Rpb25zID0gQXJyYXkuZnJvbShhY3RpdmVfc2VjdGlvbi5wYXJlbnROb2RlLmNoaWxkcmVuKTtcbiAgXG4gIGNoaWxkcmVuX3NlY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgaWYgKGNoaWxkLnRhZ05hbWUgPT0gJ1NFQ1RJT04nKXtcbiAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoUGFnaW5hdGlvbi5oaWRkZW5DbGFzcylcbiAgICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoUGFnaW5hdGlvbi5hY3RpdmVDbGFzcylcbiAgICB9XG4gIH0pXG5cbiAgYWN0aXZlX3NlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZShQYWdpbmF0aW9uLmhpZGRlbkNsYXNzKTtcbiAgYWN0aXZlX3NlY3Rpb24uY2xhc3NMaXN0LmFkZChQYWdpbmF0aW9uLmFjdGl2ZUNsYXNzKTtcblxufVxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgUHJldmlvdXMgYW5kIE5leHQgZGVzY3JpcHRpb25zXG4gKi9cblBhZ2luYXRpb24udXBkYXRlTGFiZWwgPSBmdW5jdGlvbigpe1xuICAvLyBnZXQgdGhlIGFuY2hvciBsaW5rIHRoYXQgaXMgYWN0aXZlXG4gIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFBhZ2luYXRpb24uYW5jaG9yKS5wYXJlbnROb2RlO1xuICBsZXQgZWwgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbChgLiR7UGFnaW5hdGlvbi5hY3RpdmVDbGFzc31gKTtcblxuICBsZXQgcHJldiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoUGFnaW5hdGlvbi5wcmV2KVxuICBsZXQgbmV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoUGFnaW5hdGlvbi5uZXh0KVxuICBcbiAgaWYoZWxbMF0ucHJldmlvdXNFbGVtZW50U2libGluZykge1xuICAgIHByZXYudGV4dENvbnRlbnQgPSBlbFswXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmlubmVyVGV4dC50cmltKClcbiAgICBwcmV2LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5ocmVmID0gZWxbMF0ucHJldmlvdXNFbGVtZW50U2libGluZy5oYXNoXG4gICAgcHJldi5wYXJlbnROb2RlLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShQYWdpbmF0aW9uLmhpZGRlbkNsYXNzKVxuICAgIG5leHQucGFyZW50Tm9kZS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbC1zdGFydC0yJylcbiAgfSBlbHNlIHtcbiAgICBwcmV2LnBhcmVudE5vZGUucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFBhZ2luYXRpb24uaGlkZGVuQ2xhc3MpXG4gICAgbmV4dC5wYXJlbnROb2RlLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY29sLXN0YXJ0LTInKVxuICB9XG4gIFxuICBpZihlbFswXS5uZXh0RWxlbWVudFNpYmxpbmcpIHtcbiAgICBuZXh0LnRleHRDb250ZW50ID0gZWxbMF0ubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVyVGV4dC50cmltKClcbiAgICBuZXh0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5ocmVmID0gZWxbMF0ubmV4dEVsZW1lbnRTaWJsaW5nLmhhc2hcbiAgICBuZXh0LnBhcmVudE5vZGUucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFBhZ2luYXRpb24uaGlkZGVuQ2xhc3MpXG5cbiAgfSBlbHNlIHtcbiAgICBuZXh0LnBhcmVudE5vZGUucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFBhZ2luYXRpb24uaGlkZGVuQ2xhc3MpXG4gIH1cbn1cblxuLyoqXG4gKiBEZWZhdWx0c1xuICovXG5QYWdpbmF0aW9uLnRyaWdnZXIgPSAnW2RhdGEtdHJpZ2dlcio9XCJwYWdpbmF0ZVwiXSc7XG5QYWdpbmF0aW9uLmFuY2hvciA9ICdbZGF0YS10cmlnZ2VyKj1cInBhZ2luYXRlLWFuY2hvclwiXSc7XG5QYWdpbmF0aW9uLnByZXYgPSAnW2RhdGEtZGVzYyo9XCJwcmV2XCJdJztcblBhZ2luYXRpb24ubmV4dCA9ICdbZGF0YS1kZXNjKj1cIm5leHRcIl0nO1xuUGFnaW5hdGlvbi5hY3RpdmVDbGFzcyA9ICdhY3RpdmUnO1xuUGFnaW5hdGlvbi5oaWRkZW5DbGFzcyA9ICdoaWRkZW4nO1xuXG5leHBvcnQgZGVmYXVsdCBQYWdpbmF0aW9uOyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDb21wb25lbnRzXG4gKi9cbmltcG9ydCBBY2NvcmRpb24gZnJvbSAnLi4vY29tcG9uZW50cy9hY2NvcmRpb24vYWNjb3JkaW9uJztcbmltcG9ydCBCYWNrVG9Ub3AgZnJvbSAnLi4vY29tcG9uZW50cy9iYWNrLXRvLXRvcC9iYWNrLXRvLXRvcCc7XG5pbXBvcnQgRmFxIGZyb20gJy4uL2NvbXBvbmVudHMvY2FyZC9mYXEtY2FyZCc7XG5cbmltcG9ydCBOYXZpZ2F0aW9uIGZyb20gJy4uL29iamVjdHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uJztcblxuLyoqXG4gKiBVdGlsaXRpZXNcbiAqL1xuaW1wb3J0IEFuY2hvciBmcm9tICcuLi91dGlsaXRpZXMvYW5jaG9yL2FuY2hvcic7XG5pbXBvcnQgQ29weSBmcm9tICcuLi91dGlsaXRpZXMvY29weS9jb3B5JztcbmltcG9ydCBQYWdpbmF0aW9uIGZyb20gJy4uL3V0aWxpdGllcy9wYWdpbmF0aW9uL3BhZ2luYXRpb24nO1xuXG4vKipcbiAqIE1ldGhvZHMgZm9yIHRoZSBtYWluIFBhdHRlcm5zIGluc3RhbmNlLlxuICovXG5jbGFzcyBEZWZhdWx0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9ICdwcm9kdWN0aW9uJylcbiAgICAgIGNvbnNvbGUuZGlyKCdAcHR0cm4gRGV2ZWxvcG1lbnQgTW9kZScpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgfVxuXG4gIGZhcSgpIHtcbiAgICByZXR1cm4gbmV3IEZhcSgpO1xuICB9XG5cbiAgcGFnaW5hdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFBhZ2luYXRpb24oKTtcbiAgfVxuXG4gIGFjY29yZGlvbigpIHtcbiAgICByZXR1cm4gbmV3IEFjY29yZGlvbigpO1xuICB9XG5cbiAgbmF2aWdhdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IE5hdmlnYXRpb24oKTtcbiAgfVxuXG4gIGFuY2hvcigpIHtcbiAgICByZXR1cm4gbmV3IEFuY2hvcigpO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICByZXR1cm4gbmV3IENvcHkoKTtcbiAgfVxuXG4gIGJhY2syVG9wKCkge1xuICAgIHJldHVybiBuZXcgQmFja1RvVG9wKCk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sTUFBTSxDQUFDO0VBQ2I7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFdBQVcsQ0FBQyxDQUFDLEVBQUU7RUFDakI7RUFDQSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FB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QixNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzNDO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO0VBQy9ELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QztFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0VBQ3BELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUM7RUFDQSxNQUFNLElBQUksS0FBSyxJQUFJLEVBQUUsSUFBSSxLQUFLO0VBQzlCLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLE1BQU0sSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDL0U7RUFDQTtFQUNBLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUs7RUFDckMsUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO0VBQzlELFVBQVUsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssTUFBTSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQztFQUMxRSxPQUFPLENBQUMsQ0FBQztFQUNULEtBQUs7QUFDTDtFQUNBO0VB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

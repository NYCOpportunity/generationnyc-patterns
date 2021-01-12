var Default = (function () {
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

  }

  return Default;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBvbmVudHMvY2FyZC9mYXEtY2FyZC5qcyIsIi4uLy4uL3NyYy91dGlsaXRpZXMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90b2dnbGUvdG9nZ2xlLmpzIiwiLi4vLi4vc3JjL2NvbXBvbmVudHMvYWNjb3JkaW9uL2FjY29yZGlvbi5qcyIsIi4uLy4uL3NyYy9qcy9kZWZhdWx0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgRmFxIHtcbiAgXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHtcbiAgICAgIHNlbGVjdG9yOiAoc2V0dGluZ3MpID8gc2V0dGluZ3Muc2VsZWN0b3IgOiBGYXEuc2VsZWN0b3JcbiAgICB9O1xuXG4gICAgY29uc3QgZmFxcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7dGhpcy5zZXR0aW5ncy5zZWxlY3Rvcn1gKTtcbiAgICBpZiAoZmFxcykge1xuICAgICAgXG4gICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGZhcXMsIGZ1bmN0aW9uIChmYXEpIHtcblxuICAgICAgICBmYXEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgRmFxLnRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUb2dnbGVzIHRoZSBhbnN3ZXIgZm9yIEZBUVxuICogQHBhcmFtIHtvYmp9IGZhcSBcbiAqL1xuRmFxLnRvZ2dsZSA9IGZ1bmN0aW9uKGZhcSkge1xuXG4gIC8vIFRvZ2dsZSB0aGUgT3BlbiBhbmQgQ2xvc2Ugc3BhbnNcbiAgQXJyYXkuZnJvbShmYXEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzcGFuXCIpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbiAgfSlcblxuICAvLyBUb2dnbGUgdGhlIGJvZHlcbiAgbGV0IHNpYmxpbmcgPSBmYXEucGFyZW50Tm9kZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gIGlmIChzaWJsaW5nLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PSAndHJ1ZScpIHtcbiAgICBzaWJsaW5nLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwiZmFsc2VcIik7XG4gIH0gZWxzZSB7XG4gICAgc2libGluZy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG4gIH1cblxuICBzaWJsaW5nLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpO1xuXG59XG5cbi8qKiBAcGFyYW0gIHtTdHJpbmd9ICBzZWxlY3RvciAgVGhlIG1haW4gc2VsZWN0b3IgZm9yIHRoZSBwYXR0ZXJuICovXG5GYXEuc2VsZWN0b3IgPSAnW2pzLXRyaWdnZXIqPVwiZmFxXCJdJztcblxuZXhwb3J0IGRlZmF1bHQgRmFxOyIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgUGFnaW5hdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICB0cmlnZ2VyOiBQYWdpbmF0aW9uLnRyaWdnZXIsXG4gICAgICBoYXNoOiB3aW5kb3cubG9jYXRpb24uaGFzaFxuICAgIH07XG5cbiAgICBjb25zdCB0cmlnZ2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7dGhpcy5zZXR0aW5ncy50cmlnZ2VyfWApO1xuICAgIGlmICh0cmlnZ2Vycykge1xuICAgICAgXG4gICAgICAvLyBpbml0aWFsaXplIGNsaWNrIGV2ZW50c1xuICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbCh0cmlnZ2VycywgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBQYWdpbmF0aW9uLnRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGNoZWNrIHRoZSBoYXNoXG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5oYXNoKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2hyZWY9XCIke3RoaXMuc2V0dGluZ3MuaGFzaH1cIl1gKVxuICAgICAgICBQYWdpbmF0aW9uLnRvZ2dsZShlbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFBhZ2luYXRpb24udG9nZ2xlKHRyaWdnZXJzWzBdKVxuICAgICAgfVxuXG4gICAgICBQYWdpbmF0aW9uLnVwZGF0ZUxhYmVsKCk7XG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCBmdW5jdGlvbigpe1xuICAgICAgICBQYWdpbmF0aW9uLnRvZ2dsZSgpXG4gICAgICAgIFBhZ2luYXRpb24udXBkYXRlTGFiZWwoKTtcbiAgICAgIH0sIGZhbHNlKTtcblxuXG4gICAgfSBlbHNle1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRvZ2dsZXMgdGhlIGFjdGl2ZSBhbmNob3IgYW5kIGFzc29jaWF0ZWQgc2VjdGlvbnNcbiAqL1xuUGFnaW5hdGlvbi50b2dnbGUgPSBmdW5jdGlvbihlbGVtZW50KXtcblxuICBpZighZWxlbWVudCkge1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbaHJlZj1cIiR7d2luZG93LmxvY2F0aW9uLmhhc2h9XCJdYClcbiAgfVxuXG4gIC8vIHRvZ2dsZSBhY3RpdmUgY2xhc3Mgb24gc2lkZSBuYXZpZ2F0aW9uXG4gIGNvbnN0IGNoaWxkcmVuID0gQXJyYXkuZnJvbShlbGVtZW50LnBhcmVudE5vZGUuY2hpbGRyZW4pO1xuXG4gIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpe1xuICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoUGFnaW5hdGlvbi5hY3RpdmVDbGFzcylcbiAgfSlcblxuICBlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoUGFnaW5hdGlvbi5hY3RpdmVDbGFzcylcblxuICAvLyB0b2dnbGUgc2VjdGlvbnNcbiAgY29uc3QgYWN0aXZlX3NlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9YClcbiAgY29uc3QgY2hpbGRyZW5fc2VjdGlvbnMgPSBBcnJheS5mcm9tKGFjdGl2ZV9zZWN0aW9uLnBhcmVudE5vZGUuY2hpbGRyZW4pO1xuICBcbiAgY2hpbGRyZW5fc2VjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICBpZiAoY2hpbGQudGFnTmFtZSA9PSAnU0VDVElPTicpe1xuICAgICAgY2hpbGQuY2xhc3NMaXN0LmFkZChQYWdpbmF0aW9uLmhpZGRlbkNsYXNzKVxuICAgICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZShQYWdpbmF0aW9uLmFjdGl2ZUNsYXNzKVxuICAgIH1cbiAgfSlcblxuICBhY3RpdmVfc2VjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFBhZ2luYXRpb24uaGlkZGVuQ2xhc3MpO1xuICBhY3RpdmVfc2VjdGlvbi5jbGFzc0xpc3QuYWRkKFBhZ2luYXRpb24uYWN0aXZlQ2xhc3MpO1xuXG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBQcmV2aW91cyBhbmQgTmV4dCBkZXNjcmlwdGlvbnNcbiAqL1xuUGFnaW5hdGlvbi51cGRhdGVMYWJlbCA9IGZ1bmN0aW9uKCl7XG4gIC8vIGdldCB0aGUgYW5jaG9yIGxpbmsgdGhhdCBpcyBhY3RpdmVcbiAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoUGFnaW5hdGlvbi5hbmNob3IpLnBhcmVudE5vZGU7XG4gIGxldCBlbCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKGAuJHtQYWdpbmF0aW9uLmFjdGl2ZUNsYXNzfWApO1xuXG4gIGxldCBwcmV2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihQYWdpbmF0aW9uLnByZXYpXG4gIGxldCBuZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihQYWdpbmF0aW9uLm5leHQpXG4gIFxuICBpZihlbFswXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSB7XG4gICAgcHJldi50ZXh0Q29udGVudCA9IGVsWzBdLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuaW5uZXJUZXh0LnRyaW0oKVxuICAgIHByZXYucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmhyZWYgPSBlbFswXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmhhc2hcbiAgICBwcmV2LnBhcmVudE5vZGUucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFBhZ2luYXRpb24uaGlkZGVuQ2xhc3MpXG4gICAgbmV4dC5wYXJlbnROb2RlLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29sLXN0YXJ0LTInKVxuICB9IGVsc2Uge1xuICAgIHByZXYucGFyZW50Tm9kZS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoUGFnaW5hdGlvbi5oaWRkZW5DbGFzcylcbiAgICBuZXh0LnBhcmVudE5vZGUucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjb2wtc3RhcnQtMicpXG4gIH1cbiAgXG4gIGlmKGVsWzBdLm5leHRFbGVtZW50U2libGluZykge1xuICAgIG5leHQudGV4dENvbnRlbnQgPSBlbFswXS5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJUZXh0LnRyaW0oKVxuICAgIG5leHQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmhyZWYgPSBlbFswXS5uZXh0RWxlbWVudFNpYmxpbmcuaGFzaFxuICAgIG5leHQucGFyZW50Tm9kZS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoUGFnaW5hdGlvbi5oaWRkZW5DbGFzcylcblxuICB9IGVsc2Uge1xuICAgIG5leHQucGFyZW50Tm9kZS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoUGFnaW5hdGlvbi5oaWRkZW5DbGFzcylcbiAgfVxufVxuXG4vKipcbiAqIERlZmF1bHRzXG4gKi9cblBhZ2luYXRpb24udHJpZ2dlciA9ICdbZGF0YS10cmlnZ2VyKj1cInBhZ2luYXRlXCJdJztcblBhZ2luYXRpb24uYW5jaG9yID0gJ1tkYXRhLXRyaWdnZXIqPVwicGFnaW5hdGUtYW5jaG9yXCJdJztcblBhZ2luYXRpb24ucHJldiA9ICdbZGF0YS1kZXNjKj1cInByZXZcIl0nO1xuUGFnaW5hdGlvbi5uZXh0ID0gJ1tkYXRhLWRlc2MqPVwibmV4dFwiXSc7XG5QYWdpbmF0aW9uLmFjdGl2ZUNsYXNzID0gJ2FjdGl2ZSc7XG5QYWdpbmF0aW9uLmhpZGRlbkNsYXNzID0gJ2hpZGRlbic7XG5cbmV4cG9ydCBkZWZhdWx0IFBhZ2luYXRpb247IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRoZSBTaW1wbGUgVG9nZ2xlIGNsYXNzLiBUaGlzIHdpbGwgdG9nZ2xlIHRoZSBjbGFzcyAnYWN0aXZlJyBhbmQgJ2hpZGRlbidcbiAqIG9uIHRhcmdldCBlbGVtZW50cywgZGV0ZXJtaW5lZCBieSBhIGNsaWNrIGV2ZW50IG9uIGEgc2VsZWN0ZWQgbGluayBvclxuICogZWxlbWVudC4gVGhpcyB3aWxsIGFsc28gdG9nZ2xlIHRoZSBhcmlhLWhpZGRlbiBhdHRyaWJ1dGUgZm9yIHRhcmdldGVkXG4gKiBlbGVtZW50cyB0byBzdXBwb3J0IHNjcmVlbiByZWFkZXJzLiBUYXJnZXQgc2V0dGluZ3MgYW5kIG90aGVyIGZ1bmN0aW9uYWxpdHlcbiAqIGNhbiBiZSBjb250cm9sbGVkIHRocm91Z2ggZGF0YSBhdHRyaWJ1dGVzLlxuICpcbiAqIFRoaXMgdXNlcyB0aGUgLm1hdGNoZXMoKSBtZXRob2Qgd2hpY2ggd2lsbCByZXF1aXJlIGEgcG9seWZpbGwgZm9yIElFXG4gKiBodHRwczovL3BvbHlmaWxsLmlvL3YyL2RvY3MvZmVhdHVyZXMvI0VsZW1lbnRfcHJvdG90eXBlX21hdGNoZXNcbiAqXG4gKiBAY2xhc3NcbiAqL1xuY2xhc3MgVG9nZ2xlIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBzICBTZXR0aW5ncyBmb3IgdGhpcyBUb2dnbGUgaW5zdGFuY2VcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgVGhlIGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzKSB7XG4gICAgLy8gQ3JlYXRlIGFuIG9iamVjdCB0byBzdG9yZSBleGlzdGluZyB0b2dnbGUgbGlzdGVuZXJzIChpZiBpdCBkb2Vzbid0IGV4aXN0KVxuICAgIGlmICghd2luZG93Lmhhc093blByb3BlcnR5KFRvZ2dsZS5jYWxsYmFjaykpXG4gICAgICB3aW5kb3dbVG9nZ2xlLmNhbGxiYWNrXSA9IFtdO1xuXG4gICAgcyA9ICghcykgPyB7fSA6IHM7XG5cbiAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgc2VsZWN0b3I6IChzLnNlbGVjdG9yKSA/IHMuc2VsZWN0b3IgOiBUb2dnbGUuc2VsZWN0b3IsXG4gICAgICBuYW1lc3BhY2U6IChzLm5hbWVzcGFjZSkgPyBzLm5hbWVzcGFjZSA6IFRvZ2dsZS5uYW1lc3BhY2UsXG4gICAgICBpbmFjdGl2ZUNsYXNzOiAocy5pbmFjdGl2ZUNsYXNzKSA/IHMuaW5hY3RpdmVDbGFzcyA6IFRvZ2dsZS5pbmFjdGl2ZUNsYXNzLFxuICAgICAgYWN0aXZlQ2xhc3M6IChzLmFjdGl2ZUNsYXNzKSA/IHMuYWN0aXZlQ2xhc3MgOiBUb2dnbGUuYWN0aXZlQ2xhc3MsXG4gICAgICBiZWZvcmU6IChzLmJlZm9yZSkgPyBzLmJlZm9yZSA6IGZhbHNlLFxuICAgICAgYWZ0ZXI6IChzLmFmdGVyKSA/IHMuYWZ0ZXIgOiBmYWxzZSxcbiAgICAgIHZhbGlkOiAocy52YWxpZCkgPyBzLnZhbGlkIDogZmFsc2UsXG4gICAgICBmb2N1c2FibGU6IChzLmhhc093blByb3BlcnR5KCdmb2N1c2FibGUnKSkgPyBzLmZvY3VzYWJsZSA6IHRydWUsXG4gICAgICBqdW1wOiAocy5oYXNPd25Qcm9wZXJ0eSgnanVtcCcpKSA/IHMuanVtcCA6IHRydWVcbiAgICB9O1xuXG4gICAgLy8gU3RvcmUgdGhlIGVsZW1lbnQgZm9yIHBvdGVudGlhbCB1c2UgaW4gY2FsbGJhY2tzXG4gICAgdGhpcy5lbGVtZW50ID0gKHMuZWxlbWVudCkgPyBzLmVsZW1lbnQgOiBmYWxzZTtcblxuICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZShldmVudCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlcmUgaXNuJ3QgYW4gZXhpc3RpbmcgaW5zdGFudGlhdGVkIHRvZ2dsZSwgYWRkIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICAgIGlmICghd2luZG93W1RvZ2dsZS5jYWxsYmFja10uaGFzT3duUHJvcGVydHkodGhpcy5zZXR0aW5ncy5zZWxlY3RvcikpIHtcbiAgICAgICAgbGV0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBUb2dnbGUuZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHRnZ2xlRXZlbnQgPSBUb2dnbGUuZXZlbnRzW2ldO1xuXG4gICAgICAgICAgYm9keS5hZGRFdmVudExpc3RlbmVyKHRnZ2xlRXZlbnQsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmICghZXZlbnQudGFyZ2V0Lm1hdGNoZXModGhpcy5zZXR0aW5ncy5zZWxlY3RvcikpXG4gICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuXG4gICAgICAgICAgICBsZXQgdHlwZSA9IGV2ZW50LnR5cGUudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0aGlzW2V2ZW50LnR5cGVdICYmXG4gICAgICAgICAgICAgIFRvZ2dsZS5lbGVtZW50c1t0eXBlXSAmJlxuICAgICAgICAgICAgICBUb2dnbGUuZWxlbWVudHNbdHlwZV0uaW5jbHVkZXMoZXZlbnQudGFyZ2V0LnRhZ05hbWUpXG4gICAgICAgICAgICApIHRoaXNbZXZlbnQudHlwZV0oZXZlbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVjb3JkIHRoYXQgYSB0b2dnbGUgdXNpbmcgdGhpcyBzZWxlY3RvciBoYXMgYmVlbiBpbnN0YW50aWF0ZWQuXG4gICAgLy8gVGhpcyBwcmV2ZW50cyBkb3VibGUgdG9nZ2xpbmcuXG4gICAgd2luZG93W1RvZ2dsZS5jYWxsYmFja11bdGhpcy5zZXR0aW5ncy5zZWxlY3Rvcl0gPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xpY2sgZXZlbnQgaGFuZGxlclxuICAgKlxuICAgKiBAcGFyYW0gIHtFdmVudH0gIGV2ZW50ICBUaGUgb3JpZ2luYWwgY2xpY2sgZXZlbnRcbiAgICovXG4gIGNsaWNrKGV2ZW50KSB7XG4gICAgdGhpcy50b2dnbGUoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIElucHV0L3NlbGVjdC90ZXh0YXJlYSBjaGFuZ2UgZXZlbnQgaGFuZGxlci4gQ2hlY2tzIHRvIHNlZSBpZiB0aGVcbiAgICogZXZlbnQudGFyZ2V0IGlzIHZhbGlkIHRoZW4gdG9nZ2xlcyBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQHBhcmFtICB7RXZlbnR9ICBldmVudCAgVGhlIG9yaWdpbmFsIGlucHV0IGNoYW5nZSBldmVudFxuICAgKi9cbiAgY2hhbmdlKGV2ZW50KSB7XG4gICAgbGV0IHZhbGlkID0gZXZlbnQudGFyZ2V0LmNoZWNrVmFsaWRpdHkoKTtcblxuICAgIGlmICh2YWxpZCAmJiAhdGhpcy5pc0FjdGl2ZShldmVudC50YXJnZXQpKSB7XG4gICAgICB0aGlzLnRvZ2dsZShldmVudCk7IC8vIHNob3dcbiAgICB9IGVsc2UgaWYgKCF2YWxpZCAmJiB0aGlzLmlzQWN0aXZlKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50KTsgLy8gaGlkZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgdGhlIHRvZ2dsZSBpcyBhY3RpdmVcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgZWxlbWVudCAgVGhlIHRvZ2dsZSBlbGVtZW50ICh0cmlnZ2VyKVxuICAgKi9cbiAgaXNBY3RpdmUoZWxlbWVudCkge1xuICAgIGxldCBhY3RpdmUgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSB7XG4gICAgICBhY3RpdmUgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKVxuICAgIH1cblxuICAgIC8vIGlmICgpIHtcbiAgICAgIC8vIFRvZ2dsZS5lbGVtZW50QXJpYVJvbGVzXG4gICAgICAvLyBUT0RPOiBBZGQgY2F0Y2ggdG8gc2VlIGlmIGVsZW1lbnQgYXJpYSByb2xlcyBhcmUgdG9nZ2xlZFxuICAgIC8vIH1cblxuICAgIC8vIGlmICgpIHtcbiAgICAgIC8vIFRvZ2dsZS50YXJnZXRBcmlhUm9sZXNcbiAgICAgIC8vIFRPRE86IEFkZCBjYXRjaCB0byBzZWUgaWYgdGFyZ2V0IGFyaWEgcm9sZXMgYXJlIHRvZ2dsZWRcbiAgICAvLyB9XG5cbiAgICByZXR1cm4gYWN0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdGFyZ2V0IG9mIHRoZSB0b2dnbGUgZWxlbWVudCAodHJpZ2dlcilcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgZWwgIFRoZSB0b2dnbGUgZWxlbWVudCAodHJpZ2dlcilcbiAgICovXG4gIGdldFRhcmdldChlbGVtZW50KSB7XG4gICAgbGV0IHRhcmdldCA9IGZhbHNlO1xuXG4gICAgLyoqIEFuY2hvciBMaW5rcyAqL1xuICAgIHRhcmdldCA9IChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaHJlZicpKSA/XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpIDogdGFyZ2V0O1xuXG4gICAgLyoqIFRvZ2dsZSBDb250cm9scyAqL1xuICAgIHRhcmdldCA9IChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKSA/XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpfWApIDogdGFyZ2V0O1xuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdG9nZ2xlIGV2ZW50IHByb3h5IGZvciBnZXR0aW5nIGFuZCBzZXR0aW5nIHRoZSBlbGVtZW50L3MgYW5kIHRhcmdldFxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBldmVudCAgVGhlIG1haW4gY2xpY2sgZXZlbnRcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgIFRoZSBUb2dnbGUgaW5zdGFuY2VcbiAgICovXG4gIHRvZ2dsZShldmVudCkge1xuICAgIGxldCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICAgIGxldCB0YXJnZXQgPSBmYWxzZTtcbiAgICBsZXQgZm9jdXNhYmxlID0gW107XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGFyZ2V0ID0gdGhpcy5nZXRUYXJnZXQoZWxlbWVudCk7XG5cbiAgICAvKiogRm9jdXNhYmxlIENoaWxkcmVuICovXG4gICAgZm9jdXNhYmxlID0gKHRhcmdldCkgP1xuICAgICAgdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoVG9nZ2xlLmVsRm9jdXNhYmxlLmpvaW4oJywgJykpIDogZm9jdXNhYmxlO1xuXG4gICAgLyoqIE1haW4gRnVuY3Rpb25hbGl0eSAqL1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm4gdGhpcztcbiAgICB0aGlzLmVsZW1lbnRUb2dnbGUoZWxlbWVudCwgdGFyZ2V0LCBmb2N1c2FibGUpO1xuXG4gICAgLyoqIFVuZG8gKi9cbiAgICBpZiAoZWxlbWVudC5kYXRhc2V0W2Ake3RoaXMuc2V0dGluZ3MubmFtZXNwYWNlfVVuZG9gXSkge1xuICAgICAgY29uc3QgdW5kbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGVsZW1lbnQuZGF0YXNldFtgJHt0aGlzLnNldHRpbmdzLm5hbWVzcGFjZX1VbmRvYF1cbiAgICAgICk7XG5cbiAgICAgIHVuZG8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50VG9nZ2xlKGVsZW1lbnQsIHRhcmdldCk7XG4gICAgICAgIHVuZG8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBvdGhlciB0b2dnbGVzIHRoYXQgbWlnaHQgY29udHJvbCB0aGUgc2FtZSBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICAgIGVsZW1lbnQgIFRoZSB0b2dnbGluZyBlbGVtZW50XG4gICAqXG4gICAqIEByZXR1cm4gIHtOb2RlTGlzdH0gICAgICAgICAgIExpc3Qgb2Ygb3RoZXIgdG9nZ2xpbmcgZWxlbWVudHNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCBjb250cm9sIHRoZSB0YXJnZXRcbiAgICovXG4gIGdldE90aGVycyhlbGVtZW50KSB7XG4gICAgbGV0IHNlbGVjdG9yID0gZmFsc2U7XG5cbiAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2hyZWYnKSkge1xuICAgICAgc2VsZWN0b3IgPSBgW2hyZWY9XCIke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9XCJdYDtcbiAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpIHtcbiAgICAgIHNlbGVjdG9yID0gYFthcmlhLWNvbnRyb2xzPVwiJHtlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpfVwiXWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIChzZWxlY3RvcikgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIFRvZ2dsZSBUYXJnZXQncyBmb2N1c2FibGUgY2hpbGRyZW4gZnJvbSBmb2N1cy5cbiAgICogSWYgYW4gZWxlbWVudCBoYXMgdGhlIGRhdGEtYXR0cmlidXRlIGBkYXRhLXRvZ2dsZS10YWJpbmRleGBcbiAgICogaXQgd2lsbCB1c2UgdGhhdCBhcyB0aGUgZGVmYXVsdCB0YWIgaW5kZXggb2YgdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtOb2RlTGlzdH0gIGVsZW1lbnRzICBMaXN0IG9mIGZvY3VzYWJsZSBlbGVtZW50c1xuICAgKlxuICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgICAgICAgICAgICAgVGhlIFRvZ2dsZSBJbnN0YW5jZVxuICAgKi9cbiAgdG9nZ2xlRm9jdXNhYmxlKGVsZW1lbnRzKSB7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgIGxldCB0YWJpbmRleCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpO1xuXG4gICAgICBpZiAodGFiaW5kZXggPT09ICctMScpIHtcbiAgICAgICAgbGV0IGRhdGFEZWZhdWx0ID0gZWxlbWVudFxuICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoYGRhdGEtJHtUb2dnbGUubmFtZXNwYWNlfS10YWJpbmRleGApO1xuXG4gICAgICAgIGlmIChkYXRhRGVmYXVsdCkge1xuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGRhdGFEZWZhdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBKdW1wcyB0byBFbGVtZW50IHZpc2libHkgYW5kIHNoaWZ0cyBmb2N1c1xuICAgKiB0byB0aGUgZWxlbWVudCBieSBzZXR0aW5nIHRoZSB0YWJpbmRleFxuICAgKlxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgZWxlbWVudCAgVGhlIFRvZ2dsaW5nIEVsZW1lbnRcbiAgICogQHBhcmFtICAge09iamVjdH0gIHRhcmdldCAgIFRoZSBUYXJnZXQgRWxlbWVudFxuICAgKlxuICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgICAgICAgICAgVGhlIFRvZ2dsZSBpbnN0YW5jZVxuICAgKi9cbiAganVtcFRvKGVsZW1lbnQsIHRhcmdldCkge1xuICAgIC8vIFJlc2V0IHRoZSBoaXN0b3J5IHN0YXRlLiBUaGlzIHdpbGwgY2xlYXIgb3V0XG4gICAgLy8gdGhlIGhhc2ggd2hlbiB0aGUgdGFyZ2V0IGlzIHRvZ2dsZWQgY2xvc2VkXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoJycsICcnLFxuICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5cbiAgICAvLyBGb2N1cyBpZiBhY3RpdmVcbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICB0YXJnZXQuZm9jdXMoe3ByZXZlbnRTY3JvbGw6IHRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWFpbiB0b2dnbGluZyBtZXRob2QgZm9yIGF0dHJpYnV0ZXNcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgICBlbGVtZW50ICAgIFRoZSBUb2dnbGUgZWxlbWVudFxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgIHRhcmdldCAgICAgVGhlIFRhcmdldCBlbGVtZW50IHRvIHRvZ2dsZSBhY3RpdmUvaGlkZGVuXG4gICAqIEBwYXJhbSAge05vZGVMaXN0fSAgZm9jdXNhYmxlICBBbnkgZm9jdXNhYmxlIGNoaWxkcmVuIGluIHRoZSB0YXJnZXRcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgIFRoZSBUb2dnbGUgaW5zdGFuY2VcbiAgICovXG4gIGVsZW1lbnRUb2dnbGUoZWxlbWVudCwgdGFyZ2V0LCBmb2N1c2FibGUgPSBbXSkge1xuICAgIGxldCBpID0gMDtcbiAgICBsZXQgYXR0ciA9ICcnO1xuICAgIGxldCB2YWx1ZSA9ICcnO1xuXG4gICAgLyoqXG4gICAgICogU3RvcmUgZWxlbWVudHMgZm9yIHBvdGVudGlhbCB1c2UgaW4gY2FsbGJhY2tzXG4gICAgICovXG5cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMub3RoZXJzID0gdGhpcy5nZXRPdGhlcnMoZWxlbWVudCk7XG4gICAgdGhpcy5mb2N1c2FibGUgPSBmb2N1c2FibGU7XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGl0eSBtZXRob2QgcHJvcGVydHkgdGhhdCB3aWxsIGNhbmNlbCB0aGUgdG9nZ2xlIGlmIGl0IHJldHVybnMgZmFsc2VcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnZhbGlkICYmICF0aGlzLnNldHRpbmdzLnZhbGlkKHRoaXMpKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGluZyBiZWZvcmUgaG9va1xuICAgICAqL1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYmVmb3JlKVxuICAgICAgdGhpcy5zZXR0aW5ncy5iZWZvcmUodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgRWxlbWVudCBhbmQgVGFyZ2V0IGNsYXNzZXNcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcbiAgICAgIHRoaXMudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBvdGhlciB0b2dnbGVzIHRoYXQgY29udHJvbCB0aGUgc2FtZSBlbGVtZW50XG4gICAgICB0aGlzLm90aGVycy5mb3JFYWNoKG90aGVyID0+IHtcbiAgICAgICAgaWYgKG90aGVyICE9PSB0aGlzLmVsZW1lbnQpXG4gICAgICAgICAgb3RoZXIuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmluYWN0aXZlQ2xhc3MpXG4gICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmluYWN0aXZlQ2xhc3MpO1xuXG4gICAgLyoqXG4gICAgICogVGFyZ2V0IEVsZW1lbnQgQXJpYSBBdHRyaWJ1dGVzXG4gICAgICovXG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgVG9nZ2xlLnRhcmdldEFyaWFSb2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0ciA9IFRvZ2dsZS50YXJnZXRBcmlhUm9sZXNbaV07XG4gICAgICB2YWx1ZSA9IHRoaXMudGFyZ2V0LmdldEF0dHJpYnV0ZShhdHRyKTtcblxuICAgICAgaWYgKHZhbHVlICE9ICcnICYmIHZhbHVlKVxuICAgICAgICB0aGlzLnRhcmdldC5zZXRBdHRyaWJ1dGUoYXR0ciwgKHZhbHVlID09PSAndHJ1ZScpID8gJ2ZhbHNlJyA6ICd0cnVlJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSB0YXJnZXQncyBmb2N1c2FibGUgY2hpbGRyZW4gdGFiaW5kZXhcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmZvY3VzYWJsZSlcbiAgICAgIHRoaXMudG9nZ2xlRm9jdXNhYmxlKHRoaXMuZm9jdXNhYmxlKTtcblxuICAgIC8qKlxuICAgICAqIEp1bXAgdG8gVGFyZ2V0IEVsZW1lbnQgaWYgVG9nZ2xlIEVsZW1lbnQgaXMgYW4gYW5jaG9yIGxpbmtcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmp1bXAgJiYgdGhpcy5lbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaHJlZicpKVxuICAgICAgdGhpcy5qdW1wVG8odGhpcy5lbGVtZW50LCB0aGlzLnRhcmdldCk7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgRWxlbWVudCAoaW5jbHVkaW5nIG11bHRpIHRvZ2dsZXMpIEFyaWEgQXR0cmlidXRlc1xuICAgICAqL1xuXG4gICAgZm9yIChpID0gMDsgaSA8IFRvZ2dsZS5lbEFyaWFSb2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0ciA9IFRvZ2dsZS5lbEFyaWFSb2xlc1tpXTtcbiAgICAgIHZhbHVlID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcblxuICAgICAgaWYgKHZhbHVlICE9ICcnICYmIHZhbHVlKVxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsICh2YWx1ZSA9PT0gJ3RydWUnKSA/ICdmYWxzZScgOiAndHJ1ZScpO1xuXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgb3RoZXIgdG9nZ2xlcyB0aGF0IGNvbnRyb2wgdGhlIHNhbWUgZWxlbWVudFxuICAgICAgdGhpcy5vdGhlcnMuZm9yRWFjaCgob3RoZXIpID0+IHtcbiAgICAgICAgaWYgKG90aGVyICE9PSB0aGlzLmVsZW1lbnQgJiYgb3RoZXIuZ2V0QXR0cmlidXRlKGF0dHIpKVxuICAgICAgICAgIG90aGVyLnNldEF0dHJpYnV0ZShhdHRyLCAodmFsdWUgPT09ICd0cnVlJykgPyAnZmFsc2UnIDogJ3RydWUnKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRvZ2dsaW5nIGNvbXBsZXRlIGhvb2tcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFmdGVyKVxuICAgICAgdGhpcy5zZXR0aW5ncy5hZnRlcih0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBtYWluIHNlbGVjdG9yIHRvIGFkZCB0aGUgdG9nZ2xpbmcgZnVuY3Rpb24gdG8gKi9cblRvZ2dsZS5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJ0b2dnbGVcIl0nO1xuXG4vKiogQHR5cGUgIHtTdHJpbmd9ICBUaGUgbmFtZXNwYWNlIGZvciBvdXIgZGF0YSBhdHRyaWJ1dGUgc2V0dGluZ3MgKi9cblRvZ2dsZS5uYW1lc3BhY2UgPSAndG9nZ2xlJztcblxuLyoqIEB0eXBlICB7U3RyaW5nfSAgVGhlIGhpZGUgY2xhc3MgKi9cblRvZ2dsZS5pbmFjdGl2ZUNsYXNzID0gJ2hpZGRlbic7XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBhY3RpdmUgY2xhc3MgKi9cblRvZ2dsZS5hY3RpdmVDbGFzcyA9ICdhY3RpdmUnO1xuXG4vKiogQHR5cGUgIHtBcnJheX0gIEFyaWEgcm9sZXMgdG8gdG9nZ2xlIHRydWUvZmFsc2Ugb24gdGhlIHRvZ2dsaW5nIGVsZW1lbnQgKi9cblRvZ2dsZS5lbEFyaWFSb2xlcyA9IFsnYXJpYS1wcmVzc2VkJywgJ2FyaWEtZXhwYW5kZWQnXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBBcmlhIHJvbGVzIHRvIHRvZ2dsZSB0cnVlL2ZhbHNlIG9uIHRoZSB0YXJnZXQgZWxlbWVudCAqL1xuVG9nZ2xlLnRhcmdldEFyaWFSb2xlcyA9IFsnYXJpYS1oaWRkZW4nXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBGb2N1c2FibGUgZWxlbWVudHMgdG8gaGlkZSB3aXRoaW4gdGhlIGhpZGRlbiB0YXJnZXQgZWxlbWVudCAqL1xuVG9nZ2xlLmVsRm9jdXNhYmxlID0gW1xuICAnYScsICdidXR0b24nLCAnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJywgJ29iamVjdCcsICdlbWJlZCcsICdmb3JtJyxcbiAgJ2ZpZWxkc2V0JywgJ2xlZ2VuZCcsICdsYWJlbCcsICdhcmVhJywgJ2F1ZGlvJywgJ3ZpZGVvJywgJ2lmcmFtZScsICdzdmcnLFxuICAnZGV0YWlscycsICd0YWJsZScsICdbdGFiaW5kZXhdJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t1c2VtYXBdJ1xuXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBLZXkgYXR0cmlidXRlIGZvciBzdG9yaW5nIHRvZ2dsZXMgaW4gdGhlIHdpbmRvdyAqL1xuVG9nZ2xlLmNhbGxiYWNrID0gWydUb2dnbGVzQ2FsbGJhY2snXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBEZWZhdWx0IGV2ZW50cyB0byB0byB3YXRjaCBmb3IgdG9nZ2xpbmcuIEVhY2ggbXVzdCBoYXZlIGEgaGFuZGxlciBpbiB0aGUgY2xhc3MgYW5kIGVsZW1lbnRzIHRvIGxvb2sgZm9yIGluIFRvZ2dsZS5lbGVtZW50cyAqL1xuVG9nZ2xlLmV2ZW50cyA9IFsnY2xpY2snLCAnY2hhbmdlJ107XG5cbi8qKiBAdHlwZSAge0FycmF5fSAgRWxlbWVudHMgdG8gZGVsZWdhdGUgdG8gZWFjaCBldmVudCBoYW5kbGVyICovXG5Ub2dnbGUuZWxlbWVudHMgPSB7XG4gIENMSUNLOiBbJ0EnLCAnQlVUVE9OJ10sXG4gIENIQU5HRTogWydTRUxFQ1QnLCAnSU5QVVQnLCAnVEVYVEFSRUEnXVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVG9nZ2xlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgVG9nZ2xlIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90b2dnbGUvdG9nZ2xlJztcblxuY2xhc3MgQWNjb3JkaW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IG5ldyBUb2dnbGUoe1xuICAgICAgc2VsZWN0b3I6IEFjY29yZGlvbi5zZWxlY3RvclxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqIEBwYXJhbSAge1N0cmluZ30gIHNlbGVjdG9yICBUaGUgbWFpbiBzZWxlY3RvciBmb3IgdGhlIHBhdHRlcm4gKi9cbkFjY29yZGlvbi5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJhY2NvcmRpb25cIl0nO1xuXG5leHBvcnQgZGVmYXVsdCBBY2NvcmRpb247IiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IEZhcSBmcm9tICcuLi9jb21wb25lbnRzL2NhcmQvZmFxLWNhcmQnO1xuaW1wb3J0IFBhZ2luYXRpb24gZnJvbSAnLi4vdXRpbGl0aWVzL3BhZ2luYXRpb24vcGFnaW5hdGlvbic7XG5pbXBvcnQgQWNjb3JkaW9uIGZyb20gJy4uL2NvbXBvbmVudHMvYWNjb3JkaW9uL2FjY29yZGlvbic7XG5cbi8qKlxuICogTWV0aG9kcyBmb3IgdGhlIG1haW4gUGF0dGVybnMgaW5zdGFuY2UuXG4gKi9cbmNsYXNzIERlZmF1bHQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT0gJ3Byb2R1Y3Rpb24nKVxuICAgICAgY29uc29sZS5kaXIoJ0BwdHRybiBEZXZlbG9wbWVudCBNb2RlJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG5cbiAgZmFxKCkge1xuICAgIHJldHVybiBuZXcgRmFxKCk7XG4gIH1cblxuICBwYWdpbmF0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUGFnaW5hdGlvbigpO1xuICB9XG5cbiAgYWNjb3JkaW9uKCkge1xuICAgIHJldHVybiBuZXcgQWNjb3JkaW9uKCk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztFQUVBLE1BQU0sR0FBRyxDQUFDO0VBQ1Y7RUFDQSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUU7RUFDeEIsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHO0VBQ3BCLE1BQU0sUUFBUSxFQUFFLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVE7RUFDN0QsS0FBSyxDQUFDO0FBQ047RUFDQSxJQUFJLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDeEUsSUFBSSxJQUFJLElBQUksRUFBRTtFQUNkO0VBQ0EsTUFBTSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsR0FBRyxFQUFFO0FBQ3hEO0VBQ0EsUUFBUSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7RUFDbEQsVUFBVSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzNCLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsQjtFQUNBLE9BQU8sQ0FBQyxDQUFDO0VBQ1QsS0FBSztFQUNMLEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEdBQUcsQ0FBQyxNQUFNLEdBQUcsU0FBUyxHQUFHLEVBQUU7QUFDM0I7RUFDQTtFQUNBLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsb0JB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Q0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzNDO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO0VBQy9ELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QztFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0VBQ3BELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUM7RUFDQSxNQUFNLElBQUksS0FBSyxJQUFJLEVBQUUsSUFBSSxLQUFLO0VBQzlCLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLE1BQU0sSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDL0U7RUFDQTtFQUNBLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUs7RUFDckMsUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO0VBQzlELFVBQVUsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssTUFBTSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQztFQUMxRSxPQUFPLENBQUMsQ0FBQztFQUNULEtBQUs7QUFDTDtFQUNBO0VBQ0E7RUFDQTtBQUNB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

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

      } else {
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
      child.classList.remove('active');
    });

    element.classList.toggle('active');

    // toggle sections
    const active_section = document.querySelector(`${element.getAttribute('href')}`);
    const children_sections = Array.from(active_section.parentNode.children);
    
    children_sections.forEach(function (child) {
      if (child.tagName == 'SECTION'){
        child.classList.add('hidden');
        child.classList.remove('active');
      }
    });

    active_section.classList.remove('hidden');
    active_section.classList.add('active');

    // update the text on buttons
    // Pagination.updateLabel()
    
  };

  /**
   * Update the Previous and Next descriptions
   */
  Pagination.updateLabel = function(){
    // get the anchor link that is active
    let container = document.querySelector(Pagination.anchor).parentNode;
    let el = container.querySelectorAll('.active');

    let prev = document.querySelector(Pagination.prev);
    let next = document.querySelector(Pagination.next);
    
    if(el[0].previousElementSibling) {
      prev.textContent = el[0].previousElementSibling.innerText.trim();
      prev.parentElement.parentElement.href = el[0].previousElementSibling.href;
    }
    
    if(el[0].nextElementSibling) {
      next.textContent = el[0].nextElementSibling.innerText.trim();
      next.parentElement.parentElement.href = el[0].nextElementSibling.href;
    }
  };

  /** @param  {String}  selector  The main selector for the pattern */
  Pagination.trigger = '[data-trigger*="paginate"]';
  Pagination.anchor = '[data-trigger*="paginate-anchor"]';
  Pagination.prev = '[data-desc*="prev"]';
  Pagination.next = '[data-desc*="next"]';

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
  }

  return Default;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBvbmVudHMvY2FyZC9mYXEtY2FyZC5qcyIsIi4uLy4uL3NyYy91dGlsaXRpZXMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmpzIiwiLi4vLi4vc3JjL2pzL2RlZmF1bHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBGYXEge1xuICBcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgc2VsZWN0b3I6IChzZXR0aW5ncykgPyBzZXR0aW5ncy5zZWxlY3RvciA6IEZhcS5zZWxlY3RvclxuICAgIH07XG5cbiAgICBjb25zdCBmYXFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHt0aGlzLnNldHRpbmdzLnNlbGVjdG9yfWApO1xuICAgIGlmIChmYXFzKSB7XG4gICAgICBcbiAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZmFxcywgZnVuY3Rpb24gKGZhcSkge1xuXG4gICAgICAgIGZhcS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBGYXEudG9nZ2xlKHRoaXMpO1xuICAgICAgICB9LCBmYWxzZSk7XG5cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRvZ2dsZXMgdGhlIGFuc3dlciBmb3IgRkFRXG4gKiBAcGFyYW0ge29ian0gZmFxIFxuICovXG5GYXEudG9nZ2xlID0gZnVuY3Rpb24oZmFxKSB7XG5cbiAgLy8gVG9nZ2xlIHRoZSBPcGVuIGFuZCBDbG9zZSBzcGFuc1xuICBBcnJheS5mcm9tKGZhcS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNwYW5cIikpLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuICAgIGVsLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpO1xuICB9KVxuXG4gIC8vIFRvZ2dsZSB0aGUgYm9keVxuICBsZXQgc2libGluZyA9IGZhcS5wYXJlbnROb2RlLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cbiAgaWYgKHNpYmxpbmcuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09ICd0cnVlJykge1xuICAgIHNpYmxpbmcuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJmYWxzZVwiKTtcbiAgfSBlbHNlIHtcbiAgICBzaWJsaW5nLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgfVxuXG4gIHNpYmxpbmcuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJyk7XG5cbn1cblxuLyoqIEBwYXJhbSAge1N0cmluZ30gIHNlbGVjdG9yICBUaGUgbWFpbiBzZWxlY3RvciBmb3IgdGhlIHBhdHRlcm4gKi9cbkZhcS5zZWxlY3RvciA9ICdbanMtdHJpZ2dlcio9XCJmYXFcIl0nO1xuXG5leHBvcnQgZGVmYXVsdCBGYXE7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBQYWdpbmF0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHtcbiAgICAgIHRyaWdnZXI6IFBhZ2luYXRpb24udHJpZ2dlcixcbiAgICAgIGhhc2g6IHdpbmRvdy5sb2NhdGlvbi5oYXNoXG4gICAgfTtcblxuICAgIGNvbnN0IHRyaWdnZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHt0aGlzLnNldHRpbmdzLnRyaWdnZXJ9YCk7XG4gICAgaWYgKHRyaWdnZXJzKSB7XG4gICAgICBcbiAgICAgIC8vIGluaXRpYWxpemUgY2xpY2sgZXZlbnRzXG4gICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHRyaWdnZXJzLCBmdW5jdGlvbiAodCkge1xuICAgICAgICB0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIFBhZ2luYXRpb24udG9nZ2xlKHRoaXMpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gY2hlY2sgdGhlIGhhc2hcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmhhc2gpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbaHJlZj1cIiR7dGhpcy5zZXR0aW5ncy5oYXNofVwiXWApXG4gICAgICAgIFBhZ2luYXRpb24udG9nZ2xlKGVsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgUGFnaW5hdGlvbi50b2dnbGUodHJpZ2dlcnNbMF0pXG4gICAgICB9XG5cbiAgICB9IGVsc2V7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVG9nZ2xlcyB0aGUgYWN0aXZlIGFuY2hvciBhbmQgYXNzb2NpYXRlZCBzZWN0aW9uc1xuICovXG5QYWdpbmF0aW9uLnRvZ2dsZSA9IGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAvLyB0b2dnbGUgYWN0aXZlIGNsYXNzIG9uIHNpZGUgbmF2aWdhdGlvblxuICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWxlbWVudC5wYXJlbnROb2RlLmNoaWxkcmVuKTtcblxuICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKXtcbiAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICB9KVxuXG4gIGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcblxuICAvLyB0b2dnbGUgc2VjdGlvbnNcbiAgY29uc3QgYWN0aXZlX3NlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9YClcbiAgY29uc3QgY2hpbGRyZW5fc2VjdGlvbnMgPSBBcnJheS5mcm9tKGFjdGl2ZV9zZWN0aW9uLnBhcmVudE5vZGUuY2hpbGRyZW4pO1xuICBcbiAgY2hpbGRyZW5fc2VjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICBpZiAoY2hpbGQudGFnTmFtZSA9PSAnU0VDVElPTicpe1xuICAgICAgY2hpbGQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfVxuICB9KVxuXG4gIGFjdGl2ZV9zZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICBhY3RpdmVfc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblxuICAvLyB1cGRhdGUgdGhlIHRleHQgb24gYnV0dG9uc1xuICAvLyBQYWdpbmF0aW9uLnVwZGF0ZUxhYmVsKClcbiAgXG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBQcmV2aW91cyBhbmQgTmV4dCBkZXNjcmlwdGlvbnNcbiAqL1xuUGFnaW5hdGlvbi51cGRhdGVMYWJlbCA9IGZ1bmN0aW9uKCl7XG4gIC8vIGdldCB0aGUgYW5jaG9yIGxpbmsgdGhhdCBpcyBhY3RpdmVcbiAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoUGFnaW5hdGlvbi5hbmNob3IpLnBhcmVudE5vZGU7XG4gIGxldCBlbCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuYWN0aXZlJyk7XG5cbiAgbGV0IHByZXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFBhZ2luYXRpb24ucHJldilcbiAgbGV0IG5leHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFBhZ2luYXRpb24ubmV4dClcbiAgXG4gIGlmKGVsWzBdLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHtcbiAgICBwcmV2LnRleHRDb250ZW50ID0gZWxbMF0ucHJldmlvdXNFbGVtZW50U2libGluZy5pbm5lclRleHQudHJpbSgpXG4gICAgcHJldi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuaHJlZiA9IGVsWzBdLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuaHJlZlxuICB9XG4gIFxuICBpZihlbFswXS5uZXh0RWxlbWVudFNpYmxpbmcpIHtcbiAgICBuZXh0LnRleHRDb250ZW50ID0gZWxbMF0ubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVyVGV4dC50cmltKClcbiAgICBuZXh0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5ocmVmID0gZWxbMF0ubmV4dEVsZW1lbnRTaWJsaW5nLmhyZWZcbiAgfVxufVxuXG4vKiogQHBhcmFtICB7U3RyaW5nfSAgc2VsZWN0b3IgIFRoZSBtYWluIHNlbGVjdG9yIGZvciB0aGUgcGF0dGVybiAqL1xuUGFnaW5hdGlvbi50cmlnZ2VyID0gJ1tkYXRhLXRyaWdnZXIqPVwicGFnaW5hdGVcIl0nO1xuUGFnaW5hdGlvbi5hbmNob3IgPSAnW2RhdGEtdHJpZ2dlcio9XCJwYWdpbmF0ZS1hbmNob3JcIl0nO1xuUGFnaW5hdGlvbi5wcmV2ID0gJ1tkYXRhLWRlc2MqPVwicHJldlwiXSc7XG5QYWdpbmF0aW9uLm5leHQgPSAnW2RhdGEtZGVzYyo9XCJuZXh0XCJdJztcblxuZXhwb3J0IGRlZmF1bHQgUGFnaW5hdGlvbjsiLCIndXNlIHN0cmljdCc7XG5pbXBvcnQgRmFxIGZyb20gJy4uL2NvbXBvbmVudHMvY2FyZC9mYXEtY2FyZCc7XG5pbXBvcnQgUGFnaW5hdGlvbiBmcm9tICcuLi91dGlsaXRpZXMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uJztcblxuLyoqXG4gKiBNZXRob2RzIGZvciB0aGUgbWFpbiBQYXR0ZXJucyBpbnN0YW5jZS5cbiAqL1xuY2xhc3MgRGVmYXVsdCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPSAncHJvZHVjdGlvbicpXG4gICAgICBjb25zb2xlLmRpcignQHB0dHJuIERldmVsb3BtZW50IE1vZGUnKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gIH1cblxuICBmYXEoKSB7XG4gICAgcmV0dXJuIG5ldyBGYXEoKTtcbiAgfVxuXG4gIHBhZ2luYXRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBQYWdpbmF0aW9uKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdDtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdz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

'use strict';

class Copy {
  constructor() {

    let copies = document.querySelectorAll(Copy.selector)

    copies.forEach(function (copy) {
      copy.addEventListener('click', function (event) {
        Copy.getCopy(event.target);
      })
    })
  }
}

/**
 * Copy the Markup
 */
Copy.getCopy = function (el) {
  let curText = el.innerText;
  let content = document.querySelector(`[data-content*="${el.getAttribute('data-js')}"]`)
  let contentArea = document.createElement("textarea");

  contentArea.style.opacity = 0
  document.body.appendChild(contentArea);
  contentArea.value = content.innerText;
  contentArea.select();
  document.execCommand("copy");
  document.body.removeChild(contentArea);

  el.innerText = 'Copied!'

  setTimeout(function () {
    el.innerText = curText;
  }, 3000);

}
/** @param  {String}  selector  The main selector for the pattern */
Copy.selector = '[data-js*="copy"]';
Copy.content = '[data-content*="copy"]';

export default Copy;
'use strict';

import Toggle from '@nycopportunity/pttrn-scripts/src/toggle/toggle';

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

export default Accordion;
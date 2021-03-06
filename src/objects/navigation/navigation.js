'use strict';

import Toggle from '@nycopportunity/pttrn-scripts/src/toggle/toggle';

class Navigation {
 
  constructor(settings, data) {
    this.settings = new Toggle({
      selector: Navigation.selector
    });

    return this;
  }
}

Navigation.selector = '[data-js*="navigation"]';

export default Navigation;
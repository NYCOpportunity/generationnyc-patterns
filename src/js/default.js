'use strict';

/**
 * Components
 */
import Accordion from '../components/accordion/accordion';
import BackToTop from '../components/back-to-top/back-to-top';
import Faq from '../components/card/faq-card';

import Navigation from '../objects/navigation/navigation';

/**
 * Utilities
 */
import Anchor from '../utilities/anchor/anchor';
import Copy from '../utilities/copy/copy';
import Pagination from '../utilities/pagination/pagination';

/**
 * Methods for the main Patterns instance.
 */
class Default {
  constructor() {
    if (process.env.NODE_ENV != 'production')
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

export default Default;

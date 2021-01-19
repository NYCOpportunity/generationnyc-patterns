'use strict';

/**
 * Components
 */
import Accordion from '../components/accordion/accordion';
import Faq from '../components/card/faq-card';

/**
 * Utilities
 */
import Anchor from '../utilities/anchor/anchor';
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

  anchor() {
    return new Anchor();
  }

}

export default Default;

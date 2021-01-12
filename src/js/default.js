'use strict';
import Faq from '../components/card/faq-card';
import Pagination from '../utilities/pagination/pagination';
import Accordion from '../components/accordion/accordion';

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

}

export default Default;

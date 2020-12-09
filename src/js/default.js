'use strict';
import Faq from '../components/faq-card/faq-card';


// import {{ Pattern }} from '../{{ type }}/{{ pattern }}/{{ pattern }}';
/** import pattern modules here as they are written */

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
}

export default Default;

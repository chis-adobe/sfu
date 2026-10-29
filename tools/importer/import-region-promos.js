/* eslint-disable */
/* global WebImporter */

import { el, button, block } from './transformers/sfu-cleanup.js';

/**
 * Region promo fragments (/fragments/promo-{canada|usa|international}) for the
 * region personalisation demo. Run against https://www.sfu.ca/?promo=<region>.
 * Pages place them with a Fragment block whose final row is | region | <region> |.
 */
const PROMOS = {
  canada: {
    heading: 'Applying from Canada',
    text: 'Explore undergraduate admission at SFU: requirements, dates and how to apply.',
    cta: ['Undergraduate admission', 'https://www.sfu.ca/main/admission/undergraduate.html'],
  },
  usa: {
    heading: 'Applying from the United States',
    text: 'Students from the U.S. apply to SFU as international students. See requirements and support for applicants from outside Canada.',
    cta: ['Admission for international students', 'https://www.sfu.ca/main/admission/for-international-students.html'],
  },
  international: {
    heading: 'Applying from outside Canada',
    text: 'Join students from around the world at SFU. See requirements and support for international applicants.',
    cta: ['Admission for international students', 'https://www.sfu.ca/main/admission/for-international-students.html'],
  },
};

export default {
  transform: ({ document, params }) => {
    const region = new URL(params.originalURL).searchParams.get('promo');
    const promo = PROMOS[region];
    if (!promo) throw new Error(`Unknown promo region: ${region}`);
    const main = document.createElement('main');
    main.append(block(document, 'Columns (red)', [[[
      el(document, 'h3', promo.heading),
      el(document, 'p', promo.text),
      button(document, promo.cta[1], promo.cta[0], 'secondary'),
    ]]]));
    return [{ element: main, path: `/fragments/promo-${region}`, report: { template: 'region-promo', region } }];
  },
};

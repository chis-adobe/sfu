/* eslint-disable */
/* global WebImporter */

import { preparePosters, buildHomepage, appendSections } from './transformers/sfu-sections.js';

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'SFU landing page: hero, CTA row, panel columns, stats, featured news cards, brand bands, split location cards, stories, events, follow-us columns',
};

export default {
  onLoad: async ({ document }) => {
    await preparePosters(document);
  },

  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.createElement('main');
    const built = buildHomepage(document);
    appendSections(main, built, document);

    const meta = {
      Title: document.title || 'Simon Fraser University',
      Description: document.querySelector('meta[name="description"]')?.content
        || 'SFU is more than a university. We are a research and learning community where excellence matters and everyone is welcome.',
    };
    main.append(document.createElement('hr'));
    main.append(WebImporter.Blocks.getMetadataBlock(document, meta));
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    return [{
      element: main,
      path: '/index',
      report: { title: meta.Title, template: PAGE_TEMPLATE.name, sections: built.length },
    }];
  },
};

/* eslint-disable */
/* global WebImporter */

import { preparePosters, buildHomepage, appendSections } from './transformers/sfu-sections.js';

/**
 * Landing page template (/templates/landing-page): the SFU homepage structure with
 * placeholder copy. Authors duplicate it, then replace text and images per page.
 * Images are kept as visual placeholders.
 */

const PLACEHOLDER = {
  H1: 'Page headline',
  H2: 'Section heading',
  H3: 'Card title',
  P: 'Supporting copy that introduces this section. Keep it to one or two sentences.',
  A: 'Call to action',
};

function placeholderize(root) {
  root.querySelectorAll('h1, h2, h3, p, a').forEach((node) => {
    const table = node.closest('table');
    // keep block names and section metadata intact
    if (table && (node.closest('tr') === table.querySelector('tr') || /section metadata/i.test(table.querySelector('tr')?.textContent || ''))) return;
    if (node.querySelector('img')) return;
    if (node.tagName === 'A') {
      node.textContent = PLACEHOLDER.A;
      return;
    }
    if (node.querySelector('a')) return; // link text handled above, keep button wrappers
    node.textContent = PLACEHOLDER[node.tagName];
  });
  root.querySelectorAll('table strong').forEach((s) => {
    if (!s.querySelector('a')) s.textContent = 'Meta line';
  });
}

export default {
  onLoad: async ({ document }) => {
    await preparePosters(document);
  },

  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    appendSections(main, buildHomepage(document), document);
    placeholderize(main);
    main.append(document.createElement('hr'));
    main.append(WebImporter.Blocks.getMetadataBlock(document, {
      Title: 'Landing page template',
      Description: 'Reusable SFU landing page structure.',
      template: 'landing-page',
    }));
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    return [{ element: main, path: '/templates/landing-page', report: { template: 'landing-page' } }];
  },
};

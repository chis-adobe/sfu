/* eslint-disable */
/* global WebImporter */

import { el } from './transformers/sfu-cleanup.js';
import { preparePosters, appendSections } from './transformers/sfu-sections.js';
import { ENTRIES, exampleBuilder } from './lib/sfu-library-examples.js';

/**
 * Block library (/block-library): every reusable block and variant extracted from the
 * SFU homepage, each shown with a short usage note and a live, authorable example.
 */
export default {
  onLoad: async ({ document }) => {
    await preparePosters(document);
  },

  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    const example = exampleBuilder(document);

    const list = [[
      el(document, 'h1', 'SFU Block Library'),
      el(document, 'p', 'Reusable Edge Delivery Services blocks and variants identified on the SFU homepage. Copy any example into a new page and replace its text and images to build additional SFU experiences.'),
    ]];

    ENTRIES.forEach(([name, description, key]) => {
      const nodes = example(key);
      const label = [el(document, 'h2', name), el(document, 'p', description)];
      // the label replaces the example's own intro so it reads as the section heading
      const body = key === 'locations' || key === 'news' || key === 'stories'
        ? nodes.filter((n) => n.tagName === 'TABLE')
        : nodes;
      if (key === 'cta') {
        // section-wide layouts get their label in a section of its own
        list.push(label, body);
      } else {
        list.push([...label, ...body]);
      }
    });

    appendSections(main, list, document);
    main.append(document.createElement('hr'));
    main.append(WebImporter.Blocks.getMetadataBlock(document, { Title: 'SFU Block Library', Description: 'Reusable SFU blocks and variants for Edge Delivery Services.' }));
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    return [{ element: main, path: '/block-library', report: { template: 'block-library', entries: ENTRIES.length } }];
  },
};

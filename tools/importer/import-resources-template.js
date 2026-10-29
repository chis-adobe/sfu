/* eslint-disable */
/* global WebImporter */

import { el, button, block, sectionMetadata } from './transformers/sfu-cleanup.js';
import { appendSections } from './transformers/sfu-sections.js';

/**
 * Resources page template (/templates/resources): reusable structure for Resources
 * pages with placeholder copy only. The Resources sidenav comes from the template
 * (template: resources), so authors never paste it into pages.
 */
export default {
  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    const p = (t) => el(document, 'p', t);

    appendSections(main, [
      [
        el(document, 'h1', 'Resource page title'),
        el(document, 'p', el(document, 'em', 'Introduce the resource: who it serves and what visitors can find here.')),
        el(document, 'h2', 'Section heading'),
        p('Supporting copy. Use headings, lists, links and existing SFU blocks for page content.'),
        el(document, 'ul', [el(document, 'li', 'Key point or link'), el(document, 'li', 'Key point or link')]),
        block(document, 'Accordion', [
          [p('Topic'), [p('Details revealed when the topic is opened.')]],
          [p('Topic'), [p('Details revealed when the topic is opened.')]],
        ]),
      ],
      [
        el(document, 'h2', 'Contact or next step'),
        p('Short supporting text.'),
        button(document, '#', 'Call to action', 'primary'),
        sectionMetadata(document, 'grey'),
      ],
    ], document);

    main.append(document.createElement('hr'));
    main.append(WebImporter.Blocks.getMetadataBlock(document, {
      Title: 'Resources page template',
      Description: 'Reusable structure for SFU Resources pages.',
      template: 'resources',
    }));
    return [{ element: main, path: '/docs/library/templates/resources', report: { template: 'resources-template' } }];
  },
};

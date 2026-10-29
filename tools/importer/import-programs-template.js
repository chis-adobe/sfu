/* eslint-disable */
/* global WebImporter */

import { el, image, button, block, sectionMetadata } from './transformers/sfu-cleanup.js';
import { appendSections } from './transformers/sfu-sections.js';

/**
 * Programs page template (/templates/programs): the reusable structure for a Programs
 * page, with placeholder copy only. The Programs sidenav is supplied by the template
 * (Template: programs), so authors never paste it into pages.
 */
export default {
  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    const campus = document.querySelector('.main_content.parsys .textimage .block img')
      || document.querySelector('.main_content.parsys img');
    const p = (t) => el(document, 'p', t);

    appendSections(main, [
      [
        el(document, 'h1', 'Program name'),
        block(document, 'Hero (caption)', [
          [campus ? image(document, campus, 'Replace with a program image') : ''],
          [el(document, 'h2', 'Program tagline')],
        ]),
      ],
      [
        button(document, '#', 'Overview', 'secondary'),
        button(document, '#', 'Curriculum', 'secondary'),
        button(document, '#', 'Admission', 'secondary'),
        button(document, '#', 'Students', 'secondary'),
        sectionMetadata(document, 'cta-row, compact'),
      ],
      [
        el(document, 'h2', 'Section heading'),
        p('Introduce the program in one or two sentences: who it is for and what makes it distinctive.'),
        el(document, 'ul', [el(document, 'li', 'Key benefit or feature'), el(document, 'li', 'Key benefit or feature'), el(document, 'li', 'Key benefit or feature')]),
        block(document, 'Accordion', [
          [p('Topic'), [p('Details revealed when the topic is opened.')]],
          [p('Topic'), [p('Details revealed when the topic is opened.')]],
        ]),
        block(document, 'Cards (no images)', [[[el(document, 'h3', 'Info box heading'), p('Supporting text for downloads or resources.')]]]),
        block(document, 'Columns (red)', [[campus ? image(document, campus, 'Replace with an image') : '', [el(document, 'h3', 'Feature heading'), p('Supporting copy for a highlighted feature such as location.')]]]),
        block(document, 'Cards (no images)', [
          [[el(document, 'h3', 'Call to action'), p('Short supporting text.'), button(document, '#', 'Primary action', 'primary')]],
          [[el(document, 'h3', 'Call to action'), p('Short supporting text.'), button(document, '#', 'Secondary action', 'secondary')]],
        ]),
        sectionMetadata(document, 'aside'),
      ],
    ], document);

    main.append(document.createElement('hr'));
    main.append(WebImporter.Blocks.getMetadataBlock(document, {
      Title: 'Programs page template',
      Description: 'Reusable structure for SFU Programs pages.',
      template: 'programs',
    }));
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    return [{ element: main, path: '/docs/library/templates/programs', report: { template: 'programs-template' } }];
  },
};

/* eslint-disable */
/* global WebImporter */

import { text, el, button, sectionMetadata } from './transformers/sfu-cleanup.js';
import { appendSections } from './transformers/sfu-sections.js';
import { FACULTIES, FACULTIES_PAGE, facultyPagePath } from './lib/sfu-faculties.js';

/**
 * SFU Faculties page → /faculties (Admission template). The faculties are the AEM
 * faculty content fragments (lib/sfu-faculties.js, from the FacultyList query), each
 * an outlined button to its majors page; the label comes from the source page.
 */
export default {
  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    const src = document.querySelector('.main_content.parsys');
    const title = text(src?.querySelector('h1')) || 'Faculties';
    const label = text(src?.querySelector('h5, h4, h3')) || 'Select a faculty:';

    appendSections(main, [
      [el(document, 'h1', title)],
      [
        el(document, 'p', el(document, 'strong', label)),
        ...FACULTIES.map((f) => button(document, facultyPagePath(f), f.title, 'secondary')),
        sectionMetadata(document, 'cta-grid'),
      ],
    ], document);

    main.append(document.createElement('hr'));
    main.append(WebImporter.Blocks.getMetadataBlock(document, {
      Title: title,
      Description: 'Explore SFU faculties and the undergraduate majors each one offers.',
      template: 'admission',
    }));
    return [{ element: main, path: FACULTIES_PAGE.path, report: { template: 'admission', faculties: FACULTIES.length } }];
  },
};

/* eslint-disable */
/* global WebImporter */

import { el, button, block, sectionMetadata } from './transformers/sfu-cleanup.js';
import { appendSections } from './transformers/sfu-sections.js';

/**
 * Faculty majors page template (/docs/library/templates/faculty-majors): the structure of
 * a /faculties/<faculty> page with placeholder copy. The Undergraduate Admission sidenav
 * comes from the template (template: admission); the Majors block lists the majors of the
 * content fragment in "faculty-path" (replace the example path with the faculty's own).
 */
export default {
  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    const p = (t) => el(document, 'p', t);

    appendSections(main, [
      [
        el(document, 'h1', 'Faculty name'),
        p('Optional introduction: what students in this faculty study and where it can lead.'),
      ],
      [
        button(document, '#', 'Majors', 'primary'),
        button(document, '#', 'Joint majors', 'secondary'),
        button(document, '#', 'Minors', 'secondary'),
        button(document, '#', 'Certificates', 'secondary'),
        sectionMetadata(document, 'cta-row, compact'),
      ],
      [
        el(document, 'h2', 'Majors'),
        p('You can apply to these directly on the application for admission.'),
        block(document, 'Majors', []),
      ],
    ], document);

    main.append(document.createElement('hr'));
    main.append(WebImporter.Blocks.getMetadataBlock(document, {
      Title: 'Faculty majors page template',
      Description: 'Reusable structure for SFU faculty majors pages.',
      template: 'admission',
      'faculty-path': '/content/dam/sfu/faculties/faculty-of-science',
    }));
    return [{ element: main, path: '/docs/library/templates/faculty-majors', report: { template: 'faculty-majors-template' } }];
  },
};

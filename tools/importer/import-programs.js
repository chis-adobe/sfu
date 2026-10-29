/* eslint-disable */
/* global WebImporter */

import { appendSections } from './transformers/sfu-sections.js';
import { buildProgramSections, localizeLinks } from './transformers/sfu-programs.js';

/**
 * SFU Beedie BBA Major program page → /programs (Programs template).
 * The Programs sidenav is not part of the page: the template adds it.
 */
export default {
  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    appendSections(main, buildProgramSections(document), document);
    localizeLinks(main);
    main.append(document.createElement('hr'));
    main.append(WebImporter.Blocks.getMetadataBlock(document, {
      Title: 'Bachelor of Business Administration Major',
      Description: document.querySelector('meta[name="description"]')?.content
        || 'The SFU Beedie BBA prepares you to apply big-picture thinking to real-world business problems.',
      template: 'programs',
    }));
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    return [{ element: main, path: '/programs/bba-major/program', report: { template: 'programs' } }];
  },
};

/* eslint-disable */
/* global WebImporter */

import sidenavParser from './parsers/sidenav.js';
import { localizeLinks } from './transformers/sfu-programs.js';

/**
 * Shared Programs navigation fragment (/fragments/programs-sidenav), from the source
 * section navigation: its "Programs" item is the title, its children the hierarchy.
 */
export default {
  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    const here = new URL(url).pathname;
    // the section nav is the list (outside main content, header and footer) that contains
    // a "Programs" item with nested children and a link to this page
    const lists = [...document.querySelectorAll('ul')]
      .filter((ul) => !ul.closest('header, footer, nav[aria-label="Primary"], .main_content'));
    const root = lists
      .map((ul) => [...ul.querySelectorAll(':scope > li')].find((li) => li.querySelector(':scope > ul')
        && li.querySelector(`a[href$="${here}"], a[href$="${here.replace(/\.html$/, '')}"]`)))
      .find(Boolean);
    if (root) main.append(sidenavParser(root, { document }, (h) => h));
    localizeLinks(main);
    return [{ element: main, path: '/fragments/programs-sidenav', report: { template: 'programs-sidenav' } }];
  },
};

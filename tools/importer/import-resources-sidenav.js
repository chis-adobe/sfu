/* eslint-disable */
/* global WebImporter */

import { text, el, link, block } from './transformers/sfu-cleanup.js';
import { navList } from './parsers/sidenav.js';
import { localizeLinks } from './transformers/sfu-programs.js';

/**
 * Shared Resources navigation fragment (/fragments/resources-sidenav), from the source
 * site side navigation: its site title becomes the sidenav title, its list the hierarchy.
 * Uses the generic Sidenav block (nested bulleted links).
 */
export default {
  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    const container = document.querySelector('.page-content__side-nav--container');
    const title = container?.querySelector('.site-title a, #side-bar-logo h2 a');
    const list = container?.querySelector(':scope > ul') || container?.querySelector('ul');
    if (list) {
      const cell = [];
      if (title) cell.push(el(document, 'p', link(document, title.getAttribute('href'), text(title))));
      cell.push(navList(document, list));
      main.append(block(document, 'Sidenav', [[cell]]));
    }
    localizeLinks(main);
    return [{ element: main, path: '/fragments/resources-sidenav', report: { template: 'resources-sidenav' } }];
  },
};

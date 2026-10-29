/* eslint-disable */
/* global WebImporter */

import { text, el, link, block } from './transformers/sfu-cleanup.js';
import { appendSections } from './transformers/sfu-sections.js';
import { localizeLinks } from './transformers/sfu-programs.js';

/**
 * SFU Research Facilities page → /resources/research-facilities (Resources template).
 * Page copy is standard authored content; the facility finder is the Facilities block,
 * which loads categories and facilities live from Supabase (no records are imported).
 */
export default {
  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    const src = document.querySelector('.main_content.parsys');
    const label = text(src.querySelector('.filter-section label')).replace(/\s*:\s*$/, '');

    // intro paragraphs: italic copy with a trailing "More about the program" link
    const intro = [...src.querySelectorAll('[class^="preamble"] p')].map((p) => {
      const out = el(document, 'p', []);
      p.childNodes.forEach((n) => {
        if (n.nodeName === 'EM' || n.nodeName === 'I') out.append(el(document, 'em', text(n)));
        else if (n.nodeName === 'A') out.append(' ', link(document, n.getAttribute('href'), text(n)));
      });
      return out;
    });

    appendSections(main, [[
      el(document, 'h1', text(src.querySelector('h1'))),
      ...intro,
      block(document, 'Facilities', [
        ['label', label || 'Category'],
        ['placeholder', 'Select a category'],
      ]),
    ]], document);

    localizeLinks(main);
    main.append(document.createElement('hr'));
    main.append(WebImporter.Blocks.getMetadataBlock(document, {
      Title: text(src.querySelector('h1')) || 'Research Facilities',
      Description: 'Find SFU research centres, institutes and core facilities by category.',
      template: 'resources',
    }));
    return [{ element: main, path: '/resources/research-facilities', report: { template: 'resources' } }];
  },
};

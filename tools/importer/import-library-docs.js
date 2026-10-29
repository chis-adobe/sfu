/* eslint-disable */
/* global WebImporter */

import { el, link, block } from './transformers/sfu-cleanup.js';
import { preparePosters } from './transformers/sfu-sections.js';
import { ENTRIES, exampleBuilder } from './lib/sfu-library-examples.js';

/**
 * DA Library block sample pages (/docs/library/blocks/<doc>), one page per block.
 * Run against https://www.sfu.ca/?libdoc=<doc>. Each variant is a heading (its name in
 * the Library panel) followed by the block and a Library Metadata description.
 */

const DESCRIPTIONS = Object.fromEntries(ENTRIES.map(([, description, key]) => [key, description]));
const tablesOf = (nodes, keepSectionMetadata = false) => nodes.filter((n) => n.tagName === 'TABLE'
  && (keepSectionMetadata || !/^section metadata$/i.test(n.querySelector('tr')?.textContent.trim() || '')));

const SECTION_STYLES = [
  ['red', 'Brand red band with reversed text.'],
  ['dark-red', 'Darker brand red band with reversed text.'],
  ['grey', 'Light grey band.'],
  ['center', 'Centres the section\'s headings and text.'],
  ['split', 'Intro text in a narrow left column, the following block beside it.'],
  ['aside', 'The section\'s last block becomes a side rail beside the rest of the section.'],
  ['cta-row', 'Italic (secondary) links render as an even row of outlined buttons.'],
  ['compact', 'Reduced vertical padding, e.g. for a row of calls to action.'],
];

/** doc slug → [variant name, example key, (optional) table index] items */
const DOCS = {
  hero: [['Hero', 'hero'], ['Hero (caption)', 'hero-caption']],
  cards: [['Cards', 'cards-default'], ['Cards (featured)', 'news'], ['Cards (featured, headline)', 'stories'],
    ['Cards (square)', 'locations'], ['Cards (wide)', 'events'], ['Cards (no images)', 'aside']],
  columns: [['Columns', 'follow'], ['Columns (panel)', 'visit'], ['Columns (link-list)', 'apply'], ['Columns (red)', 'columns-red']],
  stats: [['Stats', 'stats']],
  accordion: [['Accordion', 'accordion']],
  sidenav: [['Sidenav', 'sidenav']],
  facilities: [['Facilities', 'facilities']],
  teaser: [['Teaser', 'teaser'], ['Teaser (link)', 'teaser-link'], ['Teaser (wide, center, bottom)', 'teaser-wide']],
  fragment: [['Fragment (Canada only)', 'region-fragments', 0], ['Fragment (USA only)', 'region-fragments', 1],
    ['Fragment (International only)', 'region-fragments', 2]],
  region: [['Region: everyone', 'region-blocks', 0], ['Region: Canada only', 'region-blocks', 1],
    ['Region: USA only', 'region-blocks', 2], ['Region: International only', 'region-blocks', 3]],
};

export default {
  onLoad: async ({ document }) => {
    await preparePosters(document);
  },

  transform: ({ document, url, params }) => {
    const doc = new URL(params.originalURL).searchParams.get('libdoc');
    const main = document.createElement('main');
    const describe = (text) => block(document, 'Library Metadata', [['description', text]]);

    if (doc === 'section-metadata') {
      SECTION_STYLES.forEach(([style, text]) => {
        main.append(
          el(document, 'h2', `Section: ${style}`),
          WebImporter.DOMUtils.createTable([['Section Metadata'], ['style', style]], document),
          describe(text),
        );
      });
    } else if (DOCS[doc]) {
      const example = exampleBuilder(document);
      DOCS[doc].forEach(([name, key, index]) => {
        const tables = tablesOf(example(key));
        const chosen = index === undefined ? tables.slice(0, 1) : [tables[index]];
        main.append(el(document, 'h2', name), ...chosen, describe(DESCRIPTIONS[key] || ''));
      });
      if (doc === 'fragment') {
        // a plain, unrestricted reference first
        main.prepend(
          el(document, 'h2', 'Fragment'),
          block(document, 'Fragment', [[link(document, '/fragments/promo-canada', '/fragments/promo-canada')]]),
          describe('Includes another page (a fragment) in place. Add a final | region | … | row to show it only to one region.'),
        );
      }
    } else {
      throw new Error(`Unknown library doc: ${doc}`);
    }

    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    return [{ element: main, path: `/docs/library/blocks/${doc}`, report: { template: 'library-doc', doc } }];
  },
};

/* eslint-disable */
/* global WebImporter */

import { el, image, link, button, block, sectionMetadata } from './transformers/sfu-cleanup.js';
import { preparePosters, regions, sections, appendSections } from './transformers/sfu-sections.js';
import { newsCards, eventCards } from './parsers/cards.js';

/**
 * Block library (/block-library): every reusable block and variant extracted from the
 * SFU homepage, each shown with a short usage note and a live, authorable example.
 */

const ENTRIES = [
  ['Hero', 'Full-width image with a headline banner and supporting text. Swap the image, headline and copy for any landing page.', 'hero'],
  ['Cards', 'Default bordered cards: image, linked title and a read-more link. Any number of rows; the grid adapts.', 'cards-default'],
  ['Cards (featured)', 'The first card is promoted to a large lead story; the rest fill the remaining columns.', 'news'],
  ['Cards (featured, headline)', 'Story list with the headline above the image. With five or more cards the lead story spans two rows.', 'stories'],
  ['Cards (square)', 'Square images for places, people or programs. Shown inside the "split" section style.', 'locations'],
  ['Cards (wide)', 'Wide images with a bold date or meta line and a call-to-action button, ideal for events.', 'events'],
  ['Columns', 'Side-by-side images and text. Each cell is one column; images fill their column.', 'follow'],
  ['Columns (panel)', 'Text on a tinted panel with a display headline next to media.', 'visit'],
  ['Columns (link-list)', 'Lists render as stacked, divided links. Shown on the "dark-red" section style.', 'apply'],
  ['Stats', 'Rankings or statistics as bold brand tiles. A final row of plain text becomes the source notes.', 'stats'],
  ['Section style: red', 'Any section can use the brand red band (also: dark-red, grey, center, split, cta-row, compact).', 'meet'],
  ['Hero (caption)', 'In-page hero: the image with its headline in a brand-red bar beneath it.', 'hero-caption'],
  ['Columns (red)', 'The whole row sits on a brand-red panel with reversed text, e.g. an image beside a highlighted message.', 'columns-red'],
  ['Accordion', 'Expandable topics: each row is a title and the content revealed when it is opened.', 'accordion'],
  ['Sidenav', 'Side navigation authored as an ordinary bulleted list of links; nesting sets the hierarchy (up to two levels below the top). An optional first paragraph link becomes the title. The current page is highlighted and its branch expanded automatically.', 'sidenav'],
  ['Facilities', 'Live facility finder: the Category list comes from the Supabase facilities table, and choosing a category runs a filtered Supabase query and lists the matches. Optional rows override the copy (label, placeholder, loading, empty, error) and the table/columns.', 'facilities'],
  ['Section style: aside', 'The last block in the section becomes a side rail beside the rest of the section (used by Programs pages).', 'aside'],
  ['Section style: cta-row', 'Italic (secondary) links in a section render as an even row of outlined buttons.', 'cta'],
];

export default {
  onLoad: async ({ document }) => {
    await preparePosters(document);
  },

  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    const r = regions(document);
    const ctx = { document };

    const extra = {
      'cards-default': () => [newsCards([...r.news.querySelectorAll('li')].filter((li) => li.querySelector('.card-list__item--title')), ctx)],
      events: () => [eventCards([...r.events.querySelectorAll('li')].filter((li) => li.querySelector('.card-list__item--title')), ctx), sectionMetadata(document, 'grey')],
    };

    const p = (t) => el(document, 'p', t);
    const li = (label, href, children) => el(document, 'li', [link(document, href, label), children || null]);
    const ul = (...items) => el(document, 'ul', items);
    const heroImg = r.hero.querySelector('img');
    const campus = r.locations.querySelector('img');
    extra['hero-caption'] = () => [block(document, 'Hero (caption)', [[image(document, heroImg)], [el(document, 'h2', 'See yourself at SFU')]])];
    extra['columns-red'] = () => [block(document, 'Columns (red)', [[image(document, campus), [el(document, 'h3', 'Location'), p('Three campuses in B.C.\'s three largest cities: Burnaby, Surrey and Vancouver.')]]])];
    extra.accordion = () => [block(document, 'Accordion', [
      [p('Schedule'), [p('Program length, terms and class times.')]],
      [p('Tuition, fees, and financing'), [p('Fees, scholarships, bursaries and awards.')]],
    ])];
    // the "Block library" item points at this page so the example shows the current-page state
    extra.sidenav = () => [block(document, 'Sidenav', [[[
      p(link(document, 'https://www.sfu.ca/beedie/programs.html', 'Programs')),
      ul(
        li('Undergraduate', 'https://www.sfu.ca/beedie/programs/undergraduate.html', ul(
          li('BBA Major', '/programs', ul(li('Block library', '/block-library'), li('Curriculum', 'https://www.sfu.ca/beedie/programs/undergraduate/bba-major/curriculum.html'))),
          li('Business Minor', 'https://www.sfu.ca/beedie/programs/undergraduate/business-minor.html'),
        )),
        li('Graduate', 'https://www.sfu.ca/beedie/programs/graduate.html'),
        li('Executive Education', 'https://www.sfu.ca/beedie/programs/executive-education.html'),
      ),
    ]]])];
    extra.facilities = () => [block(document, 'Facilities', [['label', 'Category'], ['placeholder', 'Select a category']])];
    extra.aside = () => [
      p('Main content flows in the wide column. Any blocks can sit here: text, accordions, cards or columns.'),
      block(document, 'Cards (no images)', [
        [[el(document, 'h3', 'How to apply'), p('Check requirements, or submit your application.'), button(document, '/programs', 'Apply now', 'primary')]],
        [[el(document, 'h3', 'Have questions?'), p('Get in touch with the recruitment team.'), button(document, '/programs', 'Book an appointment', 'secondary')]],
      ]),
      sectionMetadata(document, 'aside'),
    ];

    const list = [[
      el(document, 'h1', 'SFU Block Library'),
      el(document, 'p', 'Reusable Edge Delivery Services blocks and variants identified on the SFU homepage. Copy any example into a new page and replace its text and images to build additional SFU experiences.'),
    ]];

    ENTRIES.forEach(([name, description, key]) => {
      const example = extra[key] ? extra[key]() : sections[key](r, ctx);
      const label = [el(document, 'h2', name), el(document, 'p', description)];
      // the label replaces the example's own intro so it reads as the section heading
      const body = key === 'locations' || key === 'news' || key === 'stories'
        ? example.filter((n) => n.tagName === 'TABLE')
        : example;
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

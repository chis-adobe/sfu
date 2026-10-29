/* eslint-disable */
/* global WebImporter */
import { el, image, link, button, block, sectionMetadata } from '../transformers/sfu-cleanup.js';
import { regions, sections, visitBlock, statsBlock } from '../transformers/sfu-sections.js';
import { newsCards, eventCards } from '../parsers/cards.js';

/**
 * The SFU block and variant examples, built from the live sfu.ca homepage, shared by
 * the /block-library page and the DA Library sample pages (/docs/library/blocks/*).
 * Each entry: [label, description, example key].
 */
export const ENTRIES = [
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
  ['Region personalisation', 'Any block can end with the two-column row | region | canada | (or usa, international). The row is never shown; the block renders only for visitors in that region. Blocks without it render for everyone. Try ?region=canada, ?region=usa or ?region=international.', 'region-blocks'],
  ['Region-controlled fragments', 'The same row on a Fragment block: one reference per region, and visitors see only the promo for their region.', 'region-fragments'],
  ['Section style: aside', 'The last block in the section becomes a side rail beside the rest of the section (used by Programs pages).', 'aside'],
  ['Section style: cta-row', 'Italic (secondary) links in a section render as an even row of outlined buttons.', 'cta'],
];

/**
 * Returns a function that builds the example nodes for an entry key.
 * @param {Document} document The sfu.ca homepage document
 */
export function exampleBuilder(document) {
  const r = regions(document);
  const ctx = { document };
  const p = (t) => el(document, 'p', t);
  const li = (label, href, children) => el(document, 'li', [link(document, href, label), children || null]);
  const ul = (...items) => el(document, 'ul', items);
  const heroImg = r.hero.querySelector('img');
  const campus = r.locations.querySelector('img');
  const regionCard = (heading, text, region) => block(document, 'Cards (no images)', [
    [[el(document, 'h3', heading), p(text)]],
    ...(region ? [['region', region]] : []),
  ]);

  const extra = {
    'cards-default': () => [newsCards([...r.news.querySelectorAll('li')].filter((x) => x.querySelector('.card-list__item--title')), ctx)],
    events: () => [eventCards([...r.events.querySelectorAll('li')].filter((x) => x.querySelector('.card-list__item--title')), ctx), sectionMetadata(document, 'grey')],
    'hero-caption': () => [block(document, 'Hero (caption)', [[image(document, heroImg)], [el(document, 'h2', 'See yourself at SFU')]])],
    'columns-red': () => [block(document, 'Columns (red)', [[image(document, campus), [el(document, 'h3', 'Location'), p('Three campuses in B.C.\'s three largest cities: Burnaby, Surrey and Vancouver.')]]])],
    // unrestricted versions; the homepage carries the regional ones
    visit: () => [visitBlock(r, ctx)],
    stats: () => [statsBlock(r, ctx)],
    accordion: () => [block(document, 'Accordion', [
      [p('Schedule'), [p('Program length, terms and class times.')]],
      [p('Tuition, fees, and financing'), [p('Fees, scholarships, bursaries and awards.')]],
    ])],
    // the "Block library" item points at the library page so it shows the current-page state
    sidenav: () => [block(document, 'Sidenav', [[[
      p(link(document, 'https://www.sfu.ca/beedie/programs.html', 'Programs')),
      ul(
        li('Undergraduate', 'https://www.sfu.ca/beedie/programs/undergraduate.html', ul(
          li('BBA Major', '/programs/bba-major/program', ul(li('Block library', '/block-library'), li('Curriculum', '/programs/bba-major/curriculum'))),
          li('Business Minor', 'https://www.sfu.ca/beedie/programs/undergraduate/business-minor.html'),
        )),
        li('Graduate', 'https://www.sfu.ca/beedie/programs/graduate.html'),
        li('Executive Education', 'https://www.sfu.ca/beedie/programs/executive-education.html'),
      ),
    ]]])],
    facilities: () => [block(document, 'Facilities', [['label', 'Category'], ['placeholder', 'Select a category']])],
    'region-blocks': () => [
      regionCard('Everyone', 'No region row: this block renders for every visitor.'),
      regionCard('Canada only', 'This block has | region | canada | and renders only for visitors in Canada.', 'canada'),
      regionCard('USA only', 'This block has | region | usa | and renders only for visitors in the United States.', 'usa'),
      regionCard('International only', 'This block has | region | international | and renders only for visitors outside Canada and the USA.', 'international'),
    ],
    'region-fragments': () => ['canada', 'usa', 'international'].map((reg) => block(document, 'Fragment', [
      [link(document, `/fragments/promo-${reg}`, `/fragments/promo-${reg}`)],
      ['region', reg],
    ])),
    aside: () => [
      p('Main content flows in the wide column. Any blocks can sit here: text, accordions, cards or columns.'),
      block(document, 'Cards (no images)', [
        [[el(document, 'h3', 'How to apply'), p('Check requirements, or submit your application.'), button(document, '/programs/bba-major/program', 'Apply now', 'primary')]],
        [[el(document, 'h3', 'Have questions?'), p('Get in touch with the recruitment team.'), button(document, '/programs/bba-major/program', 'Book an appointment', 'secondary')]],
      ]),
      sectionMetadata(document, 'aside'),
    ],
  };

  return (key) => (extra[key] ? extra[key]() : sections[key](r, ctx));
}

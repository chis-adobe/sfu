/* eslint-disable */
/* global WebImporter */
import { text, el, link, image, button, block } from '../transformers/sfu-cleanup.js';

/**
 * Region-tailored variants of homepage blocks for the region personalisation demo.
 * Canada uses the source page content; the USA and international versions reuse
 * facts and links already published on sfu.ca, reframed for each audience.
 * Every block ends with the | region | <value> | row read by scripts.js.
 */

/**
 * Appends the two-column region row to a block table, and merges every shorter row's
 * last cell across the remaining columns so those rows stay single cells (no padding).
 */
export function withRegion(table, document, region) {
  const tr = document.createElement('tr');
  tr.append(el(document, 'td', 'region'), el(document, 'td', region));
  (table.querySelector('tbody') || table).append(tr);
  table.querySelectorAll('tr').forEach((row) => {
    const cells = [...row.children];
    const width = cells.reduce((n, c) => n + (Number(c.getAttribute('colspan')) || 1), 0);
    if (width < 2) {
      const last = cells[cells.length - 1];
      last.setAttribute('colspan', String((Number(last.getAttribute('colspan')) || 1) + 2 - width));
    }
  });
  return table;
}

/** Ranking footnotes from the source stats section, keyed by their symbol (*, †, ‡). */
export function rankingNotes(document, notesSource) {
  const notes = {};
  notesSource?.querySelectorAll('p').forEach((p) => {
    let current = [];
    const flush = () => {
      const t = current.map((n) => n.textContent).join('').trim();
      if (t) notes[t[0]] = current;
      current = [];
    };
    p.childNodes.forEach((n) => {
      if (n.nodeName === 'BR') flush();
      else if (n.nodeName === 'A') current.push(link(document, n.getAttribute('href'), text(n)));
      else current.push(document.createTextNode(n.textContent.replace(/\s+/g, ' ')));
    });
    flush();
  });
  return notes;
}

const STATS = {
  usa: ['#14 in the world for innovation†', 'Canada’s only NCAA university', '3 campuses in B.C.’s three largest cities'],
  international: ['#14 in the world for innovation†', '60+ research centres and institutes', '#2 in Canada for sustainable cities & communities‡'],
};

/** Stats block for a non-Canada region, with only the footnotes its stats use. */
export function regionalStats(document, region, notes) {
  const stats = STATS[region];
  const used = Object.keys(notes).filter((sym) => stats.some((s) => s.endsWith(sym)));
  const rows = stats.map((s) => [el(document, 'h2', s)]);
  if (used.length) rows.push([used.map((sym) => el(document, 'p', notes[sym].map((n) => n.cloneNode(true))))]);
  return withRegion(block(document, 'Stats', rows), document, region);
}

const VISIT = {
  usa: {
    heading: 'Visit from the U.S.',
    copy: [
      'SFU’s three campuses are in Burnaby, Surrey and Vancouver, British Columbia.',
      'Plan an in-person tour of SFU Burnaby or SFU Surrey on your next trip to B.C., or experience all of our campuses in our immersive virtual tours.',
    ],
    cta: ['Plan your visit', 'https://www.sfu.ca/students/admission/tours-events.html'],
  },
  international: {
    heading: 'Visit from anywhere',
    copy: [
      'Can’t travel to Canada yet? Experience all three SFU campuses from wherever you are with our immersive virtual tours.',
      'Explore our innovative learning environments, facilities, community spaces and student experiences.',
    ],
    cta: ['Explore our campuses', 'https://www.sfu.ca/students/admission/tours-events/virtual-campus-tours.html'],
  },
};

/** Columns (panel) visit block for a non-Canada region. */
export function regionalVisit(document, region, img) {
  const v = VISIT[region];
  const textCol = [el(document, 'h2', v.heading), ...v.copy.map((t) => el(document, 'p', t)), button(document, v.cta[1], v.cta[0], 'primary')];
  return withRegion(block(document, 'Columns (panel)', [[textCol, img || '']]), document, region);
}


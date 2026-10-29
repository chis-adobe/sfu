/* eslint-disable */
/* global WebImporter */
import { text, el, image, button, block, sectionMetadata } from './sfu-cleanup.js';
import accordionParser, { richCopy } from '../parsers/accordion.js';

/**
 * SFU program pages (sfu.ca CLF "program" layout) → Programs template sections:
 * page title + captioned hero, CTA row, and an "aside" section holding the program
 * copy, accordion, info boxes and a side rail of calls to action.
 */

/** Source pages that have been migrated, mapped to their EDS paths. */
export const MIGRATED = {
  '/beedie/programs/undergraduate/bba-major/program.html': '/programs/bba-major/program',
  '/beedie/programs/undergraduate/bba-major/curriculum.html': '/programs/bba-major/curriculum',
  '/research/researcher-resources/resources/research-facilities.html': '/resources/research-facilities',
  '/main/research/researcher-resources/resources/research-facilities.html': '/resources/research-facilities',
};

/** Points links to migrated pages at their new EDS path. */
export function localizeLinks(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    try {
      const u = new URL(a.getAttribute('href'), 'https://www.sfu.ca');
      if (u.hostname === 'www.sfu.ca' && MIGRATED[u.pathname]) a.setAttribute('href', MIGRATED[u.pathname]);
    } catch (e) { /* keep as is */ }
  });
}

export function programRegions(document) {
  const main = document.querySelector('.main_content.parsys');
  return {
    main,
    title: main.querySelector('h1'),
    hero: main.querySelector('.textimage'),
    links: main.querySelector('ul.link-horizonal-buttons, ul.sfu-list'),
    body: main.querySelector('.sfu-columns .c1'),
    rail: main.querySelector('.sfu-columns .c2'),
  };
}

/** Accordion items from CLF toggles: `.toggle.itemN` label + `.toggleContent.itemN` bodies. */
function toggleItems(scope) {
  return [...scope.querySelectorAll('.toggle[class*="item"]')].map((t) => {
    const key = [...t.classList].find((c) => /^item\d+$/.test(c));
    return { label: text(t), bodies: [...scope.querySelectorAll(`.toggleContent.${key}`)] };
  });
}

/** Copy of a box with its trailing link-only paragraph turned into a button. */
function boxCopy(document, box, kind) {
  return richCopy(document, [box]).map((n) => {
    const a = n.tagName === 'P' && n.children.length === 1 ? n.querySelector(':scope > a') : null;
    if (a && text(a) === text(n) && !/download/i.test(text(a))) return button(document, a.getAttribute('href'), text(a), kind);
    return n;
  });
}

export function buildProgramSections(document) {
  const r = programRegions(document);
  const ctx = { document };
  const sections = [];

  // 1 page title + captioned hero
  const heroImg = r.hero?.querySelector('img');
  const caption = r.hero?.querySelector('.text h2, .text h3, .text p');
  sections.push([
    el(document, 'h1', text(r.title)),
    block(document, 'Hero (caption)', [
      [heroImg ? image(document, heroImg) : ''],
      [caption ? el(document, 'h2', text(caption)) : ''],
    ]),
  ]);

  // 2 in-page program links as a CTA row
  if (r.links) {
    sections.push([
      ...[...r.links.querySelectorAll('a')].map((a) => button(document, a.getAttribute('href'), text(a), 'secondary')),
      sectionMetadata(document, 'cta-row, compact'),
    ]);
  }

  // 3 program copy + accordion + info boxes, with the side rail
  const content = [];
  const intro = r.body.querySelector('.text.parbase:not(.toggle-content-container) > div:not(.toggle)');
  if (intro) content.push(...richCopy(document, [intro], undefined, { demote: false }));
  const items = toggleItems(r.body);
  if (items.length) content.push(accordionParser(items, ctx));
  r.body.querySelectorAll('.outline').forEach((box) => {
    content.push(block(document, 'Cards (no images)', [[boxCopy(document, box, 'secondary')]]));
  });
  r.body.querySelectorAll('.textimage .block').forEach((panel) => {
    const img = panel.querySelector('img');
    content.push(block(document, 'Columns (red)', [[img ? image(document, img) : '', richCopy(document, [panel.querySelector('.text')])]]));
  });
  if (r.rail) {
    const boxes = [...r.rail.querySelectorAll('.text > div')].filter((b) => text(b));
    content.push(block(document, 'Cards (no images)', boxes.map((b) => [boxCopy(document, b, b.classList.contains('alt') ? 'primary' : 'secondary')])));
  }
  content.push(sectionMetadata(document, 'aside'));
  sections.push(content);
  return sections;
}

// helper module: no page-level hook work; exports are used by the import scripts
export default function transform(hookName, element, payload) {} // eslint-disable-line no-unused-vars

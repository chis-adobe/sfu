/* eslint-disable */
/* global WebImporter */
import { text, el, link, block } from '../transformers/sfu-cleanup.js';

/**
 * Sidenav: a source section navigation tree → Sidenav block.
 * One row, one cell: an optional title link followed by a nested bulleted list of links.
 */

/** Recursively converts a source list into a clean nested list of links. */
const MAX_DEPTH = 3; // top level + two nested levels

export function navList(document, list, rewrite = (h) => h, depth = 1) {
  const ul = el(document, 'ul', []);
  [...list.children].filter((li) => li.tagName === 'LI').forEach((li) => {
    const a = li.querySelector(':scope > a, :scope > p > a, :scope > div > a');
    if (!a || !text(a)) return;
    const item = el(document, 'li', link(document, rewrite(a.href), text(a)));
    const sub = li.querySelector(':scope > ul');
    if (sub && sub.querySelector('li a') && depth < MAX_DEPTH) item.append(navList(document, sub, rewrite, depth + 1));
    ul.append(item);
  });
  return ul;
}

/**
 * @param {Element} rootItem The source <li> whose link is the navigation title and
 *   whose nested list holds the hierarchy
 */
export default function parse(rootItem, { document }, rewrite = (h) => h) {
  const title = rootItem.querySelector(':scope > a');
  const sub = rootItem.querySelector(':scope > ul');
  const cell = [];
  if (title) cell.push(el(document, 'p', link(document, rewrite(title.href), text(title))));
  if (sub) cell.push(navList(document, sub, rewrite));
  return block(document, 'Sidenav', [[cell]]);
}

/* eslint-disable */
/* global WebImporter */
import { text, el, image, link, button, block } from '../transformers/sfu-cleanup.js';

/**
 * Columns: SFU text + media layouts → Columns block.
 * One row; one cell per visual column (text, image or link list).
 */

/** Copy of a text column: h2, paragraphs, and the trailing CTA as a button. */
export function textColumn(source, { document }, ctaKind = 'primary') {
  const out = [];
  const h2 = source.querySelector('h2');
  if (h2) out.push(el(document, 'h2', text(h2)));
  source.querySelectorAll('p').forEach((p) => {
    const a = p.querySelector('a');
    if (a && text(p) === text(a)) out.push(button(document, a.getAttribute('href'), text(a), ctaKind));
    else if (text(p)) out.push(el(document, 'p', text(p)));
  });
  return out;
}

/** Link list column (ul of links). */
export function linkList(source, { document }) {
  const ul = el(document, 'ul', []);
  source.querySelectorAll('li a').forEach((a) => {
    ul.append(el(document, 'li', link(document, a.getAttribute('href'), text(a))));
  });
  return ul;
}

/**
 * @param {Array<Element|Element[]|string>} cells Prepared column contents
 * @param {string} [variant] Columns variant
 */
export function columns(cells, { document }, variant = '') {
  return block(document, variant ? `Columns (${variant})` : 'Columns', [cells]);
}

export function imageOf(source, { document }, fallbackSrc) {
  const img = source?.querySelector('img');
  if (img) return image(document, img);
  return fallbackSrc ? image(document, fallbackSrc) : '';
}

export default function parse(source, ctx) {
  return columns([textColumn(source, ctx), imageOf(source, ctx)], ctx);
}

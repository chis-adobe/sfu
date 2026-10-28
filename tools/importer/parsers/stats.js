/* eslint-disable */
/* global WebImporter */
import { text, el, link, block } from '../transformers/sfu-cleanup.js';

/**
 * Stats: SFU ranking tiles (+ optional footnote section) → Stats block.
 * One row per stat; the footnotes become a final text-only row.
 * @param {Element} source Section with the ranking headings
 * @param {Element} [notesSource] Section with the ranking footnotes
 */
export default function parse(source, { document }, notesSource) {
  const rows = [...source.querySelectorAll('h2')].map((h) => [el(document, 'h2', text(h))]);
  if (notesSource) {
    // footnotes are one paragraph separated by <br>; keep one paragraph per note
    const notes = [];
    notesSource.querySelectorAll('p').forEach((p) => {
      let current = el(document, 'p', []);
      p.childNodes.forEach((n) => {
        if (n.nodeName === 'BR') {
          if (current.textContent.trim()) notes.push(current);
          current = el(document, 'p', []);
        } else if (n.nodeName === 'A') {
          current.append(link(document, n.getAttribute('href'), text(n)));
        } else {
          current.append(n.textContent.replace(/\s+/g, ' '));
        }
      });
      if (current.textContent.trim()) notes.push(current);
    });
    if (notes.length) rows.push([notes]);
  }
  return block(document, 'Stats', rows);
}

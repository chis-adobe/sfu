/* eslint-disable */
/* global WebImporter */
import { text, el, link, block } from '../transformers/sfu-cleanup.js';

/**
 * Accordion: SFU toggle buttons with their following toggle content → Accordion block.
 * 2 columns; each row is one item: [title cell | content cell].
 */

/** Clean copy of rich text children (headings, paragraphs, lists, links). */
export function richCopy(document, sources, rewrite = (h) => h, { demote = true } = {}) {
  const out = [];
  const copyInline = (from, to) => {
    from.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) to.append(n.textContent.replace(/\s+/g, ' '));
      else if (n.tagName === 'A') to.append(link(document, rewrite(n.href), text(n)));
      else if (['STRONG', 'B'].includes(n.tagName)) to.append(el(document, 'strong', text(n)));
      else if (['EM', 'I'].includes(n.tagName)) to.append(el(document, 'em', text(n)));
      else if (n.tagName !== 'BR') copyInline(n, to);
    });
  };
  sources.forEach((src) => {
    [...src.children].forEach((node) => {
      if (/^H[2-6]$/.test(node.tagName)) out.push(el(document, demote && node.tagName === 'H2' ? 'h3' : node.tagName.toLowerCase(), text(node)));
      else if (node.tagName === 'P' && text(node)) {
        const p = el(document, 'p', []);
        copyInline(node, p);
        out.push(p);
      } else if (node.tagName === 'UL' || node.tagName === 'OL') {
        const list = el(document, node.tagName.toLowerCase(), []);
        node.querySelectorAll(':scope > li').forEach((li) => { const item = el(document, 'li', []); copyInline(li, item); list.append(item); });
        out.push(list);
      }
    });
  });
  return out;
}

/**
 * @param {Array<{label: string, bodies: Element[]}>} items Toggle items with their content
 */
export default function parse(items, { document }, rewrite = (h) => h) {
  return block(document, 'Accordion', items.map(({ label, bodies }) => [
    el(document, 'p', label),
    richCopy(document, bodies, rewrite),
  ]));
}

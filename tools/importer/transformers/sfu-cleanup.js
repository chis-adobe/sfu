/* eslint-disable */
/* global WebImporter */

/**
 * Shared DOM helpers for SFU imports: cloning source nodes without icon ligatures,
 * screen-reader-only text and inline styling, plus small element factories.
 */

const NOISE = '.material-symbols-sharp, .sr-only, .lw_sr_only, svg, noscript, script, style';

/** Collapsed text content of a source node without icon ligatures. */
export function text(el) {
  if (!el) return '';
  const clone = el.cloneNode(true);
  clone.querySelectorAll(NOISE).forEach((n) => n.remove());
  return clone.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

/** Absolute URL for a source attribute value. */
export function abs(href, base) {
  try { return new URL(href, base || document.location.href).href; } catch (e) { return href; }
}

export function el(document, tag, content, attrs = {}) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  if (Array.isArray(content)) node.append(...content.filter(Boolean));
  else if (content instanceof Node) node.append(content);
  else if (content !== undefined && content !== null) node.textContent = content;
  return node;
}

export function link(document, href, label) {
  return el(document, 'a', label, { href: abs(href) });
}

/** <p><strong|em><a/></strong|em></p> — authored button (strong = primary, em = secondary). */
export function button(document, href, label, kind = 'primary') {
  const wrap = el(document, kind === 'secondary' ? 'em' : 'strong', link(document, href, label));
  return el(document, 'p', wrap);
}

/** Image from a source <img> (or URL) with absolute src. */
export function image(document, src, alt = '') {
  const source = typeof src === 'string' ? src : (src.currentSrc || src.src || src.getAttribute('src'));
  const img = document.createElement('img');
  img.src = abs(source);
  img.alt = typeof src === 'string' ? alt : (src.getAttribute('alt') || alt || '');
  return img;
}

/** Heading with an optional link inside. */
export function heading(document, level, label, href) {
  return el(document, `h${level}`, href ? link(document, href, label) : label);
}

export function block(document, name, rows) {
  return WebImporter.DOMUtils.createTable([[name], ...rows], document);
}

export function sectionMetadata(document, style) {
  return WebImporter.DOMUtils.createTable([['Section Metadata'], ['style', style]], document);
}

export default function transform() {}

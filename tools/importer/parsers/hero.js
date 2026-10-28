/* eslint-disable */
/* global WebImporter */
import { text, el, image, block } from '../transformers/sfu-cleanup.js';

/**
 * Hero: SFU "overlay-banner" text-image → Hero block.
 * Row 1: block name. Row 2: background image. Row 3: title + subheading (+ optional CTA).
 * @param {Element} source The source section containing the h1
 */
export default function parse(source, { document }) {
  const img = source.querySelector('img');
  const h1 = source.querySelector('h1');
  const copy = [...source.querySelectorAll('.text p')].map((p) => el(document, 'p', text(p)));
  return block(document, 'Hero', [
    [img ? image(document, img) : ''],
    [[el(document, 'h1', text(h1)), ...copy]],
  ]);
}

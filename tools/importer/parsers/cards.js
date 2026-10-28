/* eslint-disable */
/* global WebImporter */
import { text, el, image, link, heading, button, block } from '../transformers/sfu-cleanup.js';

/**
 * Cards: SFU card lists (news, stories, campus locations, events) → Cards block.
 * 2 columns; each row is one card: [image | heading + description + call-to-action].
 */

/** News "card-list" items: image, linked title, read-more link. */
export function newsCards(items, { document }, variant = '') {
  const rows = items.map((li) => {
    const titleLink = li.querySelector('.card-list__item--title a');
    const href = titleLink?.getAttribute('href');
    const more = li.querySelector('.card-list__item--more a');
    const body = [heading(document, 3, text(titleLink), href)];
    if (more) body.push(el(document, 'p', link(document, more.getAttribute('href'), `${text(more)} →`)));
    return [image(document, li.querySelector('img')), body];
  });
  return block(document, variant ? `Cards (${variant})` : 'Cards', rows);
}

/** Story "configurable-list" items: image + linked headline only. */
export function storyCards(items, { document }, variant = 'featured, headline') {
  const rows = items.map((li) => {
    const a = li.querySelector('.configurable-list__title a, a');
    return [image(document, li.querySelector('img')), [heading(document, 3, text(a), a?.getAttribute('href'))]];
  });
  return block(document, `Cards (${variant})`, rows);
}

/** Campus "textimage overlay" tiles: image + linked place name. */
export function placeCards(tiles, { document }, variant = 'square') {
  const rows = tiles.map((tile) => {
    const a = tile.querySelector('a[href]');
    return [image(document, tile.querySelector('img')), [heading(document, 3, text(tile.querySelector('h3')), a?.getAttribute('href'))]];
  });
  return block(document, `Cards (${variant})`, rows);
}

/** LiveWhale event cards: image, title, date (bold), time, place, category, CTA. */
export function eventCards(items, { document }, variant = 'wide') {
  const rows = items.map((li) => {
    const href = li.querySelector('a[href]')?.getAttribute('href');
    const pick = (sel) => text(li.querySelector(sel));
    const body = [heading(document, 3, pick('.card-list__item--title'))];
    const date = pick('.card-list__item--date');
    if (date) body.push(el(document, 'p', el(document, 'strong', date)));
    ['.card-list__item--time', '.card-list__item--location', '.card-list__item--event-type', '.card-list__item--sponsor']
      .map(pick).filter(Boolean).forEach((t) => body.push(el(document, 'p', t)));
    const cta = pick('.card-list__item--ticket-info');
    if (cta && href) body.push(button(document, href, cta, 'primary'));
    const img = li.querySelector('img');
    return [img ? image(document, img) : '', body];
  });
  return block(document, `Cards (${variant})`, rows);
}

export default function parse(source, ctx) {
  return newsCards([...source.querySelectorAll('li')], ctx);
}

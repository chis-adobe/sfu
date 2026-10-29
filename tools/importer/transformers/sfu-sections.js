/* eslint-disable */
/* global WebImporter */
import { text, el, image, button, heading, block, sectionMetadata } from './sfu-cleanup.js';
import heroParser from '../parsers/hero.js';
import statsParser from '../parsers/stats.js';
import { newsCards, storyCards, placeCards, eventCards } from '../parsers/cards.js';
import { columns, textColumn, linkList, imageOf } from '../parsers/columns.js';
import { withRegion, rankingNotes, regionalStats, regionalVisit } from '../lib/sfu-regional.js';

/**
 * Locates the SFU homepage content regions and builds each EDS section
 * (array of nodes: default content, blocks, section metadata).
 */

const VIMEO_POSTER_ATTR = 'data-import-poster';
const YOUVISIT_PHOTO = (mediaId) => `https://dz0zjhi21dz2t.cloudfront.net/media/144468/photos/${mediaId}/2048.jpg`;

/** Fetch posters for embedded videos so the import can author a still image. */
export async function preparePosters(document) {
  const iframes = [...document.querySelectorAll('iframe[src*="vimeo.com"]')];
  await Promise.all(iframes.map(async (frame) => {
    try {
      const id = new URL(frame.src).pathname.split('/').pop();
      const h = new URL(frame.src).searchParams.get('h');
      const resp = await fetch(`https://vimeo.com/api/oembed.json?width=1280&url=${encodeURIComponent(`https://vimeo.com/${id}${h ? `/${h}` : ''}`)}`);
      if (resp.ok) {
        const json = await resp.json();
        if (json.thumbnail_url) frame.setAttribute(VIMEO_POSTER_ATTR, json.thumbnail_url.split('?')[0]);
      }
    } catch (e) { /* poster is optional */ }
  }));
}

export function regions(document) {
  const all = [...document.querySelectorAll('.main_content.parsys > .sfu-columns')];
  const byHeading = (label) => all.find((s) => [...s.querySelectorAll('h1, h2')].some((h) => text(h).toLowerCase().startsWith(label)));
  const after = (s) => all[all.indexOf(s) + 1];
  const hero = all.find((s) => s.querySelector('h1'));
  const stats = all.find((s) => s.querySelectorAll('h2').length >= 3 && /^#\d/.test(text(s.querySelector('h2'))));
  const news = byHeading('sfu news');
  const stories = byHeading('community stories');
  return {
    hero,
    cta: after(hero),
    visit: byHeading('visit our campus'),
    stats,
    statsNotes: stats && after(stats),
    news,
    newsMore: news && after(news),
    meet: byHeading('meet simon fraser'),
    locations: byHeading('three locations'),
    apply: byHeading('apply now'),
    storiesIntro: stories,
    stories: stories && after(stories),
    events: byHeading('upcoming events'),
    follow: byHeading('follow us'),
  };
}

const intro = (document, source, level = 2) => {
  const out = [];
  const h = source?.querySelector('h2');
  if (h) out.push(heading(document, level, text(h)));
  source?.querySelectorAll('p').forEach((p) => { if (text(p) && !p.querySelector('a')) out.push(el(document, 'p', text(p))); });
  return out;
};

/** Source "Visit our campus" panel (unrestricted). */
export function visitBlock(r, ctx) {
  const frame = r.visit.querySelector('iframe');
  const poster = frame?.getAttribute(VIMEO_POSTER_ATTR);
  return columns([textColumn(r.visit, ctx), poster ? image(ctx.document, poster, text(r.visit.querySelector('h2'))) : imageOf(r.visit, ctx)], ctx, 'panel');
}

/** Source rankings stats (unrestricted). */
export function statsBlock(r, ctx) {
  return statsParser(r.stats, ctx, r.statsNotes);
}

/** Builders: each returns the node list for one EDS section. */
export const sections = {
  hero: (r, ctx) => [heroParser(r.hero, ctx)],

  cta: (r, { document }) => [
    ...[...r.cta.querySelectorAll('a')].map((a) => button(document, a.getAttribute('href'), text(a), 'secondary')),
    sectionMetadata(document, 'cta-row, compact'),
  ],

  // one region-tailored version per region; scripts.js shows only the visitor's
  visit: (r, ctx) => {
    const { document } = ctx;
    const tiles = [...(r.locations?.querySelectorAll('.textimage img') || [])];
    const vancouver = tiles.find((i) => (i.alt || '').toLowerCase().includes('vancouver')) || tiles[tiles.length - 1];
    const aerial = sections.meet(r, ctx)[0]?.querySelector('img');
    return [
      withRegion(visitBlock(r, ctx), document, 'canada'),
      regionalVisit(document, 'usa', vancouver ? image(document, vancouver) : ''),
      regionalVisit(document, 'international', aerial ? image(document, aerial.getAttribute('src'), aerial.getAttribute('alt') || '') : ''),
    ];
  },

  stats: (r, ctx) => {
    const notes = rankingNotes(ctx.document, r.statsNotes);
    return [
      withRegion(statsBlock(r, ctx), ctx.document, 'canada'),
      regionalStats(ctx.document, 'usa', notes),
      regionalStats(ctx.document, 'international', notes),
    ];
  },

  news: (r, ctx) => {
    const { document } = ctx;
    const items = [...r.news.querySelectorAll('li')].filter((li) => li.querySelector('.card-list__item--title'));
    const more = r.newsMore?.querySelector('a');
    return [
      ...intro(document, r.news),
      newsCards(items, ctx, 'featured'),
      more ? button(document, more.getAttribute('href'), text(more), 'secondary') : null,
    ].filter(Boolean);
  },

  meet: (r, ctx) => {
    const frame = r.meet.querySelector('iframe');
    const mediaId = frame ? new URL(frame.src).searchParams.get('media_id') : null;
    const img = mediaId ? image(ctx.document, YOUVISIT_PHOTO(mediaId), 'Aerial view of students forming the letters SFU on Terry Fox Field') : imageOf(r.meet, ctx);
    return [columns([textColumn(r.meet, ctx, 'secondary'), img], ctx), sectionMetadata(ctx.document, 'red')];
  },

  // promotes the migrated Research Facilities page with a linked Teaser; the image is the
  // homepage's research-related story or news photo
  research: (r, { document }) => {
    const items = [...(r.stories?.querySelectorAll('li') || []), ...(r.news?.querySelectorAll('li') || [])];
    const story = items.find((li) => li.querySelector('img') && /research|innovation/i.test(text(li)))
      || items.find((li) => li.querySelector('img'));
    const img = story?.querySelector('img');
    return [block(document, 'Teaser (link)', [
      ...(img ? [[image(document, img)]] : []),
      [[
        heading(document, 3, 'Research'),
        heading(document, 2, 'Find a research facility'),
        el(document, 'p', 'Browse SFU labs, centres and core facilities by category and find the equipment and expertise for your project.'),
        button(document, '/resources/research-facilities', 'Browse facilities', 'primary'),
      ]],
    ])];
  },

  locations: (r, ctx) => [
    ...intro(ctx.document, r.locations),
    placeCards([...r.locations.querySelectorAll('.textimage')].filter((t) => t.querySelector('img')), ctx),
    sectionMetadata(ctx.document, 'split'),
  ],

  apply: (r, ctx) => {
    const { document } = ctx;
    const text2 = intro(document, r.apply);
    return [columns([imageOf(r.apply, ctx), text2, linkList(r.apply, ctx)], ctx, 'link-list'), sectionMetadata(document, 'dark-red')];
  },

  stories: (r, ctx) => [
    ...intro(ctx.document, r.storiesIntro),
    storyCards([...r.stories.querySelectorAll('li')].filter((li) => li.querySelector('img')), ctx),
    sectionMetadata(ctx.document, 'center'),
  ],

  events: (r, ctx) => {
    const { document } = ctx;
    const all = r.events.querySelector('a[href*="events.html"], p > a:last-child');
    const seeAll = [...r.events.querySelectorAll('p a')].find((a) => /all events/i.test(text(a))) || all;
    return [
      heading(document, 2, text(r.events.querySelector('h2'))),
      eventCards([...r.events.querySelectorAll('li')].filter((li) => li.querySelector('.card-list__item--title')), ctx),
      seeAll ? button(document, seeAll.getAttribute('href'), text(seeAll), 'primary') : null,
      sectionMetadata(document, 'grey, center'),
    ].filter(Boolean);
  },

  follow: (r, ctx) => {
    const imgs = [...r.follow.querySelectorAll('img')].map((img) => image(ctx.document, img));
    return [columns([...imgs, textColumn(r.follow, ctx, 'secondary')], ctx)];
  },
};

export const HOMEPAGE_ORDER = ['hero', 'cta', 'visit', 'stats', 'news', 'meet', 'research', 'locations', 'apply', 'stories', 'events', 'follow'];

/** Appends sections (separated by <hr>) to the target element. */
export function appendSections(target, list, document) {
  list.forEach((nodes, i) => {
    if (i > 0) target.append(document.createElement('hr'));
    nodes.forEach((n) => target.append(n));
  });
}

export function buildHomepage(document) {
  const r = regions(document);
  const ctx = { document };
  return HOMEPAGE_ORDER.filter((k) => !(k in r) || r[k]).map((k) => {
    try { return sections[k](r, ctx); } catch (e) { console.error(`Section ${k} failed`, e); return []; }
  }).filter((nodes) => nodes.length);
}

// helper module: no page-level hook work; exports are used by the import scripts
export default function transform(hookName, element, payload) {} // eslint-disable-line no-unused-vars

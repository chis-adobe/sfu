/* eslint-disable */
/* global WebImporter */

import { text, el, link, image } from './transformers/sfu-cleanup.js';

/**
 * Global navigation fragment (/nav). Sections, in order:
 * 1 brand logo · 2 primary nav (nested lists) · 3 tools (dropdowns + search link) · 4 utility bar
 */

function listFrom(document, items, depth = 0) {
  const ul = el(document, 'ul', []);
  items.forEach((li) => {
    const a = li.querySelector(':scope > a');
    if (!a) return;
    const item = el(document, 'li', link(document, a.getAttribute('href'), text(a)));
    const sub = li.querySelector(':scope > ul, :scope > .mega-menu-wrapper > ul');
    if (sub && depth < 2) item.append(listFrom(document, [...sub.children], depth + 1));
    ul.append(item);
  });
  return ul;
}

const ICONS = { facebook: 'facebook', twitter: 'twitter', instagram: 'instagram', youtube: 'youtube', linkedin: 'linkedin' };

function socialParagraph(document, source, extras = []) {
  const p = el(document, 'p', []);
  extras.forEach((n) => { p.append(n, ' '); });
  source.querySelectorAll('a').forEach((a) => {
    const icon = [...(a.querySelector('.icon')?.classList || [])].map((c) => c.replace('icon-', '')).find((c) => ICONS[c]);
    p.append(link(document, a.getAttribute('href'), icon ? `:${ICONS[icon]}:` : text(a)), ' ');
  });
  return p;
}

export default {
  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    const hr = () => document.createElement('hr');

    // 1 brand
    const logo = document.querySelector('.header__content--logo .sfu-brand-logo img') || document.querySelector('.header img');
    main.append(el(document, 'p', image(document, logo, 'Simon Fraser University')));

    // 2 primary navigation
    main.append(hr());
    const topItems = [...document.querySelectorAll('nav[aria-label="Primary"] ul')[0].children];
    main.append(listFrom(document, topItems));

    // 3 tools: campuses, A–Z, sign in dropdowns + search
    main.append(hr());
    const tools = el(document, 'ul', []);
    document.querySelectorAll('.header__content--site-tools ul.site-tools__wrapper > li').forEach((li) => {
      const label = text(li.querySelector('button span') || li.querySelector('button'));
      if (!label) return;
      const item = el(document, 'li', label);
      const sub = li.querySelector('ul');
      if (sub) item.append(listFrom(document, [...sub.children], 2));
      tools.append(item);
    });
    main.append(tools);
    const form = document.querySelector('.header__content--site-tools form, .header form');
    const action = form?.getAttribute('action') || 'https://www.sfu.ca/search.html';
    const searchUrl = new URL(action, url);
    searchUrl.searchParams.set(form?.querySelector('input[type="text"], input[type="search"]')?.name || 'q', '');
    main.append(el(document, 'p', link(document, searchUrl.href, 'Search')));

    // 4 utility bar: home + social + give, audience links
    main.append(hr());
    const home = document.querySelector('.ribbon .social-icons__home-link a');
    const social = document.querySelector('.ribbon .header-left') || document.createElement('div');
    main.append(socialParagraph(document, social, home ? [link(document, home.getAttribute('href'), text(home))] : []));
    const audience = document.querySelector('.ribbon__content--audience-nav ul');
    if (audience) main.append(listFrom(document, [...audience.children], 2));

    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    return [{ element: main, path: '/nav', report: { template: 'nav' } }];
  },
};

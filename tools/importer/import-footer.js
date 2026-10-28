/* eslint-disable */
/* global WebImporter */

import { text, el, link, image } from './transformers/sfu-cleanup.js';

/**
 * Global footer fragment (/footer). Sections, in order:
 * 1 site links · 2 contact + social · 3 utility links + partner logos · 4 brand, acknowledgement, legal
 */

const ICONS = ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'];

function linkList(document, source) {
  const ul = el(document, 'ul', []);
  source?.querySelectorAll('li a').forEach((a) => ul.append(el(document, 'li', link(document, a.getAttribute('href'), text(a)))));
  return ul;
}

export default {
  transform: ({ document, url, params }) => {
    const main = document.createElement('main');
    const hr = () => document.createElement('hr');
    const f = document.querySelector('footer');

    // 1 site links
    const site = f.querySelector('.sfu-global--site-links');
    main.append(el(document, 'h3', text(site.querySelector('h3'))), linkList(document, site));

    // 2 contact + social + give
    main.append(hr());
    const contact = f.querySelector('.sfu-global--contact-info');
    main.append(el(document, 'h3', text(contact.querySelector('h3'))), linkList(document, contact.querySelector('.contact-us')));
    const social = el(document, 'p', []);
    contact.querySelectorAll('.sfu-global--footer-social-links a').forEach((a) => {
      const icon = [...(a.querySelector('.icon')?.classList || [])].map((c) => c.replace('icon-', '')).find((c) => ICONS.includes(c));
      social.append(link(document, a.getAttribute('href'), icon ? `:${icon}:` : text(a)), ' ');
    });
    main.append(social);

    // 3 utility links + partner logos
    main.append(hr());
    const links = f.querySelector('.footer__content--sfu-links');
    main.append(linkList(document, links));
    const logos = el(document, 'p', []);
    links.querySelectorAll('.footer-logos a').forEach((a) => {
      const label = a.getAttribute('href').includes('athletics') ? 'SFU Athletics'
        : a.getAttribute('href').includes('gov.bc.ca') ? 'British Columbia Education Quality Assurance' : 'Ashoka U Changemaker Campus';
      logos.append(image(document, a.querySelector('img'), label), ' ');
    });
    main.append(logos);

    // 4 brand, acknowledgement, legal
    main.append(hr());
    const info = f.querySelector('.footer__content--sfu-info');
    const logo = info.querySelector('.footer__content--sfu-info-logo__img--light-theme') || info.querySelector('img');
    main.append(el(document, 'p', image(document, logo, 'Simon Fraser University')));
    const ack = info.querySelector('.footer__content--sfu-info-acknowledgement p:not(.legal)');
    main.append(el(document, 'p', text(ack)));
    const legal = el(document, 'p', []);
    info.querySelectorAll('.legal a').forEach((a) => legal.append(link(document, a.getAttribute('href'), text(a)), ' '));
    main.append(legal);

    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    return [{ element: main, path: '/footer', report: { template: 'footer' } }];
  },
};

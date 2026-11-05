/* eslint-disable */
/* global WebImporter */

import { text, el, button, block, sectionMetadata } from './transformers/sfu-cleanup.js';
import { appendSections } from './transformers/sfu-sections.js';
import { richCopy } from './parsers/accordion.js';
import { FACULTIES, facultyPagePath } from './lib/sfu-faculties.js';

/**
 * SFU faculty majors pages → /faculties/<slug> (Admission template): title and intro,
 * the faculty's program links as a CTA row, then the majors heading and a Majors block.
 * The majors themselves are not imported: the block loads them live from the faculty
 * content fragment named in the page's "faculty-path" metadata.
 */

/** True when node a comes before node b in the document. */
const before = (a, b) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

/** "MAJORS" → "Majors" (source headings are sometimes typed in capitals). */
const sentenceCase = (s) => (s && s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s);

/** Cleaned copies of the given source paragraphs (inline links and emphasis kept). */
function paragraphs(document, nodes) {
  const wrap = document.createElement('div');
  nodes.forEach((p) => wrap.append(p.cloneNode(true)));
  return richCopy(document, [wrap]).filter((n) => n.tagName === 'P');
}

export default {
  transform: ({ document, url, params }) => {
    const src = document.querySelector('.main_content.parsys');
    const here = new URL(params.originalURL || url).pathname;
    const h1 = text(src?.querySelector('h1'));
    const faculty = FACULTIES.find((f) => f.source && new URL(f.source).pathname === here)
      || FACULTIES.find((f) => f.title === h1);
    if (!faculty) throw new Error(`No faculty content fragment for ${here}`);

    const tabs = src.querySelector('ul.link-horizonal-buttons');
    const columns = [...src.querySelectorAll('.sfu-columns')];
    // intro: copy in the columns above the program links (or the first columns if there are none)
    const introColumns = tabs ? columns.filter((c) => before(c, tabs)) : columns.slice(0, 1);
    const intro = paragraphs(document, introColumns.flatMap((c) => [...c.querySelectorAll('.c1 p')])
      .filter((p) => !p.closest('ul, ol') && (!tabs || before(p, tabs))));

    // majors heading + sentence: the first heading after the program links; a sentence that
    // introduces a source-only list ("…concentrations:") is left out
    const heading = tabs && [...src.querySelectorAll('h2, h3')].find((h) => before(tabs, h));
    const sentence = heading
      ? paragraphs(document, [...heading.parentElement.querySelectorAll('p')]).slice(0, 1)
        .filter((p) => !/:\s*$/.test(p.textContent))
      : [];

    const sections = [[el(document, 'h1', faculty.title), ...intro]];
    if (tabs) {
      sections.push([
        ...[...tabs.querySelectorAll('a')].map((a) => {
          const current = new URL(a.href).pathname === here;
          return button(document, current ? facultyPagePath(faculty) : a.href, text(a), current ? 'primary' : 'secondary');
        }),
        sectionMetadata(document, 'cta-row, compact'),
      ]);
    }
    sections.push([
      el(document, 'h2', sentenceCase(text(heading)) || 'Majors'),
      ...sentence,
      block(document, 'Majors', []),
    ]);

    const main = document.createElement('main');
    appendSections(main, sections, document);
    main.append(document.createElement('hr'));
    main.append(WebImporter.Blocks.getMetadataBlock(document, {
      Title: `${faculty.title} majors`,
      Description: `Undergraduate majors offered by the ${faculty.title} at SFU.`,
      template: 'admission',
      'faculty-path': faculty.path,
    }));
    return [{ element: main, path: facultyPagePath(faculty), report: { template: 'admission', faculty: faculty.path } }];
  },
};

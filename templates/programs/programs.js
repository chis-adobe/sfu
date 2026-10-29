import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../../blocks/fragment/fragment.js';

/** Shared Programs navigation; a page can point elsewhere with "sidenav" metadata. */
const DEFAULT_SIDENAV = '/fragments/programs-sidenav';

/**
 * Programs template: SFU header + Programs sidenav + page content + SFU footer.
 * Adds the shared sidenav fragment beside the page's own sections.
 * @param {Element} main The main element
 */
export default async function decorate(main) {
  const aside = document.createElement('aside');
  aside.className = 'template-sidenav';
  main.prepend(aside);

  const meta = getMetadata('sidenav');
  const path = meta ? new URL(meta, window.location).pathname : DEFAULT_SIDENAV;
  // don't block the first section (LCP) on the navigation fragment
  loadFragment(path).then((fragment) => {
    if (fragment) aside.append(...fragment.childNodes);
  });
}

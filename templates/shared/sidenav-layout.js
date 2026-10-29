import { getMetadata, loadCSS } from '../../scripts/aem.js';
import { loadFragment } from '../../blocks/fragment/fragment.js';

/**
 * Shared layout for templates with a side navigation (Programs, Resources, ...):
 * SFU header + sidenav fragment + page content + SFU footer.
 * Pages may point at another navigation fragment with "sidenav" metadata.
 * @param {Element} main The main element
 * @param {string} defaultSidenav Path of the template's navigation fragment
 */
export default async function decorateSidenavLayout(main, defaultSidenav) {
  await loadCSS(`${window.hlx.codeBasePath}/templates/shared/sidenav-layout.css`);
  document.body.classList.add('sidenav-layout');

  const aside = document.createElement('aside');
  aside.className = 'template-sidenav';
  main.prepend(aside);

  const meta = getMetadata('sidenav');
  const path = meta ? new URL(meta, window.location).pathname : defaultSidenav;
  // don't block the first section (LCP) on the navigation fragment
  loadFragment(path).then((fragment) => {
    if (fragment) aside.append(...fragment.childNodes);
  });
}

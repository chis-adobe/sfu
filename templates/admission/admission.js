import decorateSidenavLayout from '../shared/sidenav-layout.js';

/** Shared Undergraduate Admission navigation; a page can point elsewhere with "sidenav" metadata. */
const DEFAULT_SIDENAV = '/fragments/admission-sidenav';

/**
 * Admission template: SFU header + Undergraduate Admission sidenav + page content + SFU footer.
 * @param {Element} main The main element
 */
export default async function decorate(main) {
  await decorateSidenavLayout(main, DEFAULT_SIDENAV);
}

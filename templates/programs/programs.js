import decorateSidenavLayout from '../shared/sidenav-layout.js';

/** Shared Programs navigation; a page can point elsewhere with "sidenav" metadata. */
const DEFAULT_SIDENAV = '/fragments/programs-sidenav';

/**
 * Programs template: SFU header + Programs sidenav + page content + SFU footer.
 * @param {Element} main The main element
 */
export default async function decorate(main) {
  await decorateSidenavLayout(main, DEFAULT_SIDENAV);
}

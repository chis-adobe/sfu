import decorateSidenavLayout from '../shared/sidenav-layout.js';

/** Shared Resources navigation; a page can point elsewhere with "sidenav" metadata. */
const DEFAULT_SIDENAV = '/fragments/resources-sidenav';

/**
 * Resources template: SFU header + Resources sidenav + page content + SFU footer.
 * @param {Element} main The main element
 */
export default async function decorate(main) {
  await decorateSidenavLayout(main, DEFAULT_SIDENAV);
}

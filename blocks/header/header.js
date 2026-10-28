import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Collapses every open dropdown in the nav.
 * @param {Element} nav The nav element
 * @param {Element} [except] A drop to leave untouched
 */
function closeAllDrops(nav, except) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((drop) => {
    if (drop === except) return;
    drop.setAttribute('aria-expanded', 'false');
    drop.querySelector(':scope > .nav-caret')?.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toggles the mobile menu.
 * @param {Element} nav The nav element
 * @param {boolean|null} forceExpanded Force a state when not null
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button?.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (expanded) closeAllDrops(nav);
}

/**
 * Turns list items with nested lists into dropdowns with a caret toggle button.
 * @param {Element} nav The nav element
 * @param {Element} list The top-level list
 */
function decorateDrops(nav, list) {
  list.querySelectorAll(':scope > li').forEach((item) => {
    const submenu = item.querySelector(':scope > ul');
    if (!submenu) return;
    item.classList.add('nav-drop');
    item.setAttribute('aria-expanded', 'false');

    // label: an authored link, or the item's own text
    let label = item.querySelector(':scope > a, :scope > p > a');
    if (!label) {
      label = document.createElement('span');
      label.className = 'nav-label';
      [...item.childNodes]
        .filter((n) => n !== submenu && (n.nodeType === Node.TEXT_NODE || n.tagName === 'P'))
        .forEach((n) => {
          label.append(n.textContent.trim());
          n.remove();
        });
      item.prepend(label);
    }
    label.classList.add('nav-label');

    const caret = document.createElement('button');
    caret.type = 'button';
    caret.className = 'nav-caret';
    caret.setAttribute('aria-expanded', 'false');
    caret.setAttribute('aria-label', label.textContent.trim());
    label.after(caret);

    const toggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const expanded = item.getAttribute('aria-expanded') === 'true';
      closeAllDrops(nav, item);
      item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      caret.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    };
    caret.addEventListener('click', toggle);
    if (label.tagName !== 'A') label.addEventListener('click', toggle);

    // second level items that have children become mega-menu columns
    submenu.querySelectorAll(':scope > li').forEach((sub) => {
      if (sub.querySelector(':scope > ul')) sub.classList.add('nav-group');
    });
  });
}

/**
 * Builds a search form from an authored search link (label = placeholder, href = action).
 * @param {HTMLAnchorElement} link The search link
 * @returns {HTMLFormElement}
 */
function buildSearch(link) {
  const url = new URL(link.href, window.location.href);
  const form = document.createElement('form');
  form.className = 'nav-search';
  form.action = `${url.origin}${url.pathname}`;
  form.method = 'get';
  form.setAttribute('role', 'search');
  const input = document.createElement('input');
  input.type = 'search';
  input.name = [...url.searchParams.keys()][0] || 'q';
  input.placeholder = link.textContent.trim();
  input.setAttribute('aria-label', link.textContent.trim());
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.setAttribute('aria-label', link.textContent.trim());
  submit.innerHTML = '<span class="nav-search-icon"></span>';
  form.append(input, submit);
  return form;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools', 'utility'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // brand: link the logo to the home page
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    navBrand.querySelectorAll('.button').forEach((btn) => { btn.className = ''; });
    const picture = navBrand.querySelector('picture');
    if (picture && !picture.closest('a')) {
      const link = document.createElement('a');
      link.href = '/';
      link.setAttribute('aria-label', picture.querySelector('img')?.alt || document.title);
      picture.replaceWith(link);
      link.append(picture);
    }
    navBrand.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
  }

  // plain links everywhere in the header (no button styling)
  nav.querySelectorAll('.button').forEach((btn) => btn.classList.remove('button', 'primary', 'secondary'));
  nav.querySelectorAll('.button-wrapper').forEach((p) => p.classList.remove('button-wrapper'));

  const navSections = nav.querySelector('.nav-sections');
  const sectionsList = navSections?.querySelector('ul');
  if (sectionsList) decorateDrops(nav, sectionsList);

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    navTools.querySelectorAll(':scope .default-content-wrapper > ul').forEach((ul) => decorateDrops(nav, ul));
    const search = [...navTools.querySelectorAll('a')].find((a) => /search/i.test(a.href));
    if (search) {
      const holder = search.closest('p') || search;
      holder.replaceWith(buildSearch(search));
    }
  }

  // utility bar renders above the main header row
  const navUtility = nav.querySelector('.nav-utility');
  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility-bar';
  if (navUtility) {
    utilityBar.append(navUtility);
    navUtility.querySelectorAll('a').forEach((a) => {
      const icon = a.querySelector('.icon');
      if (icon && !a.textContent.trim()) {
        a.setAttribute('aria-label', [...icon.classList].find((c) => c.startsWith('icon-'))?.replace('icon-', '') || '');
      }
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-expanded="false" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  // close dropdowns on escape / outside click
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') closeAllDrops(nav);
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAllDrops(nav);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  if (utilityBar.children.length) navWrapper.append(utilityBar);
  navWrapper.append(nav);
  block.append(navWrapper);
}

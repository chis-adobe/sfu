const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Normalizes a URL path for comparison: drops a local preview /content prefix,
 * index pages, extensions and trailing slashes.
 * @param {string} href Absolute or relative URL
 * @returns {string}
 */
function normalizePath(href) {
  try {
    const { pathname } = new URL(href, window.location.href);
    return pathname
      .replace(/^\/content(?=\/)/, '')
      .replace(/(\/index)?(\.plain)?\.html?$/, '')
      .replace(/\/+$/, '') || '/';
  } catch {
    return '';
  }
}

/**
 * Builds one navigation level from an authored list, recursing into nested lists.
 * @param {HTMLUListElement} list Authored list
 * @param {number} depth Nesting depth (1 = top level)
 * @returns {HTMLUListElement}
 */
function buildLevel(list, depth) {
  const ul = document.createElement('ul');
  ul.className = `sidenav-level-${Math.min(depth, 3)}`;
  [...list.children].filter((li) => li.tagName === 'LI').forEach((source) => {
    const li = document.createElement('li');
    const link = source.querySelector(':scope > a, :scope > p > a');
    const child = source.querySelector(':scope > ul, :scope > ol');
    let label;
    if (link) {
      label = link;
    } else {
      label = document.createElement('span');
      label.textContent = [...source.childNodes]
        .filter((n) => n !== child && (n.nodeType === Node.TEXT_NODE || n.tagName === 'P'))
        .map((n) => n.textContent.trim())
        .join(' ');
    }
    label.classList.add('sidenav-link');
    const row = document.createElement('div');
    row.className = 'sidenav-item';
    row.append(label);
    li.append(row);

    if (child) {
      li.classList.add('sidenav-has-children');
      li.setAttribute('aria-expanded', 'false');
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'sidenav-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', label.textContent.trim());
      toggle.addEventListener('click', () => {
        const expanded = li.getAttribute('aria-expanded') === 'true';
        li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
      row.append(toggle);
      li.append(buildLevel(child, depth + 1));
    }
    ul.append(li);
  });
  return ul;
}

/**
 * Marks the link matching the current URL and expands its ancestors.
 * @param {Element} nav The rendered navigation
 */
function markCurrent(nav) {
  const here = normalizePath(window.location.href);
  const links = [...nav.querySelectorAll('a.sidenav-link')];
  // prefer the deepest exact match when several links point to the same page
  const current = links.filter((a) => normalizePath(a.href) === here).pop();
  if (!current) return;
  current.setAttribute('aria-current', 'page');
  let li = current.closest('li');
  li?.classList.add('sidenav-current');
  while (li) {
    if (li.classList.contains('sidenav-has-children')) {
      li.setAttribute('aria-expanded', 'true');
      li.querySelector(':scope > .sidenav-item .sidenav-toggle')?.setAttribute('aria-expanded', 'true');
    }
    li.classList.add('sidenav-trail');
    li = li.parentElement.closest('li');
  }
}

/**
 * Sidenav: side navigation authored as a (nested) bulleted list of links.
 * Optional heading/paragraph content before the list becomes the navigation title.
 * @param {Element} block The sidenav block element
 */
export default function decorate(block) {
  const list = block.querySelector('ul, ol');
  if (!list) return;

  // optional title: first heading or paragraph authored before the list
  const titleSource = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6, p')]
    .find((el) => !list.contains(el) && (el.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING));

  const details = document.createElement('details');
  details.className = 'sidenav-panel';
  const summary = document.createElement('summary');
  summary.className = 'sidenav-title';
  const titleLink = titleSource?.querySelector('a');
  if (titleLink) {
    titleLink.classList.add('sidenav-title-link');
    summary.append(titleLink);
  } else {
    summary.textContent = titleSource?.textContent.trim()
      || list.querySelector('a, li')?.textContent.trim() || '';
  }
  details.append(summary);

  const nav = document.createElement('nav');
  if (titleSource) nav.setAttribute('aria-label', titleSource.textContent.trim());
  nav.append(buildLevel(list, 1));
  details.append(nav);

  block.textContent = '';
  block.append(details);
  markCurrent(nav);

  // always open on desktop; collapsible disclosure on mobile
  const sync = () => { details.open = isDesktop.matches; };
  sync();
  isDesktop.addEventListener('change', sync);
  summary.addEventListener('click', (e) => {
    if (isDesktop.matches && !e.target.closest('a')) e.preventDefault();
  });
}

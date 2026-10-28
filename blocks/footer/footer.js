import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * Fragment sections, in order: site links, contact + social, utility links + partner
 * logos, brand logo + acknowledgement + legal. The first two share a highlighted panel.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-grid';
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  sections.forEach((section, i) => section.classList.add(`footer-col-${i + 1}`));

  if (sections.length > 2) {
    const panel = document.createElement('div');
    panel.className = 'footer-panel';
    panel.append(sections[0], sections[1]);
    footer.append(panel, ...sections.slice(2));
  } else {
    footer.append(...sections);
  }

  // footer links are plain text links, never buttons
  footer.querySelectorAll('.button').forEach((a) => a.classList.remove('button', 'primary', 'secondary'));
  footer.querySelectorAll('.button-wrapper').forEach((p) => p.classList.remove('button-wrapper'));
  footer.querySelectorAll('a').forEach((a) => {
    const icon = a.querySelector('.icon');
    if (icon && !a.textContent.trim()) {
      a.setAttribute('aria-label', [...icon.classList].find((c) => c.startsWith('icon-'))?.replace('icon-', '') || '');
    }
    if (a.querySelector('picture') && !a.textContent.trim()) a.classList.add('footer-logo-link');
  });

  block.append(footer);
}

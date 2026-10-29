/**
 * Teaser: background image with a dark overlay and a text box (optional pre-heading,
 * heading, intro and buttons). Authoring: one row with the image, one row with the text
 * (image and text may also share a single row). A heading directly followed by another
 * heading becomes the pre-heading.
 * Variants: top / bottom (vertical position, default centre), center / right (horizontal,
 * default left), wide (full-width text box, default narrow), focus-left / focus-right
 * (image focus, default centre), link (the whole banner links to the first link).
 * @param {Element} block The teaser block element
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  const content = document.createElement('div');
  content.className = 'teaser-content';

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.childNodes].forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.contains(picture)) return;
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      content.append(node);
    });
  });

  const preheading = content.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
  if (preheading?.nextElementSibling?.matches('h1, h2, h3, h4, h5, h6')) {
    preheading.classList.add('teaser-preheading');
  }

  const buttons = [...content.querySelectorAll(':scope > .button-wrapper')];
  if (buttons.length) {
    const group = document.createElement('div');
    group.className = 'teaser-buttons';
    buttons[0].before(group);
    group.append(...buttons);
  }

  block.textContent = '';
  if (picture) {
    const media = document.createElement('div');
    media.className = 'teaser-image';
    media.append(picture);
    block.append(media);
  } else {
    block.classList.add('no-image');
  }
  block.append(content);

  if (block.classList.contains('link')) {
    const link = content.querySelector('a[href]');
    if (link) link.classList.add('teaser-link');
    else block.classList.remove('link');
  }
}

/**
 * Hero: full-width image with an overlaid headline banner and supporting text.
 * Authoring: one row with the image, one row with heading, text and optional CTAs
 * (image and text may also share a single row).
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  const content = document.createElement('div');
  content.className = 'hero-content';

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.childNodes].forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.contains(picture)) return;
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      content.append(node);
    });
  });

  block.textContent = '';
  if (picture) {
    const media = document.createElement('div');
    media.className = 'hero-image';
    media.append(picture);
    const img = picture.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
    block.append(media);
  } else {
    block.classList.add('no-image');
  }
  block.append(content);
}

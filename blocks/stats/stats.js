/**
 * Stats: a row of bold brand-coloured tiles for rankings, statistics or proof points.
 * Authoring: one row per stat (a heading or short text). Rows containing only plain
 * paragraphs and no heading are treated as footnotes / source notes.
 * @param {Element} block The stats block element
 */
export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'stats-list';
  const notes = document.createElement('div');
  notes.className = 'stats-notes';

  [...block.children].forEach((row) => {
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading && row.querySelector('p') && block.children.length > 1 && list.children.length) {
      notes.append(...row.querySelectorAll(':scope > div > *'));
      return;
    }
    const li = document.createElement('li');
    const cells = [...row.children];
    cells.forEach((cell) => li.append(...cell.childNodes));
    // wrap the headline text so its background can hug each line
    const target = heading || li.querySelector('p');
    if (target) {
      const span = document.createElement('span');
      span.append(...target.childNodes);
      target.append(span);
      target.classList.add('stats-value');
    }
    list.append(li);
  });

  block.textContent = '';
  block.append(list);
  if (notes.children.length) block.append(notes);
}

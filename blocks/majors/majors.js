import { getMetadata, readBlockConfig } from '../../scripts/aem.js';
import AEM from '../../scripts/aem-graphql-config.js';

/** Default UI copy; every string can be overridden by an authored block row. */
const DEFAULT_TEXT = {
  loading: 'Loading majors…',
  empty: 'No majors are listed for this faculty yet.',
  error: 'Majors are unavailable right now. Please try again later.',
};

/**
 * Loads a faculty content fragment from the AEM GetFacultyByPath persisted query.
 * @param {string} path Content fragment path (validated by the caller)
 * @returns {Promise<string[]>} The faculty's majors
 */
async function fetchMajors(path) {
  const resp = await fetch(`${AEM.endpoint}/${AEM.queries.facultyByPath};path=${path}`);
  if (!resp.ok) throw new Error(`Faculty request failed (${resp.status})`);
  const json = await resp.json();
  const item = json?.data?.facultyByPath?.item;
  if (!item) throw new Error('Faculty not found');
  return (Array.isArray(item.majors) ? item.majors : [])
    .map((major) => String(major ?? '').trim())
    .filter(Boolean);
}

/**
 * Majors: the majors of a faculty, loaded live from its AEM content fragment.
 * The faculty comes from the page's "faculty-path" metadata; an optional
 * `| faculty | /content/dam/… |` row overrides it, and `loading` / `empty` / `error`
 * rows override the messages.
 * @param {Element} block The majors block element
 */
export default async function decorate(block) {
  const config = readBlockConfig(block);
  const text = { ...DEFAULT_TEXT };
  Object.keys(text).forEach((key) => { if (config[key]) text[key] = config[key]; });
  const path = (config.faculty || getMetadata('faculty-path') || '').trim();

  block.textContent = '';
  const status = document.createElement('p');
  status.className = 'majors-status';
  status.setAttribute('role', 'status');
  block.append(status);

  if (!AEM.pathPattern.test(path)) {
    status.textContent = text.error;
    // eslint-disable-next-line no-console
    console.warn('majors: missing or invalid faculty path', path);
    return;
  }

  status.textContent = text.loading;
  block.setAttribute('aria-busy', 'true');
  try {
    const majors = await fetchMajors(path);
    if (!majors.length) {
      status.textContent = text.empty;
      return;
    }
    const list = document.createElement('ul');
    list.className = 'majors-list';
    majors.forEach((major) => {
      const li = document.createElement('li');
      li.textContent = major;
      list.append(li);
    });
    status.textContent = '';
    status.hidden = true;
    block.append(list);
  } catch {
    status.textContent = text.error;
  } finally {
    block.removeAttribute('aria-busy');
  }
}

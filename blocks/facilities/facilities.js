import { readBlockConfig } from '../../scripts/aem.js';
import SUPABASE from '../../scripts/supabase-config.js';

/** Column names allowed in queries (prevents injecting PostgREST operators). */
const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;
/** Record fields that are internal bookkeeping, not facility information. */
const HIDDEN_FIELD = /^(id|uuid|created_at|updated_at|inserted_at|deleted_at|.+_id)$/i;
const TITLE_FIELDS = ['name', 'title', 'facility_name', 'facility'];
const DESCRIPTION_FIELDS = ['description', 'summary', 'details', 'about', 'overview'];
const LINK_FIELDS = ['url', 'website', 'link', 'web', 'homepage'];

/** Default UI copy; every string can be overridden by an authored block row. */
const DEFAULT_TEXT = {
  label: 'Category',
  placeholder: 'Select a category',
  loading: 'Loading…',
  empty: 'No facilities found for this category.',
  error: 'Facilities are unavailable right now. Please try again later.',
};

const humanize = (key) => key.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Resolves the connection + query settings: block rows override site config.
 * @param {Object} config Authored block config
 * @returns {Object|null} Settings, or null when incomplete/invalid
 */
function getSettings(config) {
  const settings = {
    url: (SUPABASE.url || '').replace(/\/+$/, ''),
    key: SUPABASE.publishableKey || '',
    table: config.table || SUPABASE.facilities?.table || '',
    categoryColumn: config['category-column'] || SUPABASE.facilities?.categoryColumn || '',
    categoryLabelColumn: config['category-label-column'] || SUPABASE.facilities?.categoryLabelColumn || '',
    orderBy: config['order-by'] || SUPABASE.facilities?.orderBy || '',
    fields: (config.fields || SUPABASE.facilities?.fields || '').split(',').map((f) => f.trim()).filter(Boolean),
  };
  const columns = [settings.table, settings.categoryColumn, settings.categoryLabelColumn,
    settings.orderBy, ...settings.fields]
    .filter(Boolean);
  if (!/^https:\/\/[^/]+$/.test(settings.url) || !settings.key
    || !settings.table || !settings.categoryColumn
    || !columns.every((c) => IDENTIFIER.test(c))) return null;
  return settings;
}

/**
 * Runs a read-only query against the Supabase REST API (PostgREST).
 * @param {Object} settings Connection settings
 * @param {Array<[string, string]>} params Query parameters
 * @returns {Promise<Array<Object>>}
 */
async function query(settings, params) {
  const url = new URL(`${settings.url}/rest/v1/${settings.table}`);
  params.forEach(([k, v]) => url.searchParams.append(k, v));
  const resp = await fetch(url, {
    headers: { apikey: settings.key, Authorization: `Bearer ${settings.key}` },
  });
  if (!resp.ok) throw new Error(`Supabase request failed (${resp.status})`);
  const data = await resp.json();
  if (!Array.isArray(data)) throw new Error('Unexpected Supabase response');
  return data;
}

/**
 * Distinct, non-empty categories present in the data: [{ value, label }].
 * Only the category columns are requested, never the facility records.
 */
async function fetchCategories(settings) {
  const col = settings.categoryColumn;
  const labelCol = settings.categoryLabelColumn || col;
  const rows = await query(settings, [
    ['select', [...new Set([col, labelCol])].join(',')],
    [col, 'not.is.null'], [col, 'neq.'], ['order', `${labelCol}.asc`],
  ]);
  const categories = new Map();
  rows.forEach((r) => {
    const value = String(r[col] ?? '').trim();
    if (value && !categories.has(value)) {
      categories.set(value, String(r[labelCol] ?? '').trim() || value);
    }
  });
  return [...categories].map(([value, label]) => ({ value, label }));
}

/** Facilities in one category, filtered by Supabase (not in the browser). */
async function fetchFacilities(settings, category) {
  const params = [
    ['select', settings.fields.length ? [...new Set([...settings.fields, settings.categoryColumn])].join(',') : '*'],
    [settings.categoryColumn, `eq.${category}`],
  ];
  if (settings.orderBy) params.push(['order', `${settings.orderBy}.asc`]);
  return query(settings, params);
}

/** Renders a field value as text, an email link or a web link. */
function renderValue(value) {
  const text = String(value).trim();
  if (/^https?:\/\/\S+$/i.test(text)) {
    const a = document.createElement('a');
    a.href = text;
    a.textContent = text.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
    return a;
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    const a = document.createElement('a');
    a.href = `mailto:${text}`;
    a.textContent = text;
    return a;
  }
  return document.createTextNode(text);
}

/**
 * Builds one facility card from whatever fields the record actually has.
 * @param {Object} record Facility record
 * @param {Object} settings Query settings
 * @returns {HTMLLIElement}
 */
function renderFacility(record, settings) {
  const present = (key) => {
    const v = record[key];
    return v !== null && v !== undefined && typeof v !== 'object' && String(v).trim() !== '';
  };
  const keys = (settings.fields.length ? settings.fields : Object.keys(record))
    .filter((k) => present(k) && !HIDDEN_FIELD.test(k));
  const titleKey = TITLE_FIELDS.find((k) => keys.includes(k)) || keys.find((k) => typeof record[k] === 'string');
  const descKey = DESCRIPTION_FIELDS.find((k) => keys.includes(k) && k !== titleKey);
  const linkKey = LINK_FIELDS.find((k) => keys.includes(k) && /^https?:\/\//i.test(String(record[k])));

  const li = document.createElement('li');
  li.className = 'facility';
  if (titleKey) {
    const h3 = document.createElement('h3');
    if (linkKey) {
      const a = document.createElement('a');
      a.href = String(record[linkKey]).trim();
      a.textContent = String(record[titleKey]).trim();
      h3.append(a);
    } else {
      h3.textContent = String(record[titleKey]).trim();
    }
    li.append(h3);
  }
  if (descKey) {
    const p = document.createElement('p');
    p.className = 'facility-description';
    p.textContent = String(record[descKey]).trim();
    li.append(p);
  }
  const rest = keys.filter((k) => ![titleKey, descKey, linkKey,
    settings.categoryColumn, settings.categoryLabelColumn].includes(k));
  if (linkKey) {
    const p = document.createElement('p');
    p.className = 'facility-link';
    p.append(renderValue(record[linkKey]));
    li.append(p);
  }
  if (rest.length) {
    const dl = document.createElement('dl');
    rest.forEach((k) => {
      const dt = document.createElement('dt');
      dt.textContent = humanize(k);
      const dd = document.createElement('dd');
      dd.append(renderValue(record[k]));
      dl.append(dt, dd);
    });
    li.append(dl);
  }
  return li;
}

/**
 * Facilities: category dropdown populated from Supabase; choosing a category runs a
 * filtered Supabase query and lists the matching facilities.
 * Optional authored rows: table, category-column, category-label-column, order-by,
 * fields, label, placeholder, loading, empty, error.
 * @param {Element} block The facilities block element
 */
export default async function decorate(block) {
  const config = readBlockConfig(block);
  const text = Object.fromEntries(Object.entries(DEFAULT_TEXT).map(([k, v]) => [k, config[k] || v]));
  const settings = getSettings(config);
  block.textContent = '';

  const id = `facilities-${Math.random().toString(36).slice(2, 8)}`;
  const filter = document.createElement('div');
  filter.className = 'facilities-filter';
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = text.label;
  const select = document.createElement('select');
  select.id = id;
  select.disabled = true;
  const prompt = new Option(text.placeholder, '', true, true);
  prompt.disabled = true;
  select.append(prompt);
  filter.append(label, select);

  const status = document.createElement('p');
  status.className = 'facilities-status';
  status.setAttribute('role', 'status');
  const results = document.createElement('ul');
  results.className = 'facilities-results';
  results.setAttribute('aria-live', 'polite');
  block.append(filter, status, results);

  const setStatus = (message, state) => {
    status.textContent = message || '';
    status.dataset.state = state || '';
    status.hidden = !message;
  };

  if (!settings) {
    // eslint-disable-next-line no-console
    console.warn('facilities: Supabase connection is not configured (scripts/supabase-config.js)');
    setStatus(text.error, 'error');
    return;
  }

  setStatus(text.loading, 'loading');
  try {
    const categories = await fetchCategories(settings);
    categories.forEach((c) => select.append(new Option(c.label, c.value)));
    select.disabled = false;
    setStatus('');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('facilities: could not load categories', e);
    setStatus(text.error, 'error');
    return;
  }

  let request = 0;
  select.addEventListener('change', async () => {
    const current = request + 1;
    request = current;
    results.textContent = '';
    setStatus(text.loading, 'loading');
    try {
      const records = await fetchFacilities(settings, select.value);
      if (current !== request) return; // a newer selection replaced this one
      if (!records.length) {
        setStatus(text.empty, 'empty');
        return;
      }
      setStatus('');
      results.append(...records.map((r) => renderFacility(r, settings)));
    } catch (e) {
      if (current !== request) return;
      // eslint-disable-next-line no-console
      console.error('facilities: query failed', e);
      setStatus(text.error, 'error');
    }
  });
}

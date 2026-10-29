/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-programs-sidenav.js
  var import_programs_sidenav_exports = {};
  __export(import_programs_sidenav_exports, {
    default: () => import_programs_sidenav_default
  });

  // tools/importer/transformers/sfu-cleanup.js
  var NOISE = ".material-symbols-sharp, .sr-only, .lw_sr_only, svg, noscript, script, style";
  function text(el2) {
    if (!el2) return "";
    const clone = el2.cloneNode(true);
    clone.querySelectorAll(NOISE).forEach((n) => n.remove());
    return clone.textContent.replace(/ /g, " ").replace(/\s+/g, " ").trim();
  }
  function abs(href, base) {
    try {
      return new URL(href, base || document.location.href).href;
    } catch (e) {
      return href;
    }
  }
  function el(document2, tag, content, attrs = {}) {
    const node = document2.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    if (Array.isArray(content)) node.append(...content.filter(Boolean));
    else if (content instanceof Node) node.append(content);
    else if (content !== void 0 && content !== null) node.textContent = content;
    return node;
  }
  function link(document2, href, label) {
    if (/^\/(?!\/)/.test(href) && !href.includes(".")) return el(document2, "a", label, { href });
    return el(document2, "a", label, { href: abs(href) });
  }
  function block(document2, name, rows) {
    return WebImporter.DOMUtils.createTable([[name], ...rows], document2);
  }

  // tools/importer/parsers/sidenav.js
  var MAX_DEPTH = 3;
  function navList(document2, list, rewrite = (h) => h, depth = 1) {
    const ul = el(document2, "ul", []);
    [...list.children].filter((li) => li.tagName === "LI").forEach((li) => {
      const a = li.querySelector(":scope > a, :scope > p > a, :scope > div > a");
      if (!a || !text(a)) return;
      const item = el(document2, "li", link(document2, rewrite(a.href), text(a)));
      const sub = li.querySelector(":scope > ul");
      if (sub && sub.querySelector("li a") && depth < MAX_DEPTH) item.append(navList(document2, sub, rewrite, depth + 1));
      ul.append(item);
    });
    return ul;
  }
  function parse(rootItem, { document: document2 }, rewrite = (h) => h) {
    const title = rootItem.querySelector(":scope > a");
    const sub = rootItem.querySelector(":scope > ul");
    const cell = [];
    if (title) cell.push(el(document2, "p", link(document2, rewrite(title.href), text(title))));
    if (sub) cell.push(navList(document2, sub, rewrite));
    return block(document2, "Sidenav", [[cell]]);
  }

  // tools/importer/transformers/sfu-programs.js
  var MIGRATED = {
    "/beedie/programs/undergraduate/bba-major/program.html": "/programs/bba-major/program",
    "/beedie/programs/undergraduate/bba-major/curriculum.html": "/programs/bba-major/curriculum",
    "/research/researcher-resources/resources/research-facilities.html": "/resources/research-facilities",
    "/main/research/researcher-resources/resources/research-facilities.html": "/resources/research-facilities"
  };
  function localizeLinks(root) {
    root.querySelectorAll("a[href]").forEach((a) => {
      try {
        const u = new URL(a.getAttribute("href"), "https://www.sfu.ca");
        if (u.hostname === "www.sfu.ca" && MIGRATED[u.pathname]) a.setAttribute("href", MIGRATED[u.pathname]);
      } catch (e) {
      }
    });
  }

  // tools/importer/import-programs-sidenav.js
  var import_programs_sidenav_default = {
    transform: ({ document: document2, url, params }) => {
      const main = document2.createElement("main");
      const here = new URL(url).pathname;
      const lists = [...document2.querySelectorAll("ul")].filter((ul) => !ul.closest('header, footer, nav[aria-label="Primary"], .main_content'));
      const root = lists.map((ul) => [...ul.querySelectorAll(":scope > li")].find((li) => li.querySelector(":scope > ul") && li.querySelector(`a[href$="${here}"], a[href$="${here.replace(/\.html$/, "")}"]`))).find(Boolean);
      if (root) main.append(parse(root, { document: document2 }, (h) => h));
      localizeLinks(main);
      return [{ element: main, path: "/fragments/programs-sidenav", report: { template: "programs-sidenav" } }];
    }
  };
  return __toCommonJS(import_programs_sidenav_exports);
})();

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

  // tools/importer/import-research-facilities.js
  var import_research_facilities_exports = {};
  __export(import_research_facilities_exports, {
    default: () => import_research_facilities_default
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

  // tools/importer/transformers/sfu-sections.js
  function appendSections(target, list, document2) {
    list.forEach((nodes, i) => {
      if (i > 0) target.append(document2.createElement("hr"));
      nodes.forEach((n) => target.append(n));
    });
  }

  // tools/importer/transformers/sfu-programs.js
  var MIGRATED = {
    "/beedie/programs/undergraduate/bba-major/program.html": "/programs",
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

  // tools/importer/import-research-facilities.js
  var import_research_facilities_default = {
    transform: ({ document: document2, url, params }) => {
      const main = document2.createElement("main");
      const src = document2.querySelector(".main_content.parsys");
      const label = text(src.querySelector(".filter-section label")).replace(/\s*:\s*$/, "");
      const intro = [...src.querySelectorAll('[class^="preamble"] p')].map((p) => {
        const out = el(document2, "p", []);
        p.childNodes.forEach((n) => {
          if (n.nodeName === "EM" || n.nodeName === "I") out.append(el(document2, "em", text(n)));
          else if (n.nodeName === "A") out.append(" ", link(document2, n.getAttribute("href"), text(n)));
        });
        return out;
      });
      appendSections(main, [[
        el(document2, "h1", text(src.querySelector("h1"))),
        ...intro,
        block(document2, "Facilities", [
          ["label", label || "Category"],
          ["placeholder", "Select a category"]
        ])
      ]], document2);
      localizeLinks(main);
      main.append(document2.createElement("hr"));
      main.append(WebImporter.Blocks.getMetadataBlock(document2, {
        Title: text(src.querySelector("h1")) || "Research Facilities",
        Description: "Find SFU research centres, institutes and core facilities by category.",
        template: "resources"
      }));
      return [{ element: main, path: "/resources/research-facilities", report: { template: "resources" } }];
    }
  };
  return __toCommonJS(import_research_facilities_exports);
})();

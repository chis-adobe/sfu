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

  // tools/importer/import-region-promos.js
  var import_region_promos_exports = {};
  __export(import_region_promos_exports, {
    default: () => import_region_promos_default
  });

  // tools/importer/transformers/sfu-cleanup.js
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
  function button(document2, href, label, kind = "primary") {
    const wrap = el(document2, kind === "secondary" ? "em" : "strong", link(document2, href, label));
    return el(document2, "p", wrap);
  }
  function block(document2, name, rows) {
    return WebImporter.DOMUtils.createTable([[name], ...rows], document2);
  }

  // tools/importer/import-region-promos.js
  var PROMOS = {
    canada: {
      heading: "Applying from Canada",
      text: "Explore undergraduate admission at SFU: requirements, dates and how to apply.",
      cta: ["Undergraduate admission", "https://www.sfu.ca/main/admission/undergraduate.html"]
    },
    usa: {
      heading: "Applying from the United States",
      text: "Students from the U.S. apply to SFU as international students. See requirements and support for applicants from outside Canada.",
      cta: ["Admission for international students", "https://www.sfu.ca/main/admission/for-international-students.html"]
    },
    international: {
      heading: "Applying from outside Canada",
      text: "Join students from around the world at SFU. See requirements and support for international applicants.",
      cta: ["Admission for international students", "https://www.sfu.ca/main/admission/for-international-students.html"]
    }
  };
  var import_region_promos_default = {
    transform: ({ document: document2, params }) => {
      const region = new URL(params.originalURL).searchParams.get("promo");
      const promo = PROMOS[region];
      if (!promo) throw new Error(`Unknown promo region: ${region}`);
      const main = document2.createElement("main");
      main.append(block(document2, "Columns (red)", [[[
        el(document2, "h3", promo.heading),
        el(document2, "p", promo.text),
        button(document2, promo.cta[1], promo.cta[0], "secondary")
      ]]]));
      return [{ element: main, path: `/fragments/promo-${region}`, report: { template: "region-promo", region } }];
    }
  };
  return __toCommonJS(import_region_promos_exports);
})();

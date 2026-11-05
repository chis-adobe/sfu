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

  // tools/importer/import-faculty-majors-template.js
  var import_faculty_majors_template_exports = {};
  __export(import_faculty_majors_template_exports, {
    default: () => import_faculty_majors_template_default
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
  function sectionMetadata(document2, style) {
    return WebImporter.DOMUtils.createTable([["Section Metadata"], ["style", style]], document2);
  }

  // tools/importer/transformers/sfu-sections.js
  function appendSections(target, list, document2) {
    list.forEach((nodes, i) => {
      if (i > 0) target.append(document2.createElement("hr"));
      nodes.forEach((n) => target.append(n));
    });
  }

  // tools/importer/import-faculty-majors-template.js
  var import_faculty_majors_template_default = {
    transform: ({ document: document2, url, params }) => {
      const main = document2.createElement("main");
      const p = (t) => el(document2, "p", t);
      appendSections(main, [
        [
          el(document2, "h1", "Faculty name"),
          p("Optional introduction: what students in this faculty study and where it can lead.")
        ],
        [
          button(document2, "#", "Majors", "primary"),
          button(document2, "#", "Joint majors", "secondary"),
          button(document2, "#", "Minors", "secondary"),
          button(document2, "#", "Certificates", "secondary"),
          sectionMetadata(document2, "cta-row, compact")
        ],
        [
          el(document2, "h2", "Majors"),
          p("You can apply to these directly on the application for admission."),
          block(document2, "Majors", [])
        ]
      ], document2);
      main.append(document2.createElement("hr"));
      main.append(WebImporter.Blocks.getMetadataBlock(document2, {
        Title: "Faculty majors page template",
        Description: "Reusable structure for SFU faculty majors pages.",
        template: "admission",
        "faculty-path": "/content/dam/sfu/faculties/faculty-of-science"
      }));
      return [{ element: main, path: "/docs/library/templates/faculty-majors", report: { template: "faculty-majors-template" } }];
    }
  };
  return __toCommonJS(import_faculty_majors_template_exports);
})();

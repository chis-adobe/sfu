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

  // tools/importer/import-programs-template.js
  var import_programs_template_exports = {};
  __export(import_programs_template_exports, {
    default: () => import_programs_template_default
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
  function image(document2, src, alt = "") {
    const source = typeof src === "string" ? src : src.currentSrc || src.src || src.getAttribute("src");
    const img = document2.createElement("img");
    img.src = abs(source);
    img.alt = typeof src === "string" ? alt : src.getAttribute("alt") || alt || "";
    return img;
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

  // tools/importer/import-programs-template.js
  var import_programs_template_default = {
    transform: ({ document: document2, url, params }) => {
      const main = document2.createElement("main");
      const campus = document2.querySelector(".main_content.parsys .textimage .block img") || document2.querySelector(".main_content.parsys img");
      const p = (t) => el(document2, "p", t);
      appendSections(main, [
        [
          el(document2, "h1", "Program name"),
          block(document2, "Hero (caption)", [
            [campus ? image(document2, campus, "Replace with a program image") : ""],
            [el(document2, "h2", "Program tagline")]
          ])
        ],
        [
          button(document2, "#", "Overview", "secondary"),
          button(document2, "#", "Curriculum", "secondary"),
          button(document2, "#", "Admission", "secondary"),
          button(document2, "#", "Students", "secondary"),
          sectionMetadata(document2, "cta-row, compact")
        ],
        [
          el(document2, "h2", "Section heading"),
          p("Introduce the program in one or two sentences: who it is for and what makes it distinctive."),
          el(document2, "ul", [el(document2, "li", "Key benefit or feature"), el(document2, "li", "Key benefit or feature"), el(document2, "li", "Key benefit or feature")]),
          block(document2, "Accordion", [
            [p("Topic"), [p("Details revealed when the topic is opened.")]],
            [p("Topic"), [p("Details revealed when the topic is opened.")]]
          ]),
          block(document2, "Cards (no images)", [[[el(document2, "h3", "Info box heading"), p("Supporting text for downloads or resources.")]]]),
          block(document2, "Columns (red)", [[campus ? image(document2, campus, "Replace with an image") : "", [el(document2, "h3", "Feature heading"), p("Supporting copy for a highlighted feature such as location.")]]]),
          block(document2, "Cards (no images)", [
            [[el(document2, "h3", "Call to action"), p("Short supporting text."), button(document2, "#", "Primary action", "primary")]],
            [[el(document2, "h3", "Call to action"), p("Short supporting text."), button(document2, "#", "Secondary action", "secondary")]]
          ]),
          sectionMetadata(document2, "aside")
        ]
      ], document2);
      main.append(document2.createElement("hr"));
      main.append(WebImporter.Blocks.getMetadataBlock(document2, {
        Title: "Programs page template",
        Description: "Reusable structure for SFU Programs pages.",
        template: "programs",
        sidenav: "/fragments/programs-sidenav"
      }));
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      return [{ element: main, path: "/templates/programs", report: { template: "programs-template" } }];
    }
  };
  return __toCommonJS(import_programs_template_exports);
})();

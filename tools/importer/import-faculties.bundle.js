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

  // tools/importer/import-faculties.js
  var import_faculties_exports = {};
  __export(import_faculties_exports, {
    default: () => import_faculties_default
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
  function button(document2, href, label, kind = "primary") {
    const wrap = el(document2, kind === "secondary" ? "em" : "strong", link(document2, href, label));
    return el(document2, "p", wrap);
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

  // tools/importer/lib/sfu-faculties.js
  var FACULTIES = [
    {
      "title": "Beedie School of Business",
      "path": "/content/dam/sfu/faculties/beedie-school-of-business",
      "slug": "business",
      "source": "https://www.sfu.ca/students/admission/programs/business/majors.html"
    },
    {
      "title": "Faculty of Applied Sciences",
      "path": "/content/dam/sfu/faculties/faculty-of-applied-sciences",
      "slug": "applied-sciences",
      "source": "https://www.sfu.ca/students/admission/programs/applied-sciences/majors.html"
    },
    {
      "title": "Faculty of Arts and Social Sciences",
      "path": "/content/dam/sfu/faculties/faculty-of-arts-and-social-sciences",
      "slug": "arts-social-sciences",
      "source": "https://www.sfu.ca/students/admission/programs/arts-social-sciences/majors.html"
    },
    {
      "title": "Faculty of Communication, Art and Technology",
      "path": "/content/dam/sfu/faculties/faculty-of-communication-art-and-technology",
      "slug": "fcat",
      "source": "https://www.sfu.ca/students/admission/programs/fcat/majors.html"
    },
    {
      "title": "Faculty of Education",
      "path": "/content/dam/sfu/faculties/faculty-of-education",
      "slug": "education",
      "source": "https://www.sfu.ca/students/admission/programs/education/degree-options.html"
    },
    {
      "title": "Faculty of Environment",
      "path": "/content/dam/sfu/faculties/faculty-of-environment",
      "slug": "environment",
      "source": "https://www.sfu.ca/students/admission/programs/environment/majors.html"
    },
    {
      "title": "Faculty of Health Sciences",
      "path": "/content/dam/sfu/faculties/faculty-of-health-sciences",
      "slug": "health-sciences",
      "source": "https://www.sfu.ca/students/admission/programs/health-sciences.html"
    },
    {
      "title": "Faculty of Science",
      "path": "/content/dam/sfu/faculties/faculty-of-science",
      "slug": "science",
      "source": "https://www.sfu.ca/students/admission/programs/science/majors.html"
    }
  ];
  var FACULTIES_PAGE = { source: "https://www.sfu.ca/students/admission/programs/faculties.html", path: "/faculties" };
  var facultyPagePath = (faculty) => `/faculties/${faculty.slug}`;

  // tools/importer/import-faculties.js
  var import_faculties_default = {
    transform: ({ document: document2, url, params }) => {
      const main = document2.createElement("main");
      const src = document2.querySelector(".main_content.parsys");
      const title = text(src == null ? void 0 : src.querySelector("h1")) || "Faculties";
      const label = text(src == null ? void 0 : src.querySelector("h5, h4, h3")) || "Select a faculty:";
      appendSections(main, [
        [el(document2, "h1", title)],
        [
          el(document2, "p", el(document2, "strong", label)),
          ...FACULTIES.map((f) => button(document2, facultyPagePath(f), f.title, "secondary")),
          sectionMetadata(document2, "cta-grid")
        ]
      ], document2);
      main.append(document2.createElement("hr"));
      main.append(WebImporter.Blocks.getMetadataBlock(document2, {
        Title: title,
        Description: "Explore SFU faculties and the undergraduate majors each one offers.",
        template: "admission"
      }));
      return [{ element: main, path: FACULTIES_PAGE.path, report: { template: "admission", faculties: FACULTIES.length } }];
    }
  };
  return __toCommonJS(import_faculties_exports);
})();

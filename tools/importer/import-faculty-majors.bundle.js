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

  // tools/importer/import-faculty-majors.js
  var import_faculty_majors_exports = {};
  __export(import_faculty_majors_exports, {
    default: () => import_faculty_majors_default
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

  // tools/importer/parsers/accordion.js
  function richCopy(document2, sources, rewrite = (h) => h, { demote = true } = {}) {
    const out = [];
    const copyInline = (from, to) => {
      from.childNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) to.append(n.textContent.replace(/\s+/g, " "));
        else if (n.tagName === "A") to.append(link(document2, rewrite(n.href), text(n)));
        else if (["STRONG", "B"].includes(n.tagName)) to.append(el(document2, "strong", text(n)));
        else if (["EM", "I"].includes(n.tagName)) to.append(el(document2, "em", text(n)));
        else if (n.tagName !== "BR") copyInline(n, to);
      });
    };
    sources.forEach((src) => {
      [...src.children].forEach((node) => {
        if (/^H[2-6]$/.test(node.tagName)) out.push(el(document2, demote && node.tagName === "H2" ? "h3" : node.tagName.toLowerCase(), text(node)));
        else if (node.tagName === "P" && text(node)) {
          const p = el(document2, "p", []);
          copyInline(node, p);
          out.push(p);
        } else if (node.tagName === "UL" || node.tagName === "OL") {
          const list = el(document2, node.tagName.toLowerCase(), []);
          node.querySelectorAll(":scope > li").forEach((li) => {
            const item = el(document2, "li", []);
            copyInline(li, item);
            list.append(item);
          });
          out.push(list);
        }
      });
    });
    return out;
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
  var facultyPagePath = (faculty) => `/faculties/${faculty.slug}`;

  // tools/importer/import-faculty-majors.js
  var before = (a, b) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
  var sentenceCase = (s) => s && s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s;
  function paragraphs(document2, nodes) {
    const wrap = document2.createElement("div");
    nodes.forEach((p) => wrap.append(p.cloneNode(true)));
    return richCopy(document2, [wrap]).filter((n) => n.tagName === "P");
  }
  var import_faculty_majors_default = {
    transform: ({ document: document2, url, params }) => {
      const src = document2.querySelector(".main_content.parsys");
      const here = new URL(params.originalURL || url).pathname;
      const h1 = text(src == null ? void 0 : src.querySelector("h1"));
      const faculty = FACULTIES.find((f) => f.source && new URL(f.source).pathname === here) || FACULTIES.find((f) => f.title === h1);
      if (!faculty) throw new Error(`No faculty content fragment for ${here}`);
      const tabs = src.querySelector("ul.link-horizonal-buttons");
      const columns2 = [...src.querySelectorAll(".sfu-columns")];
      const introColumns = tabs ? columns2.filter((c) => before(c, tabs)) : columns2.slice(0, 1);
      const intro = paragraphs(document2, introColumns.flatMap((c) => [...c.querySelectorAll(".c1 p")]).filter((p) => !p.closest("ul, ol") && (!tabs || before(p, tabs))));
      const heading2 = tabs && [...src.querySelectorAll("h2, h3")].find((h) => before(tabs, h));
      const sentence = heading2 ? paragraphs(document2, [...heading2.parentElement.querySelectorAll("p")]).slice(0, 1).filter((p) => !/:\s*$/.test(p.textContent)) : [];
      const sections = [[el(document2, "h1", faculty.title), ...intro]];
      if (tabs) {
        sections.push([
          ...[...tabs.querySelectorAll("a")].map((a) => {
            const current = new URL(a.href).pathname === here;
            return button(document2, current ? facultyPagePath(faculty) : a.href, text(a), current ? "primary" : "secondary");
          }),
          sectionMetadata(document2, "cta-row, compact")
        ]);
      }
      sections.push([
        el(document2, "h2", sentenceCase(text(heading2)) || "Majors"),
        ...sentence,
        block(document2, "Majors", [])
      ]);
      const main = document2.createElement("main");
      appendSections(main, sections, document2);
      main.append(document2.createElement("hr"));
      main.append(WebImporter.Blocks.getMetadataBlock(document2, {
        Title: `${faculty.title} majors`,
        Description: `Undergraduate majors offered by the ${faculty.title} at SFU.`,
        template: "admission",
        "faculty-path": faculty.path
      }));
      return [{ element: main, path: facultyPagePath(faculty), report: { template: "admission", faculty: faculty.path } }];
    }
  };
  return __toCommonJS(import_faculty_majors_exports);
})();

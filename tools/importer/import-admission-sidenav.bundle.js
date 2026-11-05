/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
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

  // tools/importer/import-admission-sidenav.js
  var import_admission_sidenav_exports = {};
  __export(import_admission_sidenav_exports, {
    default: () => import_admission_sidenav_default
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

  // tools/importer/transformers/sfu-programs.js
  var MIGRATED = __spreadValues({
    "/beedie/programs/undergraduate/bba-major/program.html": "/programs/bba-major/program",
    "/beedie/programs/undergraduate/bba-major/curriculum.html": "/programs/bba-major/curriculum",
    "/research/researcher-resources/resources/research-facilities.html": "/resources/research-facilities",
    "/main/research/researcher-resources/resources/research-facilities.html": "/resources/research-facilities",
    [new URL(FACULTIES_PAGE.source).pathname]: FACULTIES_PAGE.path
  }, Object.fromEntries(FACULTIES.filter((f) => f.source).map((f) => [new URL(f.source).pathname, facultyPagePath(f)])));
  function localizeLinks(root) {
    root.querySelectorAll("a[href]").forEach((a) => {
      try {
        const u = new URL(a.getAttribute("href"), "https://www.sfu.ca");
        if (u.hostname === "www.sfu.ca" && MIGRATED[u.pathname]) a.setAttribute("href", MIGRATED[u.pathname]);
      } catch (e) {
      }
    });
  }

  // tools/importer/import-admission-sidenav.js
  var import_admission_sidenav_default = {
    transform: ({ document: document2, url, params }) => {
      const main = document2.createElement("main");
      const container = document2.querySelector(".page-content__side-nav--container");
      const title = container == null ? void 0 : container.querySelector(".site-title a, #side-bar-logo h2 a, h2 a");
      const list = (container == null ? void 0 : container.querySelector(":scope > ul")) || (container == null ? void 0 : container.querySelector("ul"));
      if (list) {
        const cell = [];
        if (title) cell.push(el(document2, "p", link(document2, title.getAttribute("href"), text(title))));
        cell.push(navList(document2, list));
        main.append(block(document2, "Sidenav", [[cell]]));
      }
      localizeLinks(main);
      return [{ element: main, path: "/fragments/admission-sidenav", report: { template: "admission-sidenav" } }];
    }
  };
  return __toCommonJS(import_admission_sidenav_exports);
})();

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

  // tools/importer/import-programs.js
  var import_programs_exports = {};
  __export(import_programs_exports, {
    default: () => import_programs_default
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
  function parse3(items, { document: document2 }, rewrite = (h) => h) {
    return block(document2, "Accordion", items.map(({ label, bodies }) => [
      el(document2, "p", label),
      richCopy(document2, bodies, rewrite)
    ]));
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
  function programRegions(document2) {
    const main = document2.querySelector(".main_content.parsys");
    return {
      main,
      title: main.querySelector("h1"),
      hero: main.querySelector(".textimage"),
      links: main.querySelector("ul.link-horizonal-buttons, ul.sfu-list"),
      body: main.querySelector(".sfu-columns .c1"),
      rail: main.querySelector(".sfu-columns .c2")
    };
  }
  function toggleItems(scope) {
    return [...scope.querySelectorAll('.toggle[class*="item"]')].map((t) => {
      const key = [...t.classList].find((c) => /^item\d+$/.test(c));
      return { label: text(t), bodies: [...scope.querySelectorAll(`.toggleContent.${key}`)] };
    });
  }
  function boxCopy(document2, box, kind) {
    return richCopy(document2, [box]).map((n) => {
      const a = n.tagName === "P" && n.children.length === 1 ? n.querySelector(":scope > a") : null;
      if (a && text(a) === text(n) && !/download/i.test(text(a))) return button(document2, a.getAttribute("href"), text(a), kind);
      return n;
    });
  }
  function buildProgramSections(document2) {
    var _a, _b;
    const r = programRegions(document2);
    const ctx = { document: document2 };
    const sections = [];
    const heroImg = (_a = r.hero) == null ? void 0 : _a.querySelector("img");
    const caption = (_b = r.hero) == null ? void 0 : _b.querySelector(".text h2, .text h3, .text p");
    sections.push([
      el(document2, "h1", text(r.title)),
      block(document2, "Hero (caption)", [
        [heroImg ? image(document2, heroImg) : ""],
        [caption ? el(document2, "h2", text(caption)) : ""]
      ])
    ]);
    if (r.links) {
      sections.push([
        ...[...r.links.querySelectorAll("a")].map((a) => button(document2, a.getAttribute("href"), text(a), "secondary")),
        sectionMetadata(document2, "cta-row, compact")
      ]);
    }
    const content = [];
    const intro = r.body.querySelector(".text.parbase:not(.toggle-content-container) > div:not(.toggle)");
    if (intro) content.push(...richCopy(document2, [intro], void 0, { demote: false }));
    const items = toggleItems(r.body);
    if (items.length) content.push(parse3(items, ctx));
    r.body.querySelectorAll(".outline").forEach((box) => {
      content.push(block(document2, "Cards (no images)", [[boxCopy(document2, box, "secondary")]]));
    });
    r.body.querySelectorAll(".textimage .block").forEach((panel) => {
      const img = panel.querySelector("img");
      content.push(block(document2, "Columns (red)", [[img ? image(document2, img) : "", richCopy(document2, [panel.querySelector(".text")])]]));
    });
    if (r.rail) {
      const boxes = [...r.rail.querySelectorAll(".text > div")].filter((b) => text(b));
      content.push(block(document2, "Cards (no images)", boxes.map((b) => [boxCopy(document2, b, b.classList.contains("alt") ? "primary" : "secondary")])));
    }
    content.push(sectionMetadata(document2, "aside"));
    sections.push(content);
    return sections;
  }

  // tools/importer/import-programs.js
  var import_programs_default = {
    transform: ({ document: document2, url, params }) => {
      var _a;
      const main = document2.createElement("main");
      appendSections(main, buildProgramSections(document2), document2);
      localizeLinks(main);
      main.append(document2.createElement("hr"));
      main.append(WebImporter.Blocks.getMetadataBlock(document2, {
        Title: "Bachelor of Business Administration Major",
        Description: ((_a = document2.querySelector('meta[name="description"]')) == null ? void 0 : _a.content) || "The SFU Beedie BBA prepares you to apply big-picture thinking to real-world business problems.",
        template: "programs"
      }));
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      return [{ element: main, path: "/programs/bba-major/program", report: { template: "programs" } }];
    }
  };
  return __toCommonJS(import_programs_exports);
})();

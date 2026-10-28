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

  // tools/importer/import-nav.js
  var import_nav_exports = {};
  __export(import_nav_exports, {
    default: () => import_nav_default
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
    return el(document2, "a", label, { href: abs(href) });
  }
  function image(document2, src, alt = "") {
    const source = typeof src === "string" ? src : src.currentSrc || src.src || src.getAttribute("src");
    const img = document2.createElement("img");
    img.src = abs(source);
    img.alt = typeof src === "string" ? alt : src.getAttribute("alt") || alt || "";
    return img;
  }

  // tools/importer/import-nav.js
  function listFrom(document2, items, depth = 0) {
    const ul = el(document2, "ul", []);
    items.forEach((li) => {
      const a = li.querySelector(":scope > a");
      if (!a) return;
      const item = el(document2, "li", link(document2, a.getAttribute("href"), text(a)));
      const sub = li.querySelector(":scope > ul, :scope > .mega-menu-wrapper > ul");
      if (sub && depth < 2) item.append(listFrom(document2, [...sub.children], depth + 1));
      ul.append(item);
    });
    return ul;
  }
  var ICONS = { facebook: "facebook", twitter: "twitter", instagram: "instagram", youtube: "youtube", linkedin: "linkedin" };
  function socialParagraph(document2, source, extras = []) {
    const p = el(document2, "p", []);
    extras.forEach((n) => {
      p.append(n, " ");
    });
    source.querySelectorAll("a").forEach((a) => {
      var _a;
      const icon = [...((_a = a.querySelector(".icon")) == null ? void 0 : _a.classList) || []].map((c) => c.replace("icon-", "")).find((c) => ICONS[c]);
      p.append(link(document2, a.getAttribute("href"), icon ? `:${ICONS[icon]}:` : text(a)), " ");
    });
    return p;
  }
  var import_nav_default = {
    transform: ({ document: document2, url, params }) => {
      var _a;
      const main = document2.createElement("main");
      const hr = () => document2.createElement("hr");
      const logo = document2.querySelector(".header__content--logo .sfu-brand-logo img") || document2.querySelector(".header img");
      main.append(el(document2, "p", image(document2, logo, "Simon Fraser University")));
      main.append(hr());
      const topItems = [...document2.querySelectorAll('nav[aria-label="Primary"] ul')[0].children];
      main.append(listFrom(document2, topItems));
      main.append(hr());
      const tools = el(document2, "ul", []);
      document2.querySelectorAll(".header__content--site-tools ul.site-tools__wrapper > li").forEach((li) => {
        const label = text(li.querySelector("button span") || li.querySelector("button"));
        if (!label) return;
        const item = el(document2, "li", label);
        const sub = li.querySelector("ul");
        if (sub) item.append(listFrom(document2, [...sub.children], 2));
        tools.append(item);
      });
      main.append(tools);
      const form = document2.querySelector(".header__content--site-tools form, .header form");
      const action = (form == null ? void 0 : form.getAttribute("action")) || "https://www.sfu.ca/search.html";
      const searchUrl = new URL(action, url);
      searchUrl.searchParams.set(((_a = form == null ? void 0 : form.querySelector('input[type="text"], input[type="search"]')) == null ? void 0 : _a.name) || "q", "");
      main.append(el(document2, "p", link(document2, searchUrl.href, "Search")));
      main.append(hr());
      const home = document2.querySelector(".ribbon .social-icons__home-link a");
      const social = document2.querySelector(".ribbon .header-left") || document2.createElement("div");
      main.append(socialParagraph(document2, social, home ? [link(document2, home.getAttribute("href"), text(home))] : []));
      const audience = document2.querySelector(".ribbon__content--audience-nav ul");
      if (audience) main.append(listFrom(document2, [...audience.children], 2));
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      return [{ element: main, path: "/nav", report: { template: "nav" } }];
    }
  };
  return __toCommonJS(import_nav_exports);
})();

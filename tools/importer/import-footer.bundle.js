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

  // tools/importer/import-footer.js
  var import_footer_exports = {};
  __export(import_footer_exports, {
    default: () => import_footer_default
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

  // tools/importer/import-footer.js
  var ICONS = ["facebook", "twitter", "instagram", "youtube", "linkedin"];
  function linkList(document2, source) {
    const ul = el(document2, "ul", []);
    source == null ? void 0 : source.querySelectorAll("li a").forEach((a) => ul.append(el(document2, "li", link(document2, a.getAttribute("href"), text(a)))));
    return ul;
  }
  var import_footer_default = {
    transform: ({ document: document2, url, params }) => {
      const main = document2.createElement("main");
      const hr = () => document2.createElement("hr");
      const f = document2.querySelector("footer");
      const site = f.querySelector(".sfu-global--site-links");
      main.append(el(document2, "h3", text(site.querySelector("h3"))), linkList(document2, site));
      main.append(hr());
      const contact = f.querySelector(".sfu-global--contact-info");
      main.append(el(document2, "h3", text(contact.querySelector("h3"))), linkList(document2, contact.querySelector(".contact-us")));
      const social = el(document2, "p", []);
      contact.querySelectorAll(".sfu-global--footer-social-links a").forEach((a) => {
        var _a;
        const icon = [...((_a = a.querySelector(".icon")) == null ? void 0 : _a.classList) || []].map((c) => c.replace("icon-", "")).find((c) => ICONS.includes(c));
        social.append(link(document2, a.getAttribute("href"), icon ? `:${icon}:` : text(a)), " ");
      });
      main.append(social);
      main.append(hr());
      const links = f.querySelector(".footer__content--sfu-links");
      main.append(linkList(document2, links));
      const logos = el(document2, "p", []);
      links.querySelectorAll(".footer-logos a").forEach((a) => {
        const label = a.getAttribute("href").includes("athletics") ? "SFU Athletics" : a.getAttribute("href").includes("gov.bc.ca") ? "British Columbia Education Quality Assurance" : "Ashoka U Changemaker Campus";
        logos.append(image(document2, a.querySelector("img"), label), " ");
      });
      main.append(logos);
      main.append(hr());
      const info = f.querySelector(".footer__content--sfu-info");
      const logo = info.querySelector(".footer__content--sfu-info-logo__img--light-theme") || info.querySelector("img");
      main.append(el(document2, "p", image(document2, logo, "Simon Fraser University")));
      const ack = info.querySelector(".footer__content--sfu-info-acknowledgement p:not(.legal)");
      main.append(el(document2, "p", text(ack)));
      const legal = el(document2, "p", []);
      info.querySelectorAll(".legal a").forEach((a) => legal.append(link(document2, a.getAttribute("href"), text(a)), " "));
      main.append(legal);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      return [{ element: main, path: "/footer", report: { template: "footer" } }];
    }
  };
  return __toCommonJS(import_footer_exports);
})();

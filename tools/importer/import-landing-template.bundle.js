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
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // tools/importer/import-landing-template.js
  var import_landing_template_exports = {};
  __export(import_landing_template_exports, {
    default: () => import_landing_template_default
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
  function heading(document2, level, label, href) {
    return el(document2, `h${level}`, href ? link(document2, href, label) : label);
  }
  function block(document2, name, rows) {
    return WebImporter.DOMUtils.createTable([[name], ...rows], document2);
  }
  function sectionMetadata(document2, style) {
    return WebImporter.DOMUtils.createTable([["Section Metadata"], ["style", style]], document2);
  }

  // tools/importer/parsers/hero.js
  function parse(source, { document: document2 }) {
    const img = source.querySelector("img");
    const h1 = source.querySelector("h1");
    const copy = [...source.querySelectorAll(".text p")].map((p) => el(document2, "p", text(p)));
    return block(document2, "Hero", [
      [img ? image(document2, img) : ""],
      [[el(document2, "h1", text(h1)), ...copy]]
    ]);
  }

  // tools/importer/parsers/stats.js
  function parse2(source, { document: document2 }, notesSource) {
    const rows = [...source.querySelectorAll("h2")].map((h) => [el(document2, "h2", text(h))]);
    if (notesSource) {
      const notes = [];
      notesSource.querySelectorAll("p").forEach((p) => {
        let current = el(document2, "p", []);
        p.childNodes.forEach((n) => {
          if (n.nodeName === "BR") {
            if (current.textContent.trim()) notes.push(current);
            current = el(document2, "p", []);
          } else if (n.nodeName === "A") {
            current.append(link(document2, n.getAttribute("href"), text(n)));
          } else {
            current.append(n.textContent.replace(/\s+/g, " "));
          }
        });
        if (current.textContent.trim()) notes.push(current);
      });
      if (notes.length) rows.push([notes]);
    }
    return block(document2, "Stats", rows);
  }

  // tools/importer/parsers/cards.js
  function newsCards(items, { document: document2 }, variant = "") {
    const rows = items.map((li) => {
      const titleLink = li.querySelector(".card-list__item--title a");
      const href = titleLink == null ? void 0 : titleLink.getAttribute("href");
      const more = li.querySelector(".card-list__item--more a");
      const body = [heading(document2, 3, text(titleLink), href)];
      if (more) body.push(el(document2, "p", link(document2, more.getAttribute("href"), `${text(more)} \u2192`)));
      return [image(document2, li.querySelector("img")), body];
    });
    return block(document2, variant ? `Cards (${variant})` : "Cards", rows);
  }
  function storyCards(items, { document: document2 }, variant = "featured, headline") {
    const rows = items.map((li) => {
      const a = li.querySelector(".configurable-list__title a, a");
      return [image(document2, li.querySelector("img")), [heading(document2, 3, text(a), a == null ? void 0 : a.getAttribute("href"))]];
    });
    return block(document2, `Cards (${variant})`, rows);
  }
  function placeCards(tiles, { document: document2 }, variant = "square") {
    const rows = tiles.map((tile) => {
      const a = tile.querySelector("a[href]");
      return [image(document2, tile.querySelector("img")), [heading(document2, 3, text(tile.querySelector("h3")), a == null ? void 0 : a.getAttribute("href"))]];
    });
    return block(document2, `Cards (${variant})`, rows);
  }
  function eventCards(items, { document: document2 }, variant = "wide") {
    const rows = items.map((li) => {
      var _a;
      const href = (_a = li.querySelector("a[href]")) == null ? void 0 : _a.getAttribute("href");
      const pick = (sel) => text(li.querySelector(sel));
      const body = [heading(document2, 3, pick(".card-list__item--title"))];
      const date = pick(".card-list__item--date");
      if (date) body.push(el(document2, "p", el(document2, "strong", date)));
      [".card-list__item--time", ".card-list__item--location", ".card-list__item--event-type", ".card-list__item--sponsor"].map(pick).filter(Boolean).forEach((t) => body.push(el(document2, "p", t)));
      const cta = pick(".card-list__item--ticket-info");
      if (cta && href) body.push(button(document2, href, cta, "primary"));
      const img = li.querySelector("img");
      return [img ? image(document2, img) : "", body];
    });
    return block(document2, `Cards (${variant})`, rows);
  }

  // tools/importer/parsers/columns.js
  function textColumn(source, { document: document2 }, ctaKind = "primary") {
    const out = [];
    const h2 = source.querySelector("h2");
    if (h2) out.push(el(document2, "h2", text(h2)));
    source.querySelectorAll("p").forEach((p) => {
      const a = p.querySelector("a");
      if (a && text(p) === text(a)) out.push(button(document2, a.getAttribute("href"), text(a), ctaKind));
      else if (text(p)) out.push(el(document2, "p", text(p)));
    });
    return out;
  }
  function linkList(source, { document: document2 }) {
    const ul = el(document2, "ul", []);
    source.querySelectorAll("li a").forEach((a) => {
      ul.append(el(document2, "li", link(document2, a.getAttribute("href"), text(a))));
    });
    return ul;
  }
  function columns(cells, { document: document2 }, variant = "") {
    return block(document2, variant ? `Columns (${variant})` : "Columns", [cells]);
  }
  function imageOf(source, { document: document2 }, fallbackSrc) {
    const img = source == null ? void 0 : source.querySelector("img");
    if (img) return image(document2, img);
    return fallbackSrc ? image(document2, fallbackSrc) : "";
  }

  // tools/importer/lib/sfu-regional.js
  function withRegion(table, document2, region) {
    const tr = document2.createElement("tr");
    tr.append(el(document2, "td", "region"), el(document2, "td", region));
    (table.querySelector("tbody") || table).append(tr);
    table.querySelectorAll("tr").forEach((row) => {
      const cells = [...row.children];
      const width = cells.reduce((n, c) => n + (Number(c.getAttribute("colspan")) || 1), 0);
      if (width < 2) {
        const last = cells[cells.length - 1];
        last.setAttribute("colspan", String((Number(last.getAttribute("colspan")) || 1) + 2 - width));
      }
    });
    return table;
  }
  function rankingNotes(document2, notesSource) {
    const notes = {};
    notesSource == null ? void 0 : notesSource.querySelectorAll("p").forEach((p) => {
      let current = [];
      const flush = () => {
        const t = current.map((n) => n.textContent).join("").trim();
        if (t) notes[t[0]] = current;
        current = [];
      };
      p.childNodes.forEach((n) => {
        if (n.nodeName === "BR") flush();
        else if (n.nodeName === "A") current.push(link(document2, n.getAttribute("href"), text(n)));
        else current.push(document2.createTextNode(n.textContent.replace(/\s+/g, " ")));
      });
      flush();
    });
    return notes;
  }
  var STATS = {
    usa: ["#14 in the world for innovation\u2020", "Canada\u2019s only NCAA university", "3 campuses in B.C.\u2019s three largest cities"],
    international: ["#14 in the world for innovation\u2020", "60+ research centres and institutes", "#2 in Canada for sustainable cities & communities\u2021"]
  };
  function regionalStats(document2, region, notes) {
    const stats = STATS[region];
    const used = Object.keys(notes).filter((sym) => stats.some((s) => s.endsWith(sym)));
    const rows = stats.map((s) => [el(document2, "h2", s)]);
    if (used.length) rows.push([used.map((sym) => el(document2, "p", notes[sym].map((n) => n.cloneNode(true))))]);
    return withRegion(block(document2, "Stats", rows), document2, region);
  }
  var VISIT = {
    usa: {
      heading: "Visit from the U.S.",
      copy: [
        "SFU\u2019s three campuses are in Burnaby, Surrey and Vancouver, British Columbia.",
        "Plan an in-person tour of SFU Burnaby or SFU Surrey on your next trip to B.C., or experience all of our campuses in our immersive virtual tours."
      ],
      cta: ["Plan your visit", "https://www.sfu.ca/students/admission/tours-events.html"]
    },
    international: {
      heading: "Visit from anywhere",
      copy: [
        "Can\u2019t travel to Canada yet? Experience all three SFU campuses from wherever you are with our immersive virtual tours.",
        "Explore our innovative learning environments, facilities, community spaces and student experiences."
      ],
      cta: ["Explore our campuses", "https://www.sfu.ca/students/admission/tours-events/virtual-campus-tours.html"]
    }
  };
  function regionalVisit(document2, region, img) {
    const v = VISIT[region];
    const textCol = [el(document2, "h2", v.heading), ...v.copy.map((t) => el(document2, "p", t)), button(document2, v.cta[1], v.cta[0], "primary")];
    return withRegion(block(document2, "Columns (panel)", [[textCol, img || ""]]), document2, region);
  }

  // tools/importer/transformers/sfu-sections.js
  var VIMEO_POSTER_ATTR = "data-import-poster";
  var YOUVISIT_PHOTO = (mediaId) => `https://dz0zjhi21dz2t.cloudfront.net/media/144468/photos/${mediaId}/2048.jpg`;
  function preparePosters(document2) {
    return __async(this, null, function* () {
      const iframes = [...document2.querySelectorAll('iframe[src*="vimeo.com"]')];
      yield Promise.all(iframes.map((frame) => __async(null, null, function* () {
        try {
          const id = new URL(frame.src).pathname.split("/").pop();
          const h = new URL(frame.src).searchParams.get("h");
          const resp = yield fetch(`https://vimeo.com/api/oembed.json?width=1280&url=${encodeURIComponent(`https://vimeo.com/${id}${h ? `/${h}` : ""}`)}`);
          if (resp.ok) {
            const json = yield resp.json();
            if (json.thumbnail_url) frame.setAttribute(VIMEO_POSTER_ATTR, json.thumbnail_url.split("?")[0]);
          }
        } catch (e) {
        }
      })));
    });
  }
  function regions(document2) {
    const all = [...document2.querySelectorAll(".main_content.parsys > .sfu-columns")];
    const byHeading = (label) => all.find((s) => [...s.querySelectorAll("h1, h2")].some((h) => text(h).toLowerCase().startsWith(label)));
    const after = (s) => all[all.indexOf(s) + 1];
    const hero = all.find((s) => s.querySelector("h1"));
    const stats = all.find((s) => s.querySelectorAll("h2").length >= 3 && /^#\d/.test(text(s.querySelector("h2"))));
    const news = byHeading("sfu news");
    const stories = byHeading("community stories");
    return {
      hero,
      cta: after(hero),
      visit: byHeading("visit our campus"),
      stats,
      statsNotes: stats && after(stats),
      news,
      newsMore: news && after(news),
      meet: byHeading("meet simon fraser"),
      locations: byHeading("three locations"),
      apply: byHeading("apply now"),
      storiesIntro: stories,
      stories: stories && after(stories),
      events: byHeading("upcoming events"),
      follow: byHeading("follow us")
    };
  }
  var intro = (document2, source, level = 2) => {
    const out = [];
    const h = source == null ? void 0 : source.querySelector("h2");
    if (h) out.push(heading(document2, level, text(h)));
    source == null ? void 0 : source.querySelectorAll("p").forEach((p) => {
      if (text(p) && !p.querySelector("a")) out.push(el(document2, "p", text(p)));
    });
    return out;
  };
  function visitBlock(r, ctx) {
    const frame = r.visit.querySelector("iframe");
    const poster = frame == null ? void 0 : frame.getAttribute(VIMEO_POSTER_ATTR);
    return columns([textColumn(r.visit, ctx), poster ? image(ctx.document, poster, text(r.visit.querySelector("h2"))) : imageOf(r.visit, ctx)], ctx, "panel");
  }
  function statsBlock(r, ctx) {
    return parse2(r.stats, ctx, r.statsNotes);
  }
  var sections = {
    hero: (r, ctx) => [parse(r.hero, ctx)],
    cta: (r, { document: document2 }) => [
      ...[...r.cta.querySelectorAll("a")].map((a) => button(document2, a.getAttribute("href"), text(a), "secondary")),
      sectionMetadata(document2, "cta-row, compact")
    ],
    // one region-tailored version per region; scripts.js shows only the visitor's
    visit: (r, ctx) => {
      var _a, _b;
      const { document: document2 } = ctx;
      const tiles = [...((_a = r.locations) == null ? void 0 : _a.querySelectorAll(".textimage img")) || []];
      const vancouver = tiles.find((i) => (i.alt || "").toLowerCase().includes("vancouver")) || tiles[tiles.length - 1];
      const aerial = (_b = sections.meet(r, ctx)[0]) == null ? void 0 : _b.querySelector("img");
      return [
        withRegion(visitBlock(r, ctx), document2, "canada"),
        regionalVisit(document2, "usa", vancouver ? image(document2, vancouver) : ""),
        regionalVisit(document2, "international", aerial ? image(document2, aerial.getAttribute("src"), aerial.getAttribute("alt") || "") : "")
      ];
    },
    stats: (r, ctx) => {
      const notes = rankingNotes(ctx.document, r.statsNotes);
      return [
        withRegion(statsBlock(r, ctx), ctx.document, "canada"),
        regionalStats(ctx.document, "usa", notes),
        regionalStats(ctx.document, "international", notes)
      ];
    },
    news: (r, ctx) => {
      var _a;
      const { document: document2 } = ctx;
      const items = [...r.news.querySelectorAll("li")].filter((li) => li.querySelector(".card-list__item--title"));
      const more = (_a = r.newsMore) == null ? void 0 : _a.querySelector("a");
      return [
        ...intro(document2, r.news),
        newsCards(items, ctx, "featured"),
        more ? button(document2, more.getAttribute("href"), text(more), "secondary") : null
      ].filter(Boolean);
    },
    meet: (r, ctx) => {
      const frame = r.meet.querySelector("iframe");
      const mediaId = frame ? new URL(frame.src).searchParams.get("media_id") : null;
      const img = mediaId ? image(ctx.document, YOUVISIT_PHOTO(mediaId), "Aerial view of students forming the letters SFU on Terry Fox Field") : imageOf(r.meet, ctx);
      return [columns([textColumn(r.meet, ctx, "secondary"), img], ctx), sectionMetadata(ctx.document, "red")];
    },
    locations: (r, ctx) => [
      ...intro(ctx.document, r.locations),
      placeCards([...r.locations.querySelectorAll(".textimage")].filter((t) => t.querySelector("img")), ctx),
      sectionMetadata(ctx.document, "split")
    ],
    apply: (r, ctx) => {
      const { document: document2 } = ctx;
      const text2 = intro(document2, r.apply);
      return [columns([imageOf(r.apply, ctx), text2, linkList(r.apply, ctx)], ctx, "link-list"), sectionMetadata(document2, "dark-red")];
    },
    stories: (r, ctx) => [
      ...intro(ctx.document, r.storiesIntro),
      storyCards([...r.stories.querySelectorAll("li")].filter((li) => li.querySelector("img")), ctx),
      sectionMetadata(ctx.document, "center")
    ],
    events: (r, ctx) => {
      const { document: document2 } = ctx;
      const all = r.events.querySelector('a[href*="events.html"], p > a:last-child');
      const seeAll = [...r.events.querySelectorAll("p a")].find((a) => /all events/i.test(text(a))) || all;
      return [
        heading(document2, 2, text(r.events.querySelector("h2"))),
        eventCards([...r.events.querySelectorAll("li")].filter((li) => li.querySelector(".card-list__item--title")), ctx),
        seeAll ? button(document2, seeAll.getAttribute("href"), text(seeAll), "primary") : null,
        sectionMetadata(document2, "grey, center")
      ].filter(Boolean);
    },
    follow: (r, ctx) => {
      const imgs = [...r.follow.querySelectorAll("img")].map((img) => image(ctx.document, img));
      return [columns([...imgs, textColumn(r.follow, ctx, "secondary")], ctx)];
    }
  };
  var HOMEPAGE_ORDER = ["hero", "cta", "visit", "stats", "news", "meet", "locations", "apply", "stories", "events", "follow"];
  function appendSections(target, list, document2) {
    list.forEach((nodes, i) => {
      if (i > 0) target.append(document2.createElement("hr"));
      nodes.forEach((n) => target.append(n));
    });
  }
  function buildHomepage(document2) {
    const r = regions(document2);
    const ctx = { document: document2 };
    return HOMEPAGE_ORDER.filter((k) => r[k === "stories" ? "stories" : k]).map((k) => {
      try {
        return sections[k](r, ctx);
      } catch (e) {
        console.error(`Section ${k} failed`, e);
        return [];
      }
    }).filter((nodes) => nodes.length);
  }

  // tools/importer/import-landing-template.js
  var PLACEHOLDER = {
    H1: "Page headline",
    H2: "Section heading",
    H3: "Card title",
    P: "Supporting copy that introduces this section. Keep it to one or two sentences.",
    A: "Call to action"
  };
  function placeholderize(root) {
    root.querySelectorAll("h1, h2, h3, p, a").forEach((node) => {
      var _a;
      const table = node.closest("table");
      if (table && (node.closest("tr") === table.querySelector("tr") || /section metadata/i.test(((_a = table.querySelector("tr")) == null ? void 0 : _a.textContent) || ""))) return;
      if (node.querySelector("img")) return;
      if (node.tagName === "A") {
        node.textContent = PLACEHOLDER.A;
        return;
      }
      if (node.querySelector("a")) return;
      node.textContent = PLACEHOLDER[node.tagName];
    });
    root.querySelectorAll("table strong").forEach((s) => {
      if (!s.querySelector("a")) s.textContent = "Meta line";
    });
  }
  var import_landing_template_default = {
    onLoad: (_0) => __async(null, [_0], function* ({ document: document2 }) {
      yield preparePosters(document2);
    }),
    transform: ({ document: document2, url, params }) => {
      const main = document2.createElement("main");
      appendSections(main, buildHomepage(document2), document2);
      placeholderize(main);
      main.append(document2.createElement("hr"));
      main.append(WebImporter.Blocks.getMetadataBlock(document2, {
        Title: "Landing page template",
        Description: "Reusable SFU landing page structure.",
        template: "landing-page"
      }));
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      return [{ element: main, path: "/docs/library/templates/landing-page", report: { template: "landing-page" } }];
    }
  };
  return __toCommonJS(import_landing_template_exports);
})();

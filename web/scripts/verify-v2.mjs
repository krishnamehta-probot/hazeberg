/**
 * Measurement pass for /v2 — the comp rebuild. Numbers, not screenshots.
 *
 * Start a server first:  npx next build && npx next start -p 3125
 * Then:                  npm run qa:v2
 */
import { chromium } from "playwright";

const BASE = process.env.V2_BASE ?? "http://localhost:3125";
const log = (...a) => console.log(a.join(" "));
const mark = (ok) => (ok ? "PASS" : "FAIL");

/* WCAG relative luminance + contrast ratio, from sRGB. */
function lum([r, g, b]) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
const rgb = (s) => s.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
/** Composite a possibly-translucent colour over a known ground. */
function over(fg, bg) {
  const m = fg.match(/[\d.]+/g).map(Number);
  const a = m.length > 3 ? m[3] : 1;
  return [0, 1, 2].map((i) => Math.round(m[i] * a + bg[i] * (1 - a)));
}

const browser = await chromium.launch();
let failures = 0;
const fail = () => { failures++; };

/* ---- 1. horizontal overflow -------------------------------------------- */
log("\n== 1. horizontal overflow ==");
for (const [w, h] of [[390, 844], [768, 1024], [1280, 800], [1440, 900], [1600, 900]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    pageH: document.documentElement.scrollHeight,
  }));
  const ok = r.scrollW <= r.clientW;
  if (!ok) fail();
  log(`  ${w}x${h}: ${r.scrollW} vs ${r.clientW} -> ${mark(ok)}${ok ? "" : ` (+${r.scrollW - r.clientW}px)`} | page ${r.pageH}px`);
  await page.close();
}

/* ---- 2. assets: nothing 404s ------------------------------------------- */
log("\n== 2. assets ==");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const bad = [];
  const errors = [];
  page.on("response", (res) => {
    if (res.status() >= 400) bad.push(`${res.status()} ${new URL(res.url()).pathname}`);
  });
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
  /* Walk the page so every lazy image and every section actually loads. */
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  if (bad.length) fail();
  if (errors.length) fail();
  log(`  failed requests: ${bad.length ? bad.join(", ") : "none"} -> ${mark(!bad.length)}`);
  log(`  console errors:  ${errors.length ? errors.slice(0, 3).join(" | ") : "none"} -> ${mark(!errors.length)}`);
  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll("img")].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  );
  if (imgs.length) fail();
  log(`  images that did not decode: ${imgs.length ? imgs.join(", ") : "none"} -> ${mark(!imgs.length)}`);
  await page.close();
}

/* ---- 3. section inventory ---------------------------------------------- */
log("\n== 3. sections, in the comp's order ==");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
  const r = await page.evaluate(() => {
    const bands = [...document.querySelectorAll("body section, body footer")];
    return {
      count: bands.length,
      ids: bands.map((s) => s.id || s.tagName.toLowerCase()),
      headings: [...document.querySelectorAll("h1, h2")].map((h) => h.textContent.trim().slice(0, 44)),
      logos: document.querySelectorAll('img[src^="/clients-light/"]').length,
      services: document.querySelectorAll("#services li").length,
      impactCards: document.querySelectorAll("#impact ul li").length,
      aboutPoints: document.querySelectorAll("#about ul li").length,
      stats: document.querySelectorAll("#results article").length,
      cases: document.querySelectorAll("#work article").length,
      models: document.querySelectorAll("#engagement article, #engagement div > div").length,
      quotes: document.querySelectorAll("#testimonials article").length,
    };
  });
  log(`  bands: ${r.ids.join(" > ")}`);
  log(`  headings: ${r.headings.join(" | ")}`);
  const counts = [
    ["client marks (13 x2 tracks + 3 hero)", r.logos, 29],
    ["about points", r.aboutPoints, 4],
    ["impact cards", r.impactCards, 4],
    ["service cards", r.services, 7],
    ["capability cells", r.stats, 4],
    ["use cases", r.cases, 3],
    ["testimonials", r.quotes, 2],
  ];
  for (const [label, got, want] of counts) {
    const ok = got === want;
    if (!ok) fail();
    log(`  ${label.padEnd(36)} ${got} (expect ${want}) -> ${mark(ok)}`);
  }
  await page.close();
}

/* ---- 4. services gallery ----------------------------------------------- */
log("\n== 4. services gallery ==");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
  await page.locator("#services").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const cards = page.locator("#services ul > li");
  const n = await cards.count();

  /* The cards must NOT change size — that is the whole correction. Equal
     widths, equal heights, at rest and under the pointer. */
  const boxes = [];
  for (let i = 0; i < n; i++) {
    const b = await cards.nth(i).boundingBox();
    boxes.push([Math.round(b.width), Math.round(b.height)]);
  }
  const uniform = boxes.every(([w, h]) => w === boxes[0][0] && h === boxes[0][1]);
  if (!uniform) fail();
  log(`  ${n} cards, all ${boxes[0][0]}x${boxes[0][1]}px -> ${mark(uniform)}`);

  /* What moves is the panel inside the open card. */
  const panelH = (i) => page.evaluate(
    (idx) => Math.round(document.querySelectorAll("#services ul > li")[idx].querySelector(".v2-panel").getBoundingClientRect().height),
    i,
  );
  const openAtRest = await panelH(0);
  const closedAtRest = await panelH(1);
  await cards.nth(1).hover();
  await page.waitForTimeout(900);
  const nowOpen = await panelH(1);
  const nowClosed = await panelH(0);
  const afterBoxes = [];
  for (let i = 0; i < n; i++) {
    const b = await cards.nth(i).boundingBox();
    afterBoxes.push(Math.round(b.width));
  }
  const stillUniform = afterBoxes.every((w) => w === boxes[0][0]);
  const panelMoves = nowOpen > closedAtRest + 60 && nowClosed < openAtRest - 60;
  if (!stillUniform) fail();
  if (!panelMoves) fail();
  log(`  panel at rest: card 1 open ${openAtRest}px, card 2 collapsed ${closedAtRest}px`);
  log(`  after hovering card 2: card 2 ${nowOpen}px, card 1 ${nowClosed}px -> ${mark(panelMoves)}`);
  log(`  card widths unchanged by the hover: ${stillUniform ? boxes[0][0] + "px across the row" : afterBoxes.join("/")} -> ${mark(stillUniform)}`);

  /* Badges alternate amber, blue, amber, blue. */
  const badges = await page.evaluate(() =>
    [...document.querySelectorAll("#services ul > li")].map((li) => {
      const b = li.querySelector('span[aria-hidden][class*="rounded-full"]');
      return b ? (b.className.includes("v2-fill-amber") ? "amber" : "blue") : "?";
    }),
  );
  const alternates = badges.every((t, i) => t === (i % 2 === 0 ? "amber" : "blue"));
  if (!alternates) fail();
  log(`  badge tones: ${badges.join(", ")} -> ${mark(alternates)}`);

  const before = await page.evaluate(() => document.querySelector("#services ul").scrollLeft);
  await page.getByRole("button", { name: "Next services" }).click();
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => document.querySelector("#services ul").scrollLeft);
  const paged = after > before;
  if (!paged) fail();
  log(`  next control: scrollLeft ${Math.round(before)} -> ${Math.round(after)} -> ${mark(paged)}`);
  await page.close();
}

/* ---- 4b. the results strip is joined ----------------------------------- */
log("\n== 4b. results strip ==");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
  await page.locator("#results").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => {
    const cells = [...document.querySelectorAll("#results article")];
    const rects = cells.map((c) => c.getBoundingClientRect());
    const gaps = rects.slice(1).map((r, i) => Math.round((r.left - rects[i].right) * 10) / 10);
    const radii = cells.map((c) => getComputedStyle(c).borderRadius);
    const shadows = cells.map((c) => getComputedStyle(c).boxShadow);
    const fills = cells.map((c) => {
      const cs = getComputedStyle(c);
      return cs.backgroundImage !== "none" ? "gradient" : cs.backgroundColor;
    });
    return { gaps, radii: [...new Set(radii)], shadows: [...new Set(shadows)], fills, tops: rects.map((r) => Math.round(r.top)) };
  });
  const joined = r.gaps.every((g) => g <= 1.5);
  const noOwnRadius = r.radii.every((v) => v === "0px");
  const noOwnShadow = r.shadows.every((v) => v === "none");
  const sameRow = new Set(r.tops).size === 1;
  if (!joined || !noOwnRadius || !noOwnShadow || !sameRow) fail();
  log(`  gaps between cells: ${r.gaps.join(", ")}px (hairline only) -> ${mark(joined)}`);
  log(`  per-cell radius ${r.radii.join("/")} and shadow ${r.shadows.join("/")} -> ${mark(noOwnRadius && noOwnShadow)}`);
  log(`  fills: ${r.fills.map((f) => (f === "gradient" ? "gradient" : f)).join(" | ")}`);
  log(`  all four on one row -> ${mark(sameRow)}`);
  await page.close();
}

/* ---- 5. use cases open one at a time ----------------------------------- */
log("\n== 5. use cases ==");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const read = () => page.evaluate(() =>
    [...document.querySelectorAll("#work article button[aria-expanded]")].map((b) => b.getAttribute("aria-expanded")),
  );
  const initial = await read();
  await page.locator("#work article button[aria-expanded]").first().click();
  await page.waitForTimeout(700);
  const afterClick = await read();
  const oneOpen = (a) => a.filter((v) => v === "true").length === 1;
  const ok = oneOpen(initial) && oneOpen(afterClick) && initial[2] === "true" && afterClick[0] === "true";
  if (!ok) fail();
  log(`  initial open: [${initial.join(", ")}] (comp opens the third)`);
  log(`  after clicking the first: [${afterClick.join(", ")}] -> ${mark(ok)}`);

  /* The badge rotates to an X on the open card, so it has to actually close
     it. The first cut wired it to `setOpen(i)` — the index it was already on
     — and the control was inert. */
  await page.locator("#work article button[aria-expanded]").first().click();
  await page.waitForTimeout(700);
  const afterClose = await read();
  const closed = afterClose.every((v) => v === "false");
  if (!closed) fail();
  log(`  clicking the open card again: [${afterClose.join(", ")}] -> ${mark(closed)}`);

  /* No link out of the section: there is no case-study page to reach. */
  const deadLinks = await page.evaluate(() => {
    const work = document.querySelector("#work");
    return [...work.querySelectorAll("a")].map((a) => `${a.textContent.trim()} -> ${a.getAttribute("href")}`);
  });
  if (deadLinks.length) fail();
  log(`  links out of the section: ${deadLinks.length ? deadLinks.join(" | ") : "none"} -> ${mark(!deadLinks.length)}`);
  await page.close();
}

/* ---- 6. counters ------------------------------------------------------- */
log("\n== 6. counters ==");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
  /* The results band no longer counts anything — the client moved its four
     figures up into the heading. The page's one remaining counter is the
     years figure in the About band. */
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2800);
  const figs = await page.evaluate(() =>
    [...document.querySelectorAll(".v2-num")].map((n) => ({
      visible: n.querySelector("[aria-hidden]")?.textContent ?? "?",
      announced: n.querySelector(".sr-only")?.textContent ?? "?",
      suffix: n.lastChild?.textContent ?? "",
    })),
  );
  if (!figs.length) fail();
  log(`  ${figs.length} counter(s) on the page`);
  for (const f of figs) {
    const ok = f.visible === f.announced;
    if (!ok) fail();
    log(`  visible ${(f.visible + f.suffix).padEnd(6)} announced ${(f.announced + f.suffix).padEnd(6)} -> ${mark(ok)}`);
  }
  await page.close();
}

/* ---- 7. contrast ------------------------------------------------------- */
log("\n== 7. contrast (text against the ground it sits on) ==");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
  });
  await page.waitForTimeout(600);
  const samples = await page.evaluate(() => {
    const read = (sel, label, groundSel) => {
      const n = document.querySelector(sel);
      if (!n) return null;
      const cs = getComputedStyle(n);
      let ground = "rgb(255,255,255)";
      if (groundSel) {
        const g = document.querySelector(groundSel);
        if (g) ground = getComputedStyle(g).backgroundColor;
      }
      return { label, color: cs.color, size: cs.fontSize, weight: cs.fontWeight, ground };
    };
    return [
      read("h1", "hero h1"),
      read("main p.mt-6.max-w-\\[54ch\\]", "hero lead"),
      read("#about p.mx-auto", "about statement"),
      read("#impact h2", "impact h2"),
      read("#impact li span span.mt-2, #impact li .text-ink-muted", "impact card body"),
      read("#results h2", "results h2"),
      read("#results article h3", "capability title"),
      read("#work h3 button", "use case title"),
      read("#engagement h3", "model title", "#engagement"),
      read("#testimonials blockquote", "quote", "#testimonials"),
    ].filter(Boolean);
  });
  for (const s of samples) {
    const ground = rgb(s.ground.includes("rgba(0, 0, 0, 0)") ? "rgb(255,255,255)" : s.ground);
    const c = contrast(over(s.color, ground), ground);
    const px = parseFloat(s.size);
    const big = px >= 24 || (px >= 18.66 && Number(s.weight) >= 700);
    const bar = big ? 3 : 4.5;
    const ok = c >= bar;
    if (!ok) fail();
    log(`  ${s.label.padEnd(20)} ${s.color.padEnd(20)} ${s.size.padEnd(7)} -> ${c.toFixed(2)}:1 (needs ${bar}) ${mark(ok)}`);
  }

  /* The two filled cards and the dark footer, measured against their own
     grounds rather than the page's. */
  const fills = await page.evaluate(() => {
    const pick = (sel, childSel, label) => {
      const card = document.querySelector(sel);
      if (!card) return null;
      const child = card.querySelector(childSel) ?? card;
      return {
        label,
        fill: getComputedStyle(card).backgroundColor,
        color: getComputedStyle(child).color,
        size: getComputedStyle(child).fontSize,
      };
    };
    return [
      pick("#results .v2-fill-amber", "p.text-xs", "amber cell body"),
      pick("#results .v2-fill-blue", "p.text-xs", "blue cell body"),
      pick("#work .v2-fill-blue", "li span:last-child", "open case impact"),
      pick("#engagement .v2-fill-amber", "p.mt-4", "amber model body"),
      pick("footer", "p.text-xs", "footer legal"),
      pick("footer", ".text-accent", "footer accent line"),
    ].filter(Boolean);
  });
  /*
    The filled cells are GRADIENTS, so `background-color` is only their
    fallback and measuring against it understates the risk — the type has to
    clear the bar at the gradient's worst stop, not at its base colour. These
    are those stops, composited the way the CSS composites them:

      amber  #F1B403  the darkest stop of `linear-gradient(135deg, #ffd34d,
                      #fec00f, #f1b403)`. Worst for the near-black type on it
      blue   #008EFF  the lightest stop, under the 20% black veil the class
                      applies -> rgb(0, 114, 204). Worst for white type

    If either gradient is retuned, these two constants move with it.
  */
  const WORST_STOP = {
    amber: [241, 180, 3],
    blue: over("rgba(0,142,255,0.8)", [0, 0, 0]),
  };
  for (const f of fills) {
    const base = rgb(f.fill);
    /* Amber base is #FEC00F, blue base is #1972B9 — that is how each cell is
       identified without re-reading the class list. */
    const tone = base[0] > 200 ? "amber" : base[2] > base[0] + 40 ? "blue" : null;
    const ground = tone ? WORST_STOP[tone] : base;
    const c = contrast(over(f.color, ground), ground);
    const bar = parseFloat(f.size) >= 24 ? 3 : 4.5;
    const ok = c >= bar;
    if (!ok) fail();
    const where = tone ? `${tone} gradient worst stop rgb(${ground.join(",")})` : f.fill;
    log(`  ${f.label.padEnd(20)} on ${where.padEnd(42)} ${f.size.padEnd(7)} -> ${c.toFixed(2)}:1 (needs ${bar}) ${mark(ok)}`);
  }

  /* The closing band: white type over a scrim over a photograph. Measured
     against the scrim's own colour composited on black, which is the
     lightest ground the type can land on. */
  const closing = await page.evaluate(() => {
    const h = [...document.querySelectorAll("h2")].find((n) => n.closest("section")?.querySelector("img[sizes='100vw']"));
    if (!h) return null;
    return { color: getComputedStyle(h).color, size: getComputedStyle(h).fontSize };
  });
  if (closing) {
    /* rgb(10 14 18 / 0.68) over the brightest plausible photograph pixel. */
    const worstGround = over("rgba(10,14,18,0.68)", [255, 255, 255]);
    const c = contrast(rgb(closing.color), worstGround);
    const ok = c >= 3;
    if (!ok) fail();
    log(`  closing h2 (worst-case white photo under the scrim) -> ${c.toFixed(2)}:1 (needs 3) ${mark(ok)}`);
  }
  await page.close();
}

/* ---- 8. site chrome gate ----------------------------------------------- */
log("\n== 8. site chrome ==");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const route of ["/v2", "/"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const r = await page.evaluate(() => ({
      headers: document.querySelectorAll("header").length,
      footers: document.querySelectorAll("footer").length,
      v2Drawer: !!document.querySelector('[aria-controls="v2-drawer"]'),
      v1Spec: document.querySelectorAll("[data-spec]").length,
    }));
    const ok = r.headers === 1 && r.footers === 1 && (route === "/v2" ? r.v2Drawer : !r.v2Drawer);
    if (!ok) fail();
    log(`  ${route.padEnd(4)} header ${r.headers}, footer ${r.footers}, v2 control ${r.v2Drawer}, v1 buttons ${r.v1Spec} -> ${mark(ok)}`);
  }
  await page.close();
}

/* ---- 9. footer facts --------------------------------------------------- */
log("\n== 9. footer ==");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
  const r = await page.evaluate(() => {
    const f = document.querySelector("footer");
    return {
      text: f.textContent.replace(/\s+/g, " "),
      tel: f.querySelector('a[href^="tel:"]')?.getAttribute("href"),
      mail: f.querySelector('a[href^="mailto:"]')?.getAttribute("href"),
      links: f.querySelectorAll("nav a").length,
    };
  });
  const has = (s) => r.text.includes(s);
  const ok = has("Coimbatore") && has("Penang") && r.tel === "tel:+919750533701" && r.mail === "mailto:connect@hazebergconsulting.com";
  if (!ok) fail();
  log(`  offices: Coimbatore ${has("Coimbatore")}, Penang ${has("Penang")}`);
  log(`  ${r.tel} / ${r.mail} -> ${mark(ok)}`);
  log(`  ${r.links} footer nav links`);
  await page.close();
}

/* ---- 10. reduced motion ------------------------------------------------ */
log("\n== 10. prefers-reduced-motion ==");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const r = await page.evaluate(() => {
    const invisible = [...document.querySelectorAll("h1, h2, h3, p")].filter((n) => {
      const cs = getComputedStyle(n);
      return Number(cs.opacity) < 0.5 && n.textContent.trim().length > 12 && cs.display !== "none";
    }).length;
    const marquee = document.querySelector(".v2-marquee");
    return {
      invisible,
      pageH: document.documentElement.scrollHeight,
      marqueeDuration: marquee ? getComputedStyle(marquee).animationDuration : "n/a",
      h1: getComputedStyle(document.querySelector("h1")).opacity,
    };
  });
  const ok = r.invisible === 0;
  if (!ok) fail();
  log(`  text nodes stuck under 50% opacity: ${r.invisible} -> ${mark(ok)}`);
  log(`  h1 opacity ${r.h1}, marquee animation-duration ${r.marqueeDuration}, page ${r.pageH}px`);
  await page.close();
}

/* ---- 11. alignment and consistency ------------------------------------- */
log("\n== 11. alignment and consistency ==");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
  /* Walk the page so every reveal has fired, then settle — a grid measured
     mid-animation reports its rows at different tops and looks broken when
     it is not. */
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1400);

  const bands = await page.evaluate(() => {
    const round = (n) => Math.round(n * 10) / 10;
    return [...document.querySelectorAll("body section, body footer")].map((b) => {
      const shell = b.querySelector(".v2-shell") ?? b;
      const cs = getComputedStyle(shell);
      const rect = shell.getBoundingClientRect();
      const h = b.querySelector("h2");
      return {
        id: b.id || b.tagName.toLowerCase(),
        left: round(rect.left + parseFloat(cs.paddingLeft)),
        right: round(rect.right - parseFloat(cs.paddingRight)),
        padTop: Math.round(parseFloat(cs.paddingTop)),
        padBottom: Math.round(parseFloat(cs.paddingBottom)),
        h2: h ? getComputedStyle(h).fontSize : null,
        fullBleed: b.querySelector(".v2-shell") === null,
      };
    });
  });

  /* Every band that has a shell must share one content column. */
  const shelled = bands.filter((b) => !b.fullBleed);
  const lefts = [...new Set(shelled.map((b) => b.left))];
  const rights = [...new Set(shelled.map((b) => b.right))];
  const aligned = lefts.length === 1 && rights.length === 1;
  if (!aligned) fail();
  log(`  content column: left ${lefts.join("/")}, right ${rights.join("/")} across ${shelled.length} bands -> ${mark(aligned)}`);

  /* One size for one job. */
  const sizes = [...new Set(bands.map((b) => b.h2).filter(Boolean))];
  const oneSize = sizes.length === 1;
  if (!oneSize) fail();
  log(`  section heading size: ${sizes.join(", ")} -> ${mark(oneSize)}`);

  /* One vertical rhythm. The services band splits its padding across two
     shells on purpose — the rail between them is full-bleed — so it is
     checked as a pair rather than exempted. */
  const rhythm = bands.filter((b) => !b.fullBleed && b.id !== "footer");
  const pads = rhythm.map((b) => `${b.id || "band"} ${b.padTop}/${b.padBottom}`);
  /* Two bands are legitimately asymmetric and both are named rather than
     waved through: the HERO pads its top by an extra nav height because the
     header is fixed over it, and SERVICES splits its padding across two
     shells because the rail between them is full-bleed. Every other band
     must be symmetric, and all of them must use the same value. */
  const base = rhythm.find((b) => b.id === "about")?.padTop;
  const offenders = rhythm.filter((b, i) => {
    if (b.id === "services") return b.padTop !== base;
    if (i === 0) return b.padBottom !== base || b.padTop <= base; // hero
    return b.padTop !== base || b.padBottom !== base;
  });
  const sym = offenders.length === 0;
  if (!sym) fail();
  log(`  vertical padding: ${pads.join(", ")}`);
  log(`  base ${base}px; hero clears the fixed header, services splits across two shells -> ${mark(sym)}`);

  /* No grid may leave an orphan row: every row must be full. */
  const grids = await page.evaluate(() => {
    /* Each target names a CHILD of the grid and the grid is its parent —
       uniform, so no entry can accidentally measure a wrapper instead. */
    const targets = [
      ["about points", "#about ul > li"],
      ["impact cards", "#impact ul > li"],
      ["capability cells", "#results article"],
      ["use cases", "#work article"],
      ["models", "#engagement article"],
    ];
    return targets.map(([name, sel]) => {
      const first = document.querySelector(sel);
      if (!first || !first.parentElement) return { name, error: "not found" };
      const kids = [...first.parentElement.children];
      const tops = [...new Set(kids.map((k) => Math.round(k.getBoundingClientRect().top)))];
      const perRow = kids.length / tops.length;
      const lefts = [...new Set(kids.map((k) => Math.round(k.getBoundingClientRect().left)))].sort((a, b) => a - b);
      /* Even column spacing: every gap between adjacent left edges equal. */
      const steps = lefts.slice(1).map((l, i) => l - lefts[i]);
      const evenSpread = steps.length < 2 || Math.max(...steps) - Math.min(...steps) <= 2;
      return { name, items: kids.length, rows: tops.length, perRow, evenSpread, lefts };
    });
  });
  for (const g of grids) {
    if (g.error) { fail(); log(`  ${g.name.padEnd(18)} ${g.error} -> FAIL`); continue; }
    const full = Number.isInteger(g.perRow);
    const ok = full && g.evenSpread;
    if (!ok) fail();
    log(`  ${g.name.padEnd(18)} ${g.items} items in ${g.rows} row(s), ${g.perRow} per row, column edges ${g.lefts.join("/")} -> ${mark(ok)}`);
  }
  await page.close();
}

await browser.close();
log(`\n--- ${failures ? `${failures} FAILURE(S)` : "all checks passed"} ---`);
process.exit(failures ? 1 : 0);

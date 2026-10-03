import { ArrowUpRight } from "lucide-react";

import { QR_CODES, type QrCode } from "@/components/berg/qr-codes";
import { BERG } from "@/lib/berg-content";

/**
 * The mobile block's three ways in: Google Play, the App Store and the web app.
 *
 * The owner's change list of 2026-10-03 asked for the two stores' QR codes and
 * "a web application link too". It replaces the document's one button, "Berg
 * on mobile — download now", which pointed at the web app: a download button
 * that downloads nothing.
 *
 * **One link per store, two skins, switched on the INPUT, not the width.** A
 * QR code is for a phone looking at a computer's screen. On a phone it is a
 * picture of a link you cannot follow, since a phone cannot scan its own
 * screen, and the same is true of a tablet at any width. So the codes show
 * only where the primary pointer is fine (a mouse or a trackpad) AND the
 * window is at least `md`: every `pointer-fine:md:` class below. Everywhere
 * else, which is every touch screen of any size and a narrow desktop window,
 * the same anchor that sits under each code is skinned as a 56px store button
 * instead. Both states are in the markup and a media query picks one, so the
 * server's HTML is the first client render on any device and there is no JS
 * device sniffing to get wrong. One anchor rather than a hidden copy for each
 * state, so there is exactly one link per store in the accessibility tree; the
 * hidden tile is `display: none`, so its image leaves the tree with it.
 *
 * **Dark on a white tile, always.** The section is navy, and the obvious move,
 * white modules straight on the navy, is the one that breaks: an inverted code
 * is light-on-dark, and many scanners, older Android camera apps among them,
 * will not read it at all. So each code sits on its own `--canvas` tile with
 * `--ink` modules, a 4-module quiet zone inside the drawing and the tile's 8px
 * around that. `forced-color-adjust: none` on the tile because Windows'
 * high-contrast themes would otherwise repaint it as their own background and
 * the path as their own text, which is an inverted code again.
 *
 * Sized to be scanned off a laptop at arm's length, and to land on whole
 * pixels: both codes are version 5, 45 modules with the quiet zone, so a 180px
 * drawing is exactly 4px a module at 1x (6px at 1.5x, 8px at 2x) and the code
 * itself, quiet zone excluded, is 148px. Path data and how it was made:
 * `qr-codes.ts`.
 *
 * Each code is `role="img"` with its own name, and is NOT the link: the link is
 * the visible text beside it, to the same address, so the code is described
 * once and the destination is announced once. With the codes showing, the
 * link's hit area is stretched over the whole column with a pseudo-element, so
 * clicking the code opens the store too, which is what people try first.
 *
 * The web app is a quiet text link rather than the white pill: the owner's
 * list ranks it third ("can be added too"), and two white QR tiles are already
 * the brightest things on this ground. Mono caps, the arrow leaving on hover,
 * the same as the secondary link on About's close.
 *
 * Every link opens a new tab, since the stores and the app are other
 * applications, with `rel="noopener noreferrer"` spelled out in full. The rest
 * of the site writes `noreferrer` alone, which implies `noopener` in every
 * current browser; the pair costs nothing and does not lean on that.
 * Server-rendered; nothing here moves except the hover, and Tailwind's
 * `hover:` only applies where the device can hover, so a tap leaves no stuck
 * hover state behind.
 */
export function AppDownload() {
  const { app } = BERG;
  return (
    <div>
      <p className="hidden font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase pointer-fine:md:block">
        {app.scanLabel}
      </p>

      <ul className="grid max-w-[22rem] gap-3 pointer-fine:md:mt-5 pointer-fine:md:flex pointer-fine:md:max-w-none pointer-fine:md:flex-wrap pointer-fine:md:gap-x-10 pointer-fine:md:gap-y-8">
        {app.stores.map((store) => {
          const code = QR_CODES[store.key];
          return (
            <li key={store.key} className="group/s relative">
              <div className="hidden w-fit rounded-lg bg-canvas p-2 text-ink shadow-xl shadow-void/40 transition-transform dur-base ease-brand forced-color-adjust-none group-hover/s:-translate-y-1 pointer-fine:md:block">
                <QrMark code={code} label={store.qrLabel} />
              </div>
              {/* A store button by default: a pill, the platform over the
                  store's own wording and a disc with the arrow, like the badges
                  people already know. Its edge is a border, not a ring: a ring
                  is a box-shadow, which forced colours drop, and the button
                  would become bare text. With the codes showing: the same two
                  lines as a caption under the code, the arrow inline, and the
                  hit area stretched over the column. */}
              <a
                href={code.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center gap-4 rounded-pill border border-white/15 bg-white/[0.06] py-2 pr-2.5 pl-6 transition-colors dur-base ease-brand hover:border-white/30 hover:bg-white/10 pointer-fine:md:mt-4 pointer-fine:md:min-h-11 pointer-fine:md:rounded-xs pointer-fine:md:border-0 pointer-fine:md:bg-transparent pointer-fine:md:p-0 pointer-fine:md:after:absolute pointer-fine:md:after:inset-0 pointer-fine:md:hover:bg-transparent"
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-xs text-on-panel/60">{store.platform}</span>{" "}
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-on-panel">
                    {store.label}
                    <ArrowUpRight
                      aria-hidden
                      className="hidden size-3.5 shrink-0 text-on-panel/60 transition dur-base ease-brand group-hover/s:translate-x-0.5 group-hover/s:-translate-y-0.5 group-hover/s:text-on-panel pointer-fine:md:block"
                      strokeWidth={2}
                    />
                  </span>
                </span>
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-pill bg-white/10 text-on-panel transition-colors dur-base ease-brand group-hover/s:bg-primary pointer-fine:md:hidden"
                >
                  <ArrowUpRight className="size-4" strokeWidth={2} />
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <a
        href={app.web.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group/w mt-5 inline-flex min-h-11 items-center gap-2.5 font-mono text-xs tracking-caps text-on-panel/80 uppercase transition-colors dur-base ease-brand hover:text-on-panel pointer-fine:md:mt-7"
      >
        {app.web.label}
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform dur-base ease-brand group-hover/w:translate-x-0.5 group-hover/w:-translate-y-0.5"
          strokeWidth={2}
        />
      </a>
    </div>
  );
}

/**
 * One code: every dark module in a single path, in module units, filled with
 * the tile's `--ink`. `crispEdges` because at any zoom or pixel ratio that is
 * not a whole multiple the modules land on fractional pixels, and antialiasing
 * would open a faint light seam between every pair of stacked rows: each row
 * is its own rectangle, and two half-covered pixels do not add up to one
 * covered one.
 */
function QrMark({ code, label }: { code: QrCode; label: string }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${code.size} ${code.size}`}
      shapeRendering="crispEdges"
      className="block size-45"
    >
      <path d={code.path} fill="currentColor" />
    </svg>
  );
}

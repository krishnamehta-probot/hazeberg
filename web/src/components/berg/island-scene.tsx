"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, Briefcase, Building2, UserRound } from "lucide-react";

import { BERG } from "@/lib/berg-content";

/**
 * Berg's network, as a lit isometric world.
 *
 * Built to the reference the client sent — chunky isometric islands on a grid,
 * wired to a glowing centre, each one labelled by a pill with a coloured badge —
 * and inverted to a LIGHT ground on their instruction.
 *
 * The five versions before this are worth recording, because each failed for a
 * different reason and together they are the spec for this one:
 *
 *   1. the home page's horizon arc — a product opening like a service page
 *   2. an animated node-and-wire network — the most over-used shape in software
 *      marketing, and specific to nothing
 *   3. a white card of feed rows on a white page — no focal point, so nothing to
 *      look at first; it read as documentation
 *   4. the same card in dark — better lit, still a list. A list of jobs does not
 *      explain what a marketplace is
 *   5. an exploded technical drawing — structurally right and visually thin.
 *      Four grey rhombuses 11px deep are not objects, they are diamonds, and
 *      half of them were faded to 55%. The lesson from it is in the geometry
 *      below: **thickness is what makes an isometric shape read as a solid.**
 *      These blocks are 30 units deep against 29 of half-height, so each one is
 *      a cube you could pick up.
 *
 * What it says: Berg is one platform with three groups on it. So there is one
 * lit platform in the middle and three islands around it, wired in. That is the
 * client's own strapline — "One platform. Three groups." — as a place rather
 * than as a sentence.
 *
 * **Colour is the point and it is the one deliberate departure from the palette.**
 * The site runs blue, amber and neutrals. Three islands that are three shades of
 * the same blue are three of the same thing, which is the opposite of what this
 * picture has to say. So the three groups get three genuinely different hues —
 * and two of the four are still the brand's: amber is Consultants, brand blue is
 * the Berg core. Teal and violet are the two that are new, and they are the two
 * that carry no other meaning anywhere on this site, so nothing they say can be
 * confused with something else.
 *
 * **Every word is flat HTML.** The scene is SVG and carries no type at all — the
 * label pills, the copy strip and the foot sit over it as ordinary DOM. Type
 * inside a tilted plane is unreadable and, just as importantly, unmeasurable: a
 * contrast check cannot sample a glyph that is being perspective-projected. The
 * picture tilts; the words never do.
 *
 * SVG and CSS, not WebGL or a 3D file. There is nothing to simulate — polygons,
 * three wires and a sphere. A Spline scene would be half a megabyte to draw what
 * the browser draws for nothing.
 *
 * `prefers-reduced-motion` keeps the world and the selection, and drops the
 * arrival, the tilt and the travelling light.
 *
 * Every word is the client's: the three groups' lines are `roles.items`'
 * `headline` and `teaser` — the collapsed-card copy from their document, which
 * lost its home when the audience cards became a scroll deck. The centre's line
 * is `platform.title` and `platform.body`. The four micro-facts come from
 * `platform.items[1].body`, where they name each group's access model in their
 * own sentence, and from the strapline.
 */

/* --------------------------------------------------------------------------
   Geometry
   --------------------------------------------------------------------------
   One isometric block = a rhombus top face and two side faces. 2:1 half-width
   to half-height is what reads as isometric rather than as a squashed diamond,
   and the side faces get their own two shades so the block is lit from one side
   like a real object instead of being flat-filled.
   -------------------------------------------------------------------------- */

/* 560x340 — WIDE, not square. The first version was 460x470, which in a 480px
   column rendered 490px tall and put the hero at 1095px: a screen and a half on
   a 1366x768 laptop. The picture is the same picture; it is laid out across the
   frame instead of down it, and the panel lost 199px for nothing. */
const VB = { w: 560, h: 340 };

type Vec = { cx: number; cy: number; w: number; h: number; t: number };

type Tint = { top: string; left: string; right: string; dot: string };

function Block({ v, c, opacity = 1 }: { v: Vec; c: Tint; opacity?: number }) {
  const { cx, cy, w, h, t } = v;
  return (
    <g opacity={opacity}>
      {/* left face is the shaded one — light comes from the upper right, the
          same direction every other surface on this site is lit from */}
      <polygon
        points={`${cx - w},${cy} ${cx},${cy + h} ${cx},${cy + h + t} ${cx - w},${cy + t}`}
        fill={c.left}
      />
      <polygon
        points={`${cx + w},${cy} ${cx},${cy + h} ${cx},${cy + h + t} ${cx + w},${cy + t}`}
        fill={c.right}
      />
      <polygon
        points={`${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`}
        fill={c.top}
      />
    </g>
  );
}

/** The soft contact shadow that puts a block ON the ground rather than over it. */
function Shade({ cx, cy, rx, id }: { cx: number; cy: number; rx: number; id: string }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.42} fill={`url(#${id})`} />;
}

const TINTS: Record<string, Tint> = {
  customers: { top: "#32D3C6", left: "#0B807B", right: "#13A89E", dot: "#0E8F8A" },
  firms: { top: "#9384F9", left: "#4A32BE", right: "#6549DA", dot: "#5B41CF" },
  consultants: { top: "#FFD452", left: "#B98A00", right: "#E0A800", dot: "#8A6700" },
  berg: { top: "#FFFFFF", left: "#C2D4E6", right: "#DEEAF4", dot: "#1972b9" },
};

const ISLANDS = [
  {
    key: "customers",
    label: "Customers",
    icon: Building2,
    base: { cx: 96, cy: 118, w: 56, h: 28, t: 28 } as Vec,
    /** The thing standing on the island — a stack of two slabs, which is what a
        customer puts into Berg: requirements. */
    top: [
      { cx: 96, cy: 101, w: 25, h: 12, t: 7 },
      { cx: 96, cy: 86, w: 19, h: 9, t: 6 },
    ] as Vec[],
    headline: BERG.roles.items[0].headline,
    teaser: BERG.roles.items[0].teaser,
    /** [live] `platform.items[1].body`: "Customers can post requirements free." */
    fact: "Post a requirement — free",
    /** [live] Berg's own published example, verbatim from their marketing site. */
    chips: ["Workday Functional Consultant (HCM/Finance)", "Urgent"],
  },
  {
    key: "firms",
    label: "Consulting Firms",
    icon: Briefcase,
    base: { cx: 462, cy: 132, w: 56, h: 28, t: 28 } as Vec,
    /** A tower — a firm is the tall thing in this picture. */
    top: [{ cx: 462, cy: 104, w: 21, h: 10, t: 38 }] as Vec[],
    headline: BERG.roles.items[1].headline,
    teaser: BERG.roles.items[1].teaser,
    /** [live] "…gain access to broader opportunities through flexible
        subscription options." */
    fact: "Flexible subscription access",
    chips: ["Requirements from customers worldwide"],
  },
  {
    key: "consultants",
    label: "Consultants",
    icon: UserRound,
    base: { cx: 150, cy: 282, w: 56, h: 28, t: 28 } as Vec,
    /** A profile card, standing up. */
    top: [{ cx: 150, cy: 264, w: 23, h: 11, t: 21 }] as Vec[],
    headline: BERG.roles.items[2].headline,
    teaser: BERG.roles.items[2].teaser,
    /** [live] "Consultants can showcase their expertise free." */
    fact: "Showcase your expertise — free",
    chips: ["Skills", "Certifications", "Experience"],
  },
] as const;

/** The centre. White platform, brand-blue core — the one thing everything is
    wired to, and the only thing that is never dimmed. */
const CORE: Vec = { cx: 286, cy: 200, w: 102, h: 51, t: 16 };

const BERG_PART = {
  key: "berg",
  label: "Berg",
  /** [live] `platform.title` and `platform.body`. */
  headline: BERG.platform.title,
  teaser: BERG.platform.body,
  /** [live] The strapline. */
  fact: BERG.strapline,
  chips: [] as readonly string[],
};

/** Island edge -> core edge. Drawn under everything, with a node at each end,
    the way the reference draws its wires. */
const WIRES = [
  { key: "customers", from: [96, 146], mid: [150, 172], to: [202, 196] },
  { key: "firms", from: [462, 160], mid: [410, 182], to: [366, 190] },
  { key: "consultants", from: [150, 254], mid: [200, 232], to: [240, 214] },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const SWAP = { duration: 0.4, ease: EASE };
const TILT = { stiffness: 140, damping: 22, mass: 0.6 } as const;

const ALL = [...ISLANDS, BERG_PART];

export function IslandScene() {
  const [key, setKey] = useState<string>("berg");
  const reduce = useReducedMotion();
  const uid = useId();
  const box = useRef<HTMLDivElement>(null);

  const active = ALL.find((l) => l.key === key) ?? BERG_PART;

  /* -- the tilt ------------------------------------------------------- */
  /* Pointer position over the panel, normalised to -0.5..0.5, sprung, then
     mapped to a few degrees. Small on purpose — this is parallax, not a toy,
     and it is what makes the world read as sitting IN the page rather than as
     a picture printed on it. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, TILT);
  const sy = useSpring(py, TILT);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={box}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="overflow-hidden rounded-2xl bg-canvas shadow-2xl shadow-ink/10 ring-1 ring-border"
    >
      {/* -- header ------------------------------------------------------ */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <p className="text-sm font-medium text-ink">Berg</p>
        <p className="font-mono text-[0.625rem] tracking-caps text-ink-subtle uppercase">
          The network
        </p>
      </div>

      {/* -- the world --------------------------------------------------- */}
      <div className="relative bg-surface">
        <motion.div
          style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
          className="[transform-style:preserve-3d]"
        >
          <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            data-scene="berg-islands"
            className="h-auto w-full"
            aria-hidden
          >
            <defs>
              <pattern
                id={`${uid}-grid`}
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 28 0 L 0 0 0 28"
                  fill="none"
                  stroke="rgb(20 24 26 / 0.07)"
                  strokeWidth="1"
                />
              </pattern>
              <radialGradient id={`${uid}-fade`}>
                <stop offset="45%" stopColor="#fff" stopOpacity="1" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <mask id={`${uid}-mask`}>
                <rect width={VB.w} height={VB.h} fill={`url(#${uid}-fade)`} />
              </mask>
              <radialGradient id={`${uid}-shade`}>
                <stop offset="0%" stopColor="rgb(11 30 48 / 0.22)" />
                <stop offset="100%" stopColor="rgb(11 30 48 / 0)" />
              </radialGradient>
              <radialGradient id={`${uid}-core`} cx="0.35" cy="0.3">
                <stop offset="0%" stopColor="#6FC5FF" />
                <stop offset="60%" stopColor="#1B86E0" />
                <stop offset="100%" stopColor="#0B4C86" />
              </radialGradient>
              <radialGradient id={`${uid}-halo`}>
                <stop offset="0%" stopColor="rgb(0 142 255 / 0.4)" />
                <stop offset="100%" stopColor="rgb(0 142 255 / 0)" />
              </radialGradient>
            </defs>

            {/* the ground */}
            <rect
              width={VB.w}
              height={VB.h}
              fill={`url(#${uid}-grid)`}
              mask={`url(#${uid}-mask)`}
            />

            {/* the wires, under everything */}
            {WIRES.map((wire) => {
              const on = key === wire.key || key === "berg";
              const tint = TINTS[wire.key];
              return (
                <g key={wire.key}>
                  <polyline
                    points={`${wire.from.join(",")} ${wire.mid.join(",")} ${wire.to.join(",")}`}
                    fill="none"
                    stroke={on ? tint.dot : "rgb(20 24 26 / 0.18)"}
                    strokeWidth={on ? 1.75 : 1.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={on ? 0.85 : 0.5}
                  />
                  <circle cx={wire.mid[0]} cy={wire.mid[1]} r="3.5" fill="#fff" stroke={tint.dot} strokeWidth="1.25" />
                  <circle cx={wire.from[0]} cy={wire.from[1]} r="3" fill={tint.dot} />
                  {/* The light that runs the wire into the centre — the product's
                      verb, once every five seconds, and only on the wire you are
                      looking at. */}
                  {reduce || !on ? null : (
                    <motion.circle
                      /* cx/cy must be in `initial`, not only in `animate`.
                         Motion builds the first frame from `initial`; with only
                         `opacity` there it wrote `cx="undefined"` and the browser
                         logged `<circle> attribute cx: Expected length` on every
                         load. Passing them as plain attributes does not help —
                         Motion owns the attribute once it is animating it. */
                      r="3.5"
                      fill={tint.dot}
                      initial={{ opacity: 0, cx: wire.from[0], cy: wire.from[1] }}
                      animate={{
                        cx: [wire.from[0], wire.mid[0], wire.to[0]],
                        cy: [wire.from[1], wire.mid[1], wire.to[1]],
                        opacity: [0, 1, 0],
                      }}
                      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                    />
                  )}
                </g>
              );
            })}

            {/* the centre — never dimmed, it is the platform everything is on */}
            <motion.g
              initial={reduce ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              onClick={() => setKey("berg")}
              className="cursor-pointer"
            >
              <Shade cx={CORE.cx} cy={CORE.cy + CORE.h + CORE.t + 6} rx={112} id={`${uid}-shade`} />
              <Block v={CORE} c={TINTS.berg} />
              <ellipse
                cx={CORE.cx}
                cy={CORE.cy}
                rx={50}
                ry={25}
                fill="none"
                stroke={key === "berg" ? "#1972b9" : "rgb(25 114 185 / 0.4)"}
                strokeWidth="2"
              />
              <circle cx={CORE.cx} cy={CORE.cy - 28} r="46" fill={`url(#${uid}-halo)`} />
              <motion.g
                animate={reduce ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <circle cx={CORE.cx} cy={CORE.cy - 28} r="24" fill={`url(#${uid}-core)`} />
                <ellipse cx={CORE.cx - 9} cy={CORE.cy - 37} rx="7.5" ry="5" fill="#fff" opacity="0.45" />
              </motion.g>
            </motion.g>

            {/* the three islands */}
            {ISLANDS.map((island, i) => {
              const on = key === island.key;
              const dim = key !== "berg" && !on;
              const c = TINTS[island.key];
              return (
                <motion.g
                  key={island.key}
                  initial={reduce ? false : { opacity: 0, y: 34 }}
                  animate={{ opacity: dim ? 0.42 : 1, y: 0 }}
                  transition={{ duration: 0.9, delay: reduce ? 0 : 0.12 + i * 0.1, ease: EASE }}
                  onClick={() => setKey(island.key)}
                  className="cursor-pointer"
                >
                  <Shade
                    cx={island.base.cx}
                    cy={island.base.cy + island.base.h + island.base.t + 4}
                    rx={64}
                    id={`${uid}-shade`}
                  />
                  <motion.g
                    animate={{ y: on ? -9 : 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <Block v={island.base} c={c} />
                    {island.top.map((t) => (
                      <Block
                        key={`${t.cx}-${t.cy}`}
                        v={t}
                        c={{ ...c, top: "#ffffff", right: c.top }}
                      />
                    ))}
                  </motion.g>
                </motion.g>
              );
            })}
          </svg>
        </motion.div>

        {/* -- the labels, flat and crisp ------------------------------- */}
        <div role="group" aria-labelledby={`${uid}-parts`} className="absolute inset-0">
          <p id={`${uid}-parts`} className="sr-only">
            Who is on the Berg network
          </p>
          {ISLANDS.map((island) => {
            const on = key === island.key;
            const Icon = island.icon;
            return (
              <button
                key={island.key}
                type="button"
                aria-pressed={on}
                onClick={() => setKey(island.key)}
                style={{
                  left: `${(island.base.cx / VB.w) * 100}%`,
                  top: `${((island.base.cy - island.base.h) / VB.h) * 100}%`,
                }}
                className={`absolute flex min-h-9 -translate-x-1/2 -translate-y-[150%] cursor-pointer items-center gap-1.5 rounded-pill bg-canvas py-1 pr-3 pl-1.5 whitespace-nowrap shadow-lg transition dur-base ease-brand sm:gap-2 sm:pr-3.5 ${
                  on ? "shadow-ink/15 ring-1 ring-ink/15" : "shadow-ink/10 ring-1 ring-border hover:ring-border-strong"
                }`}
              >
                <span
                  aria-hidden
                  className="grid size-5 shrink-0 place-items-center rounded-pill text-white sm:size-6"
                  style={{ backgroundColor: TINTS[island.key].dot }}
                >
                  <Icon className="size-3 sm:size-3.5" strokeWidth={2.2} />
                </span>
                <span
                  className={`text-[0.6875rem] font-medium sm:text-xs ${on ? "text-ink" : "text-ink-muted"}`}
                >
                  {island.label}
                </span>
              </button>
            );
          })}

          {/* The centre gets its own control, under the platform. */}
          <button
            type="button"
            aria-pressed={key === "berg"}
            onClick={() => setKey("berg")}
            /* Anchored to the foot of the scene rather than computed off the
               plate. The plate moves when the composition is retuned; the
               bottom edge does not. */
            className={`absolute bottom-3 left-1/2 flex min-h-9 -translate-x-1/2 cursor-pointer items-center gap-2 rounded-pill py-1.5 pr-3.5 pl-1.5 whitespace-nowrap shadow-lg transition dur-base ease-brand ${
              key === "berg"
                ? "bg-ink text-on-panel shadow-ink/20"
                : "bg-canvas shadow-ink/10 ring-1 ring-border hover:ring-border-strong"
            }`}
          >
            <span aria-hidden className="grad-primary size-5 shrink-0 rounded-pill" />
            <span className={`text-xs font-medium ${key === "berg" ? "" : "text-ink-muted"}`}>
              Berg
            </span>
          </button>
        </div>
      </div>

      {/* -- the selected part's own words ------------------------------- */}
      {/* `min-h` holds the height across all four, so picking an island never
          moves the hero under the reader's cursor. Sized against the longest —
          the customers part carries the real requirement example, which wraps
          to two chip rows. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.key}
          initial={reduce ? false : { opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? undefined : { opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={SWAP}
          /* py-3, not py-4. The tallest of the four — the customers part, which
              carries the real requirement example — came to 168px against a
              160px floor, so picking an island moved the hero by 7px. Eight
              pixels of padding was the cheapest place to take it back. */
          className="min-h-[10rem] border-t border-border px-5 py-3"
        >
          {/* Blue, not amber. Amber measures 1.65:1 on white and is a fill only
              on this ground — the chips below are the one place it carries a
              word, at 10.8:1. */}
          <p className="font-mono text-[0.625rem] tracking-caps text-primary uppercase">
            {active.fact}
          </p>
          <p className="mt-3 text-base leading-snug font-medium text-balance text-ink">
            {active.headline}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">{active.teaser}</p>
          {active.chips.length ? (
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {active.chips.map((chip) => (
                <span
                  key={chip}
                  className={`rounded-pill px-2.5 py-1 text-[0.6875rem] font-medium ${
                    chip === "Urgent" ? "bg-accent text-accent-ink" : "bg-surface-2 text-ink-muted"
                  }`}
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
        <p className="text-xs text-ink-subtle">Illustrative view of the Berg network.</p>
        <Link
          href="#how"
          className="group/h inline-flex items-center gap-1.5 text-xs font-medium text-primary"
        >
          See how Berg works
          <ArrowRight
            aria-hidden
            className="size-3.5 transition-transform dur-base ease-brand group-hover/h:translate-x-0.5"
            strokeWidth={2}
          />
        </Link>
      </div>
    </div>
  );
}

"use client";

import { Fragment, useId, useRef, useState } from "react";
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

import { BERG_HUES } from "@/components/berg/hues";
import { BERG_LOGO } from "@/components/brand/berg-logo";
import { BERG } from "@/lib/berg-content";

/**
 * Berg's network: the three groups on it, each standing in its own pool of
 * light on one floor, wired into Berg in the middle.
 *
 * Built to the reference the client sent — a lit world on a grid, wired to a
 * glowing centre, each part labelled by a pill with a coloured badge — and
 * inverted to a LIGHT ground on their instruction.
 *
 * The versions before this are worth recording, because each failed for a
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
 *      Four grey rhombuses 11px deep are not objects, they are diamonds
 *   6. chunky isometric islands round a white platform. The client liked the
 *      world and not the blocks, 2026-09-30: a cube reads as a building
 *      whatever stands on it, and nobody on Berg is a building. First the
 *      buildings on top became people; then the blocks under them had to go
 *      too, and the wires — polylines with a joint halfway, a circuit diagram —
 *      were asked to be reworked
 *
 * So there are no blocks. Each group stands in a pool of its own colour on the
 * floor with a ring round it — the way a stage marks where somebody stands —
 * and Berg is a lit disc with a glowing orb floating over it.
 *
 * The orb becomes Berg's logo only when Berg is picked, and glows as it does —
 * the client's call, 2026-09-30: the orb is the resting state and was right as
 * it was; the logo is the answer to "what is Berg". The scene opens on an
 * overview, not on Berg: all three groups lit, the orb in the middle, no pill
 * pressed. Every pill is a toggle — press a pressed one and it lets go, back
 * to the overview. The floor is allowed to
 * be flat because it is no longer what carries the depth: the people, the
 * requirement card, the badge and the logo are the solid things now, and they
 * are the things the picture is about.
 *
 * The wires are curves. Each leaves its group's ring square to the edge and
 * arrives square to Berg's, coloured from the group's hue into Berg blue, and
 * the light runs along it as a short bright stroke rather than a dot.
 *
 * What it says: Berg is one platform with three groups on it. That is the
 * client's own strapline — "One platform. Three groups." — as a place rather
 * than as a sentence.
 *
 * **Colour is the point and it is the one deliberate departure from the palette.**
 * The site runs blue, amber and neutrals. Three groups in three shades of the
 * same blue are three of the same thing, which is the opposite of what this
 * picture has to say. So the three groups get three genuinely different hues —
 * and two of the four are still the brand's: amber is Consultants, brand blue is
 * Berg. Teal and violet are the two that are new, and they are the two that
 * carry no other meaning anywhere on this site, so nothing they say can be
 * confused with something else.
 *
 * **Every word is flat HTML.** The scene is SVG and carries no type at all — the
 * label pills, the copy strip and the foot sit over it as ordinary DOM. Type
 * inside a tilted plane is unreadable and, just as importantly, unmeasurable: a
 * contrast check cannot sample a glyph that is being perspective-projected. The
 * picture tilts; the words never do.
 *
 * SVG and CSS, not WebGL or a 3D file. There is nothing to simulate — ellipses,
 * three curves, five people and a logo. A Spline scene would be half a megabyte
 * to draw what the browser draws for nothing.
 *
 * `prefers-reduced-motion` keeps the world and the selection, and drops the
 * arrival, the tilt, the floating, the turning ring and the travelling light.
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
   Everything on the floor is drawn at 2:1 — every ellipse is twice as wide as
   it is deep, and the floor grid's diamonds are too. That shared ratio is the
   whole trick: it is what makes a flat ellipse read as a ring lying ON the
   floor rather than an oval stuck to the screen.
   -------------------------------------------------------------------------- */

/* 560x340 — WIDE, not square. The first version was 460x470, which in a 480px
   column rendered 490px tall and put the hero at 1095px: a screen and a half on
   a 1366x768 laptop. The picture is the same picture; it is laid out across the
   frame instead of down it, and the panel lost 199px for nothing. */
const VB = { w: 560, h: 340 };

const BLUE = "#1972b9";

/** `top` lights the pool, `ring` draws its edge, `dot` is the badge and the
    card's header, `left`/`right` are the two faces of the medal's ribbon. The
    rings are darkened until each clears 3:1 on the floor — the amber took the
    most, from the badge's own shade to #B08300. `fill` is the pill once it is
    picked, with white type on it — each at 4.5:1 or better, which is why
    customers takes its deeper teal there (the badge teal is 3.95:1). */
type Tint = { top: string; ring: string; dot: string; fill: string; left: string; right: string };

const TINTS: Record<string, Tint> = {
  customers: { top: "#32D3C6", ring: "#0E8F8A", dot: BERG_HUES.customers, fill: "#0B807B", left: "#0B807B", right: "#13A89E" },
  firms: { top: "#9384F9", ring: "#5B41CF", dot: BERG_HUES.firms, fill: "#5B41CF", left: "#4A32BE", right: "#6549DA" },
  consultants: { top: "#FFD452", ring: "#B08300", dot: BERG_HUES.consultants, fill: "#8A6700", left: "#B98A00", right: "#E0A800" },
};

/** A place on the floor: centre and half-width. Half-depth is always rx / 2. */
type Zone = { x: number; y: number; rx: number };

/** Berg, in the middle. */
const HUB: Zone = { x: 284, y: 200, rx: 74 };

/** A point on a floor ring at angle `a` (degrees, 0 = right, 90 = toward the
    viewer), and the outward normal there — which is not the radius on an
    ellipse, and is what lets a wire leave the ring square to its edge. */
function onRing(z: Zone, a: number) {
  const t = (a * Math.PI) / 180;
  const ry = z.rx / 2;
  const nx = Math.cos(t) * ry;
  const ny = Math.sin(t) * z.rx;
  const n = Math.hypot(nx, ny);
  return { p: [z.x + z.rx * Math.cos(t), z.y + ry * Math.sin(t)], n: [nx / n, ny / n] };
}

const r1 = (v: number) => Math.round(v * 10) / 10;

/** One wire: a cubic from the group's ring to Berg's, each end's handle along
    that ring's normal, 0.42 of the gap long — long enough to curve, short
    enough not to loop. */
function wire(z: Zone, from: number, to: number) {
  const s = onRing(z, from);
  const e = onRing(HUB, to);
  const arm = 0.42 * Math.hypot(e.p[0] - s.p[0], e.p[1] - s.p[1]);
  const pt = (p: number[], n: number[], k: number) => `${r1(p[0] + n[0] * k)} ${r1(p[1] + n[1] * k)}`;
  return {
    from: [r1(s.p[0]), r1(s.p[1])],
    to: [r1(e.p[0]), r1(e.p[1])],
    d: `M ${pt(s.p, s.n, 0)} C ${pt(s.p, s.n, arm)} ${pt(e.p, e.n, arm)} ${pt(e.p, e.n, 0)}`,
  };
}

/** A group's place on the floor: a soft glow, a pool of its colour with a ring
    round it, and a fainter dotted ring outside that. */
function Pool({ z, c, id }: { z: Zone; c: Tint; id: string }) {
  const ry = z.rx / 2;
  return (
    <g>
      <ellipse cx={z.x} cy={z.y} rx={z.rx * 1.45} ry={ry * 1.45} fill={`url(#${id}-glow)`} />
      <ellipse
        cx={z.x}
        cy={z.y}
        rx={z.rx + 9}
        ry={ry + 4.5}
        fill="none"
        stroke={c.ring}
        strokeOpacity={0.4}
        strokeWidth={1}
        strokeDasharray="1.5 4"
        strokeLinecap="round"
      />
      <ellipse
        cx={z.x}
        cy={z.y}
        rx={z.rx}
        ry={ry}
        fill={c.top}
        fillOpacity={0.3}
        stroke={c.ring}
        strokeWidth={1.5}
      />
    </g>
  );
}

/* --------------------------------------------------------------------------
   People
   --------------------------------------------------------------------------
   The figure is the one everybody already reads as "a person" — a rounded
   torso and a head — built solid, not as an outline. Each group's people are
   cut from their group's own hue, a few steps darker than its pool: on the
   pools they hold 3.7 to 8:1 at the mid-tone, where white figures would have
   vanished on the amber (1.42:1).
   -------------------------------------------------------------------------- */

type Shade3 = { lo: string; mid: string; hi: string };

const FIGURE: Record<string, Shade3> = {
  customers: { lo: "#07615D", mid: "#0B807B", hi: "#17A69C" },
  firms: { lo: "#35209A", mid: "#4A32BE", hi: "#6E56E0" },
  consultants: { lo: "#6E5200", mid: "#9A7300", hi: "#C29100" },
};

/** One person. `x, y` is where they stand — the middle of their feet on the
    floor. 16 wide, 27 tall. */
function Person({ x, y, id }: { x: number; y: number; id: string }) {
  const w = 7.5;
  return (
    <g>
      <ellipse cx={x} cy={y + 0.5} rx={10} ry={4} fill="rgb(11 30 48 / 0.2)" />
      {/* Torso: straight sides, rounded shoulders, and an elliptical foot so it
          stands on the floor instead of being cut off by it. */}
      <path
        d={`M ${x - w} ${y} V ${y - 8} C ${x - w} ${y - 17} ${x + w} ${y - 17} ${x + w} ${y - 8} V ${y} A ${w} 3.4 0 0 1 ${x - w} ${y} Z`}
        fill={`url(#${id}-body)`}
      />
      <circle cx={x} cy={y - 21} r={5.4} fill={`url(#${id}-head)`} />
      <ellipse cx={x + 1.8} cy={y - 23} rx={1.8} ry={1.2} fill="#fff" opacity={0.4} />
    </g>
  );
}

/**
 * The requirement a customer posts, standing in their pool. It is set in the
 * floor's own front-left plane — `matrix(1 0.5 0 1)` is that plane — so it
 * belongs to the world rather than floating over it. Header in the group's
 * colour, two lines of text, and the amber "Urgent" tag from Berg's own
 * published example. `x, y` is its top-left corner.
 */
function Requirement({ x, y, c }: { x: number; y: number; c: Tint }) {
  return (
    <g transform={`matrix(1 0.5 0 1 ${x} ${y})`}>
      {/* the card's edge, one step back along the other axis */}
      <rect x={1.4} y={-1.4} width={26} height={20} rx={1.6} fill="#C3D1DE" />
      <rect width={26} height={20} rx={1.6} fill="#FFFFFF" />
      <rect width={26} height={5} rx={1.6} fill={c.dot} />
      <rect y={2.5} width={26} height={2.5} fill={c.dot} />
      <rect x={3} y={8} width={16} height={1.6} rx={0.8} fill="#C9D3DD" />
      <rect x={3} y={11.4} width={11} height={1.6} rx={0.8} fill="#C9D3DD" />
      <rect x={3} y={14.6} width={9} height={3} rx={1.5} fill="#FEC00F" />
    </g>
  );
}

/** A certification — what a consultant showcases on Berg. A medal with a tick,
    floating off the shoulder. `x, y` is the centre of the disc. */
function Badge({ x, y, c }: { x: number; y: number; c: Tint }) {
  return (
    <g>
      <path d={`M ${x - 4} ${y + 4} L ${x - 6.5} ${y + 12.5} L ${x - 3.4} ${y + 10.8} L ${x - 1.2} ${y + 13} L ${x - 0.4} ${y + 6} Z`} fill={c.left} />
      <path d={`M ${x + 4} ${y + 4} L ${x + 6.5} ${y + 12.5} L ${x + 3.4} ${y + 10.8} L ${x + 1.2} ${y + 13} L ${x + 0.4} ${y + 6} Z`} fill={c.right} />
      <circle cx={x + 0.8} cy={y + 1.4} r={8} fill="rgb(11 30 48 / 0.16)" />
      <circle cx={x} cy={y} r={8} fill="#FFFFFF" />
      <circle cx={x} cy={y} r={5.6} fill={c.dot} />
      <path
        d={`M ${x - 2.6} ${y + 0.1} L ${x - 0.7} ${y + 2} L ${x + 2.8} ${y - 1.8}`}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** Where each group stands. */
const ZONES = {
  customers: { x: 106, y: 116, rx: 52 },
  firms: { x: 456, y: 128, rx: 56 },
  consultants: { x: 150, y: 280, rx: 50 },
} satisfies Record<string, Zone>;

const GROUPS = [
  {
    key: "customers",
    label: "Customers",
    icon: Building2,
    /** Under sm the pill keeps its size while the scene shrinks; this keeps it
        off the scene's left edge at 320. */
    pill: "-translate-x-1/2 max-sm:-translate-x-[40%]",
    /** The pointer sits on the anchor, wherever the pill is shifted to. */
    tail: "left-1/2 max-sm:left-[40%]",
    zone: ZONES.customers,
    /** Leaves its ring low on the right, arrives at Berg's left. */
    wire: wire(ZONES.customers, 25, 195),
    /** One person, and the requirement they posted standing behind them —
        which is what a customer puts into Berg. */
    people: [{ x: 90, y: 122 }],
    requirement: { x: 110, y: 88 },
    badge: null,
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
    /** The widest label on the group nearest an edge: centred, it ran off the
        right edge under sm, 16px of it at 320. */
    pill: "-translate-x-1/2 max-sm:-translate-x-[68%]",
    tail: "left-1/2 max-sm:left-[68%]",
    zone: ZONES.firms,
    wire: wire(ZONES.firms, 155, 340),
    /** A team of three — a firm is the group in this picture. Back row first,
        so the front one overlaps them. */
    people: [
      { x: 440, y: 124 },
      { x: 472, y: 124 },
      { x: 456, y: 140 },
    ],
    requirement: null,
    badge: null,
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
    /** Centred over the group at sm and up. Under sm the pill stays 36px tall
        for the thumb while the scene shrinks, and centred it reached into the
        logo — so it sits a little left of centre there. */
    pill: "-translate-x-1/2 max-sm:-translate-x-[68%]",
    tail: "left-1/2 max-sm:left-[68%]",
    zone: ZONES.consultants,
    wire: wire(ZONES.consultants, -30, 145),
    /** One person, and the certification they showcase. */
    people: [{ x: 142, y: 286 }],
    requirement: null,
    badge: { x: 164, y: 262 },
    headline: BERG.roles.items[2].headline,
    teaser: BERG.roles.items[2].teaser,
    /** [live] "Consultants can showcase their expertise free." */
    fact: "Showcase your expertise — free",
    chips: ["Skills", "Certifications", "Experience"],
  },
] as const;

/** The logo, at its own 1774:864. 116 wide, and hovering: its lowest point,
    the tail of the g, sits 6 above the middle of the disc. Keyed as `<use>`
    attributes so it spreads straight onto one. */
const LOGO = {
  x: HUB.x - 58,
  y: HUB.y - 6 - (116 * BERG_LOGO.h) / BERG_LOGO.w,
  width: 116,
  height: (116 * BERG_LOGO.h) / BERG_LOGO.w,
};

/** The orb Berg rests as: floating 28 over the middle of the disc, so its
    foot clears the plate by 4 — the same hover the logo has. */
const ORB = { x: HUB.x, y: HUB.y - 28, r: 24 };

/** Its thickness: the mark again, four times, stepped down under the face in a
    darker blue and a darker amber — letters standing up, not a sticker on the
    scene. */
const LOGO_DEPTH = [3, 2.25, 1.5, 0.75];
const LOGO_SIDE = { blue: "#0E4F86", amber: "#C99200" };

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

const EASE = [0.22, 1, 0.36, 1] as const;
const SWAP = { duration: 0.4, ease: EASE };
const TILT = { stiffness: 140, damping: 22, mass: 0.6 } as const;

/** The light on a wire: 16% of its length, run from the group into Berg. */
const PULSE = 0.16;

const ALL = [...GROUPS, BERG_PART];

export function NetworkScene() {
  /* "all" is the overview the scene opens on; otherwise the part picked. */
  const [key, setKey] = useState<string>("all");
  const pick = (k: string) => setKey((cur) => (cur === k ? "all" : k));
  const bergOn = key === "berg";
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

  /* A group is lit when it is picked, in the overview, or when Berg is — Berg
     is all of them. */
  const lit = (k: string) => key === k || key === "berg" || key === "all";
  const arrive = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    transition: { duration: 0.9, delay: reduce ? 0 : 0.12 + i * 0.1, ease: EASE },
  });

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
            data-scene="berg-network"
            className="h-auto w-full"
            aria-hidden
          >
            <defs>
              {/* The floor: a diamond lattice at the same 2:1 as every ring
                  on it. The square grid it replaces was fine under blocks and
                  wrong under ellipses — it put them on a wall. */}
              <pattern
                id={`${uid}-grid`}
                width="56"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 0 L 56 28 M 0 28 L 56 0"
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
              <radialGradient id={`${uid}-orb-halo`}>
                <stop offset="0%" stopColor="rgb(0 142 255 / 0.4)" />
                <stop offset="100%" stopColor="rgb(0 142 255 / 0)" />
              </radialGradient>
              <radialGradient id={`${uid}-halo`}>
                <stop offset="0%" stopColor="rgb(0 142 255 / 0.26)" />
                <stop offset="100%" stopColor="rgb(0 142 255 / 0)" />
              </radialGradient>
              {/* The logo's glow, in two parts. The halo is the letters
                  fattened by 8 and softened by 3.5, in solid white: 8 is what
                  it takes to close the gaps between the letters and fill the
                  counters, so the grid, the turning ring and the disc's edge
                  stop showing through anywhere inside the word. Fattened by 4
                  it hugged each letter and left the lines running between
                  them. The aura is the same shape blurred wide, in blue: the
                  light itself. */}
              <filter id={`${uid}-halo-f`} x="-40%" y="-70%" width="180%" height="240%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="8" result="fat" />
                <feGaussianBlur in="fat" stdDeviation="3.5" result="soft" />
                <feFlood floodColor="#FFFFFF" />
                <feComposite in2="soft" operator="in" />
              </filter>
              <filter id={`${uid}-aura-f`} x="-50%" y="-90%" width="200%" height="280%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="8" result="fat" />
                <feGaussianBlur in="fat" stdDeviation="10" result="wide" />
                <feFlood floodColor="#1E8BE8" floodOpacity="0.5" />
                <feComposite in2="wide" operator="in" />
              </filter>
              <radialGradient id={`${uid}-disc`} cx="0.5" cy="0.4" r="0.6">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#E3EEF8" />
              </radialGradient>
              {/* The mark once, drawn five times by reference. No fill of its
                  own, so each `<use>` sets it — the side copies dark, the face
                  in the logo's colours. */}
              <symbol id={`${uid}-berg-letters`} viewBox={`0 0 ${BERG_LOGO.w} ${BERG_LOGO.h}`}>
                <path d={BERG_LOGO.letters} fillRule="evenodd" />
              </symbol>
              <symbol id={`${uid}-berg-dots`} viewBox={`0 0 ${BERG_LOGO.w} ${BERG_LOGO.h}`}>
                {BERG_LOGO.dots.map((dot) => (
                  <circle key={dot.cx} {...dot} />
                ))}
              </symbol>
              {GROUPS.map(({ key: k, wire: w }) => (
                <Fragment key={k}>
                  <radialGradient id={`${uid}-${k}-glow`}>
                    <stop offset="0%" stopColor={TINTS[k].top} stopOpacity="0.45" />
                    <stop offset="100%" stopColor={TINTS[k].top} stopOpacity="0" />
                  </radialGradient>
                  {/* Group colour into Berg blue, laid along the wire itself. */}
                  <linearGradient
                    id={`${uid}-${k}-wire`}
                    gradientUnits="userSpaceOnUse"
                    x1={w.from[0]}
                    y1={w.from[1]}
                    x2={w.to[0]}
                    y2={w.to[1]}
                  >
                    <stop offset="0%" stopColor={TINTS[k].ring} />
                    <stop offset="100%" stopColor={BLUE} />
                  </linearGradient>
                  <linearGradient id={`${uid}-${k}-body`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor={FIGURE[k].lo} />
                    <stop offset="65%" stopColor={FIGURE[k].mid} />
                    <stop offset="100%" stopColor={FIGURE[k].hi} />
                  </linearGradient>
                  <radialGradient id={`${uid}-${k}-head`} cx="0.62" cy="0.35" r="0.75">
                    <stop offset="0%" stopColor={FIGURE[k].hi} />
                    <stop offset="100%" stopColor={FIGURE[k].lo} />
                  </radialGradient>
                </Fragment>
              ))}
            </defs>

            {/* the floor */}
            <rect
              width={VB.w}
              height={VB.h}
              fill={`url(#${uid}-grid)`}
              mask={`url(#${uid}-mask)`}
            />

            {/* -- layer 1: everything lying on the floor ------------------ */}

            {/* Berg's disc — never dimmed, it is what everything is wired to */}
            <motion.g
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              onClick={() => pick("berg")}
              className="cursor-pointer"
            >
              <ellipse cx={HUB.x} cy={HUB.y - 10} rx={132} ry={70} fill={`url(#${uid}-halo)`} />
              <ellipse
                cx={HUB.x}
                cy={HUB.y}
                rx={HUB.rx + 18}
                ry={HUB.rx / 2 + 9}
                fill="none"
                stroke={BLUE}
                strokeOpacity={0.2}
                strokeWidth={1}
              />
              <ellipse
                cx={HUB.x}
                cy={HUB.y}
                rx={HUB.rx}
                ry={HUB.rx / 2}
                fill={`url(#${uid}-disc)`}
                stroke={bergOn ? BLUE : "rgb(25 114 185 / 0.45)"}
                strokeWidth={1.75}
              />
              {/* The inner ring turns — a dashed ellipse whose dashes walk
                  round it. 2 on, 5 off, so 70 is ten whole periods and the loop
                  has no seam. */}
              <motion.ellipse
                cx={HUB.x}
                cy={HUB.y}
                rx={HUB.rx - 18}
                ry={HUB.rx / 2 - 9}
                fill="none"
                stroke={BLUE}
                strokeOpacity={0.45}
                strokeWidth={1.25}
                strokeDasharray="2 5"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 0 }}
                animate={reduce ? undefined : { strokeDashoffset: -70 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              {/* Picked: the same widening ring the groups send out, from the
                  disc — so choosing Berg changes the picture, not just the
                  pill. */}
              {bergOn && !reduce ? (
                <motion.ellipse
                  cx={HUB.x}
                  cy={HUB.y}
                  fill="none"
                  stroke={BLUE}
                  strokeWidth={1.5}
                  initial={{ rx: HUB.rx, ry: HUB.rx / 2, opacity: 0.7 }}
                  animate={{ rx: HUB.rx * 1.45, ry: HUB.rx * 0.725, opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              ) : null}
              {/* The logo's shadow. It stays put while the logo floats, which
                  is what makes the float read as height. */}
              <ellipse cx={HUB.x} cy={HUB.y + 2} rx={44} ry={8} fill={`url(#${uid}-shade)`} />
              {/* The logo's glow. It lives down here on the floor layer, not
                  with the logo, so the wires draw OVER it — it hides what is
                  behind the word without ever swallowing a wire's end. It
                  floats on the logo's own timing, so the two never part, and it
                  exists only while the logo does. The aura breathes; the halo
                  holds still — it is what keeps the scene from showing through. */}
              <AnimatePresence initial={false}>
                {bergOn ? (
                  <motion.g
                    key="glow"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <motion.g
                      animate={reduce ? undefined : { y: [0, -4, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <motion.g
                        filter={`url(#${uid}-aura-f)`}
                        animate={reduce ? undefined : { opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <use href={`#${uid}-berg-letters`} {...LOGO} />
                        <use href={`#${uid}-berg-dots`} {...LOGO} />
                      </motion.g>
                      <g filter={`url(#${uid}-halo-f)`}>
                        <use href={`#${uid}-berg-letters`} {...LOGO} />
                        <use href={`#${uid}-berg-dots`} {...LOGO} />
                        <use href={`#${uid}-berg-letters`} {...LOGO} y={LOGO.y + LOGO_DEPTH[0]} />
                        <use href={`#${uid}-berg-dots`} {...LOGO} y={LOGO.y + LOGO_DEPTH[0]} />
                      </g>
                    </motion.g>
                  </motion.g>
                ) : null}
              </AnimatePresence>
            </motion.g>

            {GROUPS.map((g, i) => {
              const on = key === g.key;
              return (
                <motion.g
                  key={g.key}
                  {...arrive(i)}
                  animate={{ opacity: lit(g.key) ? 1 : 0.42, y: 0 }}
                  onClick={() => pick(g.key)}
                  className="cursor-pointer"
                >
                  <Pool z={g.zone} c={TINTS[g.key]} id={`${uid}-${g.key}`} />
                  {/* Picked: a ring that keeps widening out of the pool and
                      fading, so it is plain which group the copy is about. */}
                  {on && !reduce ? (
                    <motion.ellipse
                      cx={g.zone.x}
                      cy={g.zone.y}
                      fill="none"
                      stroke={TINTS[g.key].ring}
                      strokeWidth={1.5}
                      initial={{ rx: g.zone.rx, ry: g.zone.rx / 2, opacity: 0.7 }}
                      animate={{ rx: g.zone.rx * 1.5, ry: g.zone.rx * 0.75, opacity: 0 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                  ) : null}
                </motion.g>
              );
            })}

            {/* -- layer 2: the wires, over the floor and under the people - */}
            {GROUPS.map((g, i) => {
              const on = lit(g.key);
              const { from, to, d } = g.wire;
              return (
                <g key={g.key}>
                  <path
                    d={d}
                    fill="none"
                    stroke={on ? `url(#${uid}-${g.key}-wire)` : "rgb(20 24 26 / 0.16)"}
                    strokeWidth={on ? 2.25 : 1.5}
                    strokeLinecap="round"
                    opacity={on ? 0.85 : 1}
                  />
                  {/* The light that runs the wire into Berg — the product's verb.
                      Motion's own path values: `pathLength` is the stroke's
                      length as a share of the wire, `pathOffset` where it
                      starts. -PULSE to 1 is fully off one end to fully off the
                      other, and the 1-long gap keeps a second copy from showing. */}
                  {reduce || !on ? null : (
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={`url(#${uid}-${g.key}-wire)`}
                      strokeWidth={4}
                      strokeLinecap="round"
                      initial={{ pathLength: PULSE, pathSpacing: 1, pathOffset: -PULSE }}
                      animate={{ pathOffset: [-PULSE, 1] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        repeatDelay: 1.4,
                        ease: "easeInOut",
                        delay: 0.9 + i * 0.5,
                      }}
                    />
                  )}
                  <circle
                    cx={from[0]}
                    cy={from[1]}
                    r={3.25}
                    fill="#FFFFFF"
                    stroke={on ? TINTS[g.key].ring : "rgb(20 24 26 / 0.25)"}
                    strokeWidth={1.75}
                  />
                  <circle
                    cx={to[0]}
                    cy={to[1]}
                    r={3.25}
                    fill="#FFFFFF"
                    stroke={on ? BLUE : "rgb(20 24 26 / 0.25)"}
                    strokeWidth={1.75}
                  />
                </g>
              );
            })}

            {/* -- layer 3: what stands up --------------------------------- */}

            <motion.g
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
              onClick={() => pick("berg")}
              className="cursor-pointer"
            >
              {/* One out as the other comes in, together: the orb shrinks away
                  while the logo grows out of the same spot, so it reads as the
                  orb turning into Berg rather than one picture replacing
                  another. */}
              <AnimatePresence initial={false}>
                {bergOn ? (
                  <motion.g
                    key="logo"
                    initial={reduce ? false : { opacity: 0, scale: 0.55 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.55 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <motion.g
                      animate={reduce ? undefined : { y: [0, -4, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {LOGO_DEPTH.map((dy) => (
                        <Fragment key={dy}>
                          <use href={`#${uid}-berg-letters`} {...LOGO} y={LOGO.y + dy} fill={LOGO_SIDE.blue} />
                          <use href={`#${uid}-berg-dots`} {...LOGO} y={LOGO.y + dy} fill={LOGO_SIDE.amber} />
                        </Fragment>
                      ))}
                      <use href={`#${uid}-berg-letters`} {...LOGO} fill={BERG_LOGO.blue} />
                      <use href={`#${uid}-berg-dots`} {...LOGO} fill={BERG_LOGO.amber} />
                    </motion.g>
                  </motion.g>
                ) : (
                  <motion.g
                    key="orb"
                    initial={reduce ? false : { opacity: 0, scale: 0.55 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.55 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <circle cx={ORB.x} cy={ORB.y} r={46} fill={`url(#${uid}-orb-halo)`} />
                    <motion.g
                      animate={reduce ? undefined : { y: [0, -5, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <circle cx={ORB.x} cy={ORB.y} r={ORB.r} fill={`url(#${uid}-core)`} />
                      <ellipse cx={ORB.x - 9} cy={ORB.y - 9} rx={7.5} ry={5} fill="#fff" opacity={0.45} />
                    </motion.g>
                  </motion.g>
                )}
              </AnimatePresence>
            </motion.g>

            {GROUPS.map((g, i) => {
              const on = key === g.key;
              const c = TINTS[g.key];
              return (
                <motion.g
                  key={g.key}
                  {...arrive(i)}
                  animate={{ opacity: lit(g.key) ? 1 : 0.42, y: 0 }}
                  onClick={() => pick(g.key)}
                  className="cursor-pointer"
                >
                  {/* picked: the people step up out of their pool — 3, not 5,
                      so they come up to meet the pill's pointer, not into it */}
                  <motion.g
                    animate={{ y: on ? -3 : 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {g.requirement ? <Requirement {...g.requirement} c={c} /> : null}
                    {g.people.map((p) => (
                      <Person key={`${p.x}-${p.y}`} {...p} id={`${uid}-${g.key}`} />
                    ))}
                    {g.badge ? (
                      <motion.g
                        animate={reduce ? undefined : { y: [0, -2.5, 0] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Badge {...g.badge} c={c} />
                      </motion.g>
                    ) : null}
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
          {/* Picked is a change of shape, not only of colour: the pill fills
              with its part's colour, its badge turns white, it grows a step,
              and a pointer drops out of it onto the part it names. Unpicked
              pills stay white and quiet, so there is only ever one that
              speaks. Under sm it does not grow and the pointer is 4px, not 6:
              the pills already sit within a few px of the scene's edges and
              of the people under them there. */}
          {GROUPS.map((g) => {
            const on = key === g.key;
            const Icon = g.icon;
            const c = TINTS[g.key];
            return (
              <button
                key={g.key}
                type="button"
                aria-pressed={on}
                onClick={() => pick(g.key)}
                style={
                  {
                    left: `${(g.zone.x / VB.w) * 100}%`,
                    top: `${((g.zone.y - g.zone.rx / 2) / VB.h) * 100}%`,
                    backgroundColor: on ? c.fill : undefined,
                    "--pill-glow": `${c.fill}99`,
                  } as React.CSSProperties
                }
                className={`absolute flex min-h-9 ${g.pill} -translate-y-[150%] cursor-pointer items-center gap-1.5 rounded-pill py-1 pr-3 pl-1.5 whitespace-nowrap transition dur-base ease-brand sm:gap-2 sm:pr-3.5 ${
                  on
                    ? "shadow-[0_10px_24px_-8px_var(--pill-glow)] sm:scale-[1.06]"
                    : "bg-canvas shadow-lg shadow-ink/10 ring-1 ring-border hover:ring-border-strong"
                }`}
              >
                <span
                  aria-hidden
                  className="grid size-5 shrink-0 place-items-center rounded-pill transition-colors dur-base ease-brand sm:size-6"
                  style={{ backgroundColor: on ? "#FFFFFF" : c.dot, color: on ? c.fill : "#FFFFFF" }}
                >
                  <Icon className="size-3 sm:size-3.5" strokeWidth={2.2} />
                </span>
                <span
                  className={`text-[0.6875rem] font-medium sm:text-xs ${on ? "text-white" : "text-ink-muted"}`}
                >
                  {g.label}
                </span>
                <span
                  aria-hidden
                  className={`absolute top-full -mt-px size-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent sm:border-x-[6px] sm:border-t-[6px] transition dur-base ease-brand ${g.tail} ${
                    on ? "opacity-100" : "-translate-y-1 opacity-0"
                  }`}
                  style={{ borderTopColor: c.fill }}
                />
              </button>
            );
          })}

          {/* Berg gets its own control, under the disc, and the same picked
              state — its pointer goes up, at the disc. */}
          <button
            type="button"
            aria-pressed={bergOn}
            onClick={() => pick("berg")}
            style={
              {
                backgroundColor: bergOn ? BLUE : undefined,
                "--pill-glow": `${BLUE}99`,
              } as React.CSSProperties
            }
            /* Anchored to the foot of the scene rather than computed off the
               disc. The disc moves when the composition is retuned; the
               bottom edge does not. */
            className={`absolute bottom-3 left-1/2 flex min-h-9 -translate-x-1/2 cursor-pointer items-center gap-2 rounded-pill py-1.5 pr-3.5 pl-1.5 whitespace-nowrap transition dur-base ease-brand ${
              bergOn
                ? "text-white shadow-[0_10px_24px_-8px_var(--pill-glow)] sm:scale-[1.06]"
                : "bg-canvas shadow-lg shadow-ink/10 ring-1 ring-border hover:ring-border-strong"
            }`}
          >
            <span
              aria-hidden
              className={`grid size-5 shrink-0 place-items-center rounded-pill ${
                bergOn ? "bg-white" : "grad-primary"
              }`}
            >
              {bergOn ? <span className="size-2 rounded-pill bg-primary" /> : null}
            </span>
            <span className={`text-xs font-medium ${bergOn ? "" : "text-ink-muted"}`}>
              Berg
            </span>
            <span
              aria-hidden
              className={`absolute bottom-full left-1/2 -mb-px size-0 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent sm:border-x-[6px] sm:border-b-[6px] transition dur-base ease-brand ${
                bergOn ? "opacity-100" : "translate-y-1 opacity-0"
              }`}
              style={{ borderBottomColor: BLUE }}
            />
          </button>
        </div>
      </div>

      {/* -- the selected part's own words ------------------------------- */}
      {/* `min-h` holds the height across all four, so picking a group never
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
              160px floor, so picking a group moved the hero by 7px. Eight
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

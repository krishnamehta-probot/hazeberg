"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";

import type { ServiceIconKey, ServiceStage } from "@/lib/service-content";

import { SERVICE_ICON } from "./service-icons";

/**
 * The module's cycle as a dial: six stages on a glass bezel that turns, one
 * amber marker at twelve o'clock, and the module itself in a blue core.
 *
 * The page's claim is that a module is a cycle a person lives through —
 * hired, set up, growing, rewarded, on the clock, paid, and round again. The
 * ring that said this before (2026-10-02) sat in front of the inner pages'
 * arc of light, and the two read as one muddle: a circle of glass with a
 * rainbow edge cutting behind it, and nothing on it a reader could name at a
 * glance. So this opener is `backdrop="space"`, like What we do's globe — the
 * dial is the only light in the frame — and it reads the way an instrument
 * does: the stage under the marker is the stage you are at.
 *
 * Back to front, all in one 0-100 box:
 *
 *   bloom       the blue the dial stands in
 *   frame       fixed: a tick every six degrees and a long one at each stage,
 *               the glass of the bezel (lit from above, its two hairlines, a
 *               faint shade at both edges), the lit SLOT at the top that the
 *               active stage stops in — How we work's drum stops its front
 *               word in the same kind of slot — the marker and the timer arc
 *               under it, and the dark inner disc
 *   bezel       the only thing that turns: the six stage names set round the
 *               glass in mono caps, a bead between each pair. One transform
 *   core        the services wheel's blue glass, with the module's icon and
 *               name — a link to the top of the capabilities section
 *
 * **The turn.** Every `DWELL` the bezel turns one stage, and the next stage
 * comes up into the slot. The arc under the marker is the timer: it fills
 * across the slot while the stage dwells, holds full for a beat, and the turn
 * starts as it fades, so a change is always seen coming. The turn is a Web
 * Animation of
 * one `rotate`, on its own layer, so the compositor runs it; it eases on the
 * brand curve rather than ticking, the drum's manner rather than a clock's.
 *
 * **Every name stays upright.** Text set round a turning ring is upside down
 * along the bottom half, and half a dial of upside-down words is not
 * "immediately understandable". Each name is set twice — clockwise for the
 * top half, counter-clockwise for the bottom — and swaps at the moment it
 * passes three or nine o'clock, where both are vertical and the swap is a
 * blink at the edge of the eye. The moment is worked out from the turn's own
 * easing (`timeOf`), not guessed, so it lands on the crossing whatever the
 * turn's length.
 *
 * Auto-rotation's three obligations (PROJECT-RULES, Hero):
 *   - the pointer anywhere on the dial, or focus anywhere in it, holds it:
 *     the timer stops where it is and dims
 *   - one click anywhere on it — a stage, the core, the glass — stops it for
 *     good, and the timer goes
 *   - reduced motion never starts it. The still frame is stage 01 under the
 *     marker and no timer, and it is the server's markup, so nothing is
 *     branched on the motion setting at render
 * Off screen or on a hidden tab, the timer pauses.
 *
 * **By hand.** Resting the pointer on a stage turns the dial to bring it up
 * (after `HOVER`, so a sweep across the dial does not spin it). This is
 * judged by WHERE the pointer is rather than by which name is under it:
 * when the dial turns, a different name arrives under a pointer that has not
 * moved, and judging by the name would turn again, and again. So a position
 * turns the dial once, and only moving to another one turns it again — and
 * a click on that position opens the stage it brought up, the one lit in the
 * slot, not the neighbour that slid in under the pointer. Keyboard focus
 * brings the focused stage up at once and lights the outline of its sector —
 * a browser's own outline round SVG text is a box at an angle. (A mouse
 * press focuses a link too, in Chrome and Firefox; that focus does not turn
 * the dial, or every click would swing it under the pointer first.)
 *
 * Every stage is a real link, `#stage-<key>`, straight to its panel in the
 * capabilities rail below, named "01 Hired — Recruiting and onboarding" for
 * assistive technology. The readout under the dial repeats the area and is
 * hidden from it.
 *
 * Placement follows the globe: right of the copy's measure (PageHero's
 * `--hero-copy-w`), from lg — a tablet held landscape, since 2026-10-03;
 * under lg the copy takes the frame and the rail below carries the six
 * stages on every screen anyway. The box is the opener's band (header to
 * rail, less the hero's two margins), a size container, so the dial is
 * `min(28rem | 30rem, 100cqh - the readout, the width right of the copy)` —
 * solved, not tuned, at 1280x650, 1366x657, 1440x780, 1536x730 and 1920x950:
 * 355px to 480px across, 26px or more below the header, the readout 27px or
 * more clear of the rail, and the ring 74px or more right of the copy. Even at the smallest dial
 * the longest name, "05 ON THE CLOCK" at 11px, is 116px against a 139px
 * sixth of the ring: 9.9px clear of the beads either side. At the six
 * landscape tablets (1024x768 to 1194x834, measured) the width binds instead:
 * PageHero narrows the copy so the dial always has 360px — 360px from 1024
 * to 1152 wide, 388px at 1180, 402px at 1194 — with the ring 26px right of
 * the copy's column and the readout 47px or more, 69px or more below the
 * header and 70px or more above the rail; in Safari's first screens, the
 * tablets less its bars (1024x690 to 1194x764), still 360px or more, 35px or
 * more below the header and 36px or more above the rail. 360px is the floor
 * the bezel's 12.8 units need to stay 44px deep (46px here), and "05 ON THE
 * CLOCK" is 118px against a 141px sixth.
 *
 * On a touch screen there is no resting pointer, so nothing here waits for
 * one: a touch never turns or holds the dial, and a tap is a click — it opens
 * the stage under the finger and stops the dial for good, and the core opens
 * the capabilities (checked on a touch context at 1024x768 and 1180x820).
 */

/* The dial, in the 0-100 box it is drawn in. */
const R_TICK = 48.15; // the fine ticks' middle; each is TICK_LEN long
const TICK_LEN = 1.5;
const TICKS = 60;
const TICK_W = 0.26;
const R_LONG_IN = 46.4; // a long tick at each stage
const R_LONG_OUT = 49.4;
const R_TIMER = 45; // the timer arc, between the bezel and the ticks
const TIMER_HALF = 26; // degrees either side of twelve
const R_MARK_TIP = 46.3;
const R_MARK_BASE = 49.4;
const MARK_HALF = 1.7;
const R_BO = 43.8; // the bezel. 12.8 units is 45px at the smallest dial,
const R_BI = 31; //   so every stage's hit area clears 44px
const R_T = (R_BO + R_BI) / 2; // the names' centre line
const R_DISC = 29.4;
const R_ORBIT = 23.4;
const R_CORE = 17;
const R_BEAD = 0.42;

/* Motion, ms. */
const TURN = 900;
const DWELL = 3400;
const FIRST = 900; // the first dwell waits out the dial's own entrance
const FADE = 160; // a name's swap between its two settings
const HOVER = 120;
/** `--ease-brand`, for the Web Animation. Its two y handles are both 1, which
    is what makes `timeOf` a closed form. */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const X1 = 0.22;
const X2 = 0.36;

const pad = (i: number) => String(i + 1).padStart(2, "0");
const fix = (v: number) => Number(v.toFixed(3));
const rad = (deg: number) => (deg * Math.PI) / 180;
/** A point `r` from the centre, `deg` clockwise from twelve. */
const xy = (r: number, deg: number) => ({
  x: fix(50 + r * Math.sin(rad(deg))),
  y: fix(50 - r * Math.cos(rad(deg))),
});
const at = (r: number, deg: number) => {
  const p = xy(r, deg);
  return `${p.x} ${p.y}`;
};
/** An arc of radius `r` from `a0` to `a1`, clockwise unless `ccw`. */
const arc = (r: number, a0: number, a1: number, ccw = false) =>
  `M ${at(r, a0)} A ${fix(r)} ${fix(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${ccw ? 0 : 1} ${at(r, a1)}`;
/** One sixth of the bezel (or any annular sector), clockwise from `a0`. */
const sector = (a0: number, a1: number, ri: number, ro: number) => {
  const o = fix(ro);
  const i = fix(ri);
  return `M ${at(ro, a0)} A ${o} ${o} 0 0 1 ${at(ro, a1)} L ${at(ri, a1)} A ${i} ${i} 0 0 0 ${at(ri, a0)} Z`;
};
/** A whole annulus, for an even-odd fill. */
const annulus = (ro: number, ri: number) =>
  `M 50 ${fix(50 - ro)} A ${ro} ${ro} 0 1 1 50 ${fix(50 + ro)} A ${ro} ${ro} 0 1 1 50 ${fix(50 - ro)} Z ` +
  `M 50 ${fix(50 - ri)} A ${ri} ${ri} 0 1 0 50 ${fix(50 + ri)} A ${ri} ${ri} 0 1 0 50 ${fix(50 - ri)} Z`;

/** Below three and nine o'clock, where a name reads counter-clockwise. */
const low = (deg: number) => Math.cos(rad(deg)) < -1e-9;

/* The brand curve, both ways round. With both y handles at 1 its progress is
   1 - (1 - s)^3 along the curve's own parameter, so the time a given share of
   a turn is reached is exact; only the other way needs a search. */
const bx = (s: number) => 3 * (1 - s) * (1 - s) * s * X1 + 3 * (1 - s) * s * s * X2 + s * s * s;
const timeOf = (p: number) => bx(1 - Math.cbrt(1 - p));
const eased = (x: number) => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 24; k++) {
    const m = (lo + hi) / 2;
    if (bx(m) < x) lo = m;
    else hi = m;
  }
  const s = (lo + hi) / 2;
  return 1 - (1 - s) ** 3;
};

/** The share of a turn from `a0` to `a1` at which a name last crosses three
    or nine o'clock — where it swaps settings — or -1 if it never does. */
const crossing = (a0: number, a1: number) => {
  if (a0 === a1) return -1;
  const lo = Math.min(a0, a1);
  const hi = Math.max(a0, a1);
  let last = -1;
  for (let b = 90 + 180 * Math.ceil((lo - 90) / 180); b < hi; b += 180) {
    if (b > lo) last = Math.max(last, (b - a0) / (a1 - a0));
  }
  return last;
};

export function ServiceCycle({
  icon,
  label,
  stages,
  target,
}: {
  icon: ServiceIconKey;
  label: string;
  stages: readonly ServiceStage[];
  /** The capabilities section's id — where the core goes. */
  target: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const dial = useRef<HTMLDivElement>(null);
  const bezel = useRef<HTMLDivElement>(null);
  const fill = useRef<SVGPathElement>(null);

  const Icon = SERVICE_ICON[icon];
  const n = stages.length;
  const step = 360 / n;
  const words = label.split(" ");
  const id = (s: string) => `${uid}-${s}`;

  useEffect(() => {
    const el = dial.current;
    const spin = bezel.current;
    const bar = fill.current;
    if (!el || !spin || !bar) return;
    const links = Array.from(el.querySelectorAll<SVGAElement>("[data-stage]"));
    const cues = Array.from(el.querySelectorAll<HTMLElement>("[data-cue]"));
    const count = links.length;
    if (!count) return;
    const unit = 360 / count;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* -- state ---------------------------------------------------------- */
    let rot = 0; // where the bezel is going, degrees; it only ever adds up
    let from = 0; // the last turn, so the angle mid-turn can be worked out
    let to = 0;
    let t0 = -Infinity;
    let active = 0;
    let turning: Animation | null = null;
    let timer: Animation | null = null;
    let pointerIn = false;
    let focusIn = false;
    let onScreen = false;
    let stopped = false;
    let place = -1; // the sixth of the dial the pointer is over, on screen
    let raised = false; // resting there turned the dial; cleared when it moves on
    let hoverT = 0;

    /* The SVG scales with its box, so a name set in its units would grow
       with the dial. The size is set from the measured box instead: 11px on
       a short screen's dial, 12px from a 440px one. */
    const fit = () => {
      const d = el.clientWidth;
      if (!d) return;
      const px = Math.min(12, Math.max(11, d / 36.6));
      el.style.setProperty("--dial-fs", `${((px * 100) / d).toFixed(3)}px`);
    };

    const angleNow = (now: number) => {
      const x = (now - t0) / TURN;
      return x >= 1 ? to : from + (to - from) * eased(x);
    };

    const light = (i: number) => {
      active = i;
      links.forEach((l, j) => l.toggleAttribute("data-on", j === i));
      cues.forEach((c, j) => c.toggleAttribute("data-on", j === i));
    };

    /** Bring stage `i` up under the marker, the short way round. */
    const turn = (i: number) => {
      let d = (((-i * unit - rot) % 360) + 360) % 360;
      if (d >= 180) d -= 360;
      if (d === 0) {
        light(i);
        return;
      }
      const now = performance.now();
      const a0 = reduce ? rot : angleNow(now);
      const a1 = rot + d;
      links.forEach((l, j) => {
        const p = reduce ? -1 : crossing(j * unit + a0, j * unit + a1);
        const delay = p < 0 ? 0 : Math.max(0, timeOf(p) * TURN - FADE / 2);
        l.style.setProperty("--flip-delay", `${Math.round(delay)}ms`);
        l.toggleAttribute("data-low", low(j * unit + a1));
      });
      turning?.cancel();
      spin.style.transform = `rotate(${a1}deg)`;
      if (!reduce) {
        turning = spin.animate(
          [{ transform: `rotate(${a0}deg)` }, { transform: `rotate(${a1}deg)` }],
          { duration: TURN, easing: EASE },
        );
      }
      from = a0;
      to = a1;
      t0 = now;
      rot = a1;
      light(i);
    };

    /* -- the timer ------------------------------------------------------ */
    const held = () => pointerIn || focusIn || !onScreen || document.hidden;
    const sync = () => {
      const h = held();
      el.toggleAttribute("data-held", h);
      if (!timer) return;
      if (h) timer.pause();
      else if (timer.playState === "paused") timer.play();
    };
    /* The arc fills across the slot, holds full for a beat while it fades,
       and the turn starts as it goes. */
    const run = (delay = 0) => {
      timer?.cancel();
      timer = null;
      if (reduce || stopped) return;
      timer = bar.animate(
        [
          { strokeDashoffset: "1px", opacity: 0 },
          { strokeDashoffset: "0.97px", opacity: 1, offset: 0.04 },
          { strokeDashoffset: "0px", opacity: 1, offset: 0.93 },
          { strokeDashoffset: "0px", opacity: 0, offset: 1 },
        ],
        { duration: DWELL, delay, easing: "linear" },
      );
      timer.onfinish = () => {
        timer = null;
        turn((active + 1) % count);
        run();
      };
      sync();
    };

    /* -- input ---------------------------------------------------------- */
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const u = r.width / 100;
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(x, y) / u;
      const inside = dist <= 50;
      if (inside !== pointerIn) {
        pointerIn = inside;
        sync();
      }
      let s = -1;
      if (dist >= R_BI && dist <= R_BO) {
        const deg = (Math.atan2(x, -y) * 180) / Math.PI;
        s = ((Math.round(deg / unit) % count) + count) % count;
      }
      if (s === place) return;
      place = s;
      raised = false;
      window.clearTimeout(hoverT);
      if (s < 0) return;
      hoverT = window.setTimeout(() => {
        // The stage at that place on screen, wherever the bezel is going.
        const i = (((s - Math.round(rot / unit)) % count) + count) % count;
        if (i !== active) {
          turn(i);
          run();
          raised = true;
        }
      }, HOVER);
    };
    const onLeave = () => {
      pointerIn = false;
      place = -1;
      raised = false;
      window.clearTimeout(hoverT);
      sync();
    };
    /* Only a key's focus turns the dial. Chrome and Firefox also focus a link
       on a mouse press, and turning then would swing the dial under the press
       — the pointer has its own way of turning it (`onMove`). */
    const keyed = (link: Element) => {
      try {
        return link.matches(":focus-visible");
      } catch {
        return true;
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      focusIn = true;
      const link = (e.target as Element | null)?.closest("[data-stage]");
      const i = link ? links.indexOf(link as SVGAElement) : -1;
      if (link && i >= 0 && i !== active && keyed(link)) {
        turn(i);
        run();
      }
      sync();
    };
    const onFocusOut = (e: FocusEvent) => {
      if (e.relatedTarget instanceof Node && el.contains(e.relatedTarget)) return;
      focusIn = false;
      sync();
    };
    /** Opens a stage as a click on its link would: through the page's smooth
        scroll where there is one (it takes in-page links at the document),
        natively where there is not. */
    const follow = (link: SVGAElement) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const taken = !link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      if (!taken && window.location.hash !== href) window.location.hash = href;
    };
    const onClick = (e: MouseEvent) => {
      window.clearTimeout(hoverT);
      /* Resting on a stage turned it up into the slot, and so put its
         neighbour under a pointer that has not moved. The click is for the
         stage that came up — it is the one lit and named in the readout — so
         a pointer click there opens it, not the name that slid in beneath.
         Only a pointer's: a key's click (`detail` 0) is on the focused link,
         which focus has already brought up. */
      const link = (e.target as Element | null)?.closest("[data-stage]");
      if (raised && e.detail > 0 && link && link !== links[active]) {
        e.preventDefault();
        e.stopPropagation();
        follow(links[active]);
      }
      if (stopped) return;
      stopped = true;
      timer?.cancel();
      timer = null;
      el.setAttribute("data-stopped", "");
    };
    const onVisibility = () => sync();

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    el.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibility);
    run(FIRST);

    return () => {
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      el.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(hoverT);
      timer?.cancel();
      turning?.cancel();
    };
  }, [n]);

  const timerPath = arc(R_TIMER, -TIMER_HALF, TIMER_HALF);
  const tickStep = (2 * Math.PI * R_TICK) / TICKS;

  return (
    /* The band the hero leaves beside its copy: below the header, above the
       rail. A size container, so the dial is measured against it. */
    <div className="pointer-events-none absolute inset-x-0 top-[var(--hero-top)] bottom-[var(--hero-pad)] hidden [container-type:size] lg:block">
      <div className="absolute top-1/2 right-[max(var(--gutter),calc((100cqw_-_82.5rem)/2_+_var(--gutter)))] flex -translate-y-1/2 flex-col items-center">
        {/* The dial's size is the only number the layout sets. 3rem is the
            readout under it (mt-3 + h-6) and 6px more either side, so dial
            and readout stand 24px or more clear of the header and the rail;
            `min(100cqw, 82.5rem) - 2 gutters - --hero-copy-w - 1.5rem` is
            the width right of the copy's measure (PageHero's), less 24px —
            from xl the measure is 44rem and this is the old `- 49.5rem`. */}
        <div
          ref={dial}
          className="dial dial-in pointer-events-auto relative size-[min(28rem,calc(100cqh_-_3rem),calc(min(100cqw,82.5rem)_-_2_*_var(--gutter)_-_var(--hero-copy-w)_-_1.5rem))] 2xl:size-[min(30rem,calc(100cqh_-_3rem),calc(min(100cqw,82.5rem)_-_2_*_var(--gutter)_-_var(--hero-copy-w)_-_1.5rem))]"
        >
          <div aria-hidden className="dial-bloom pointer-events-none absolute -inset-[16%] rounded-full" />

          {/* ---- the frame: everything that holds still ---------------- */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 size-full overflow-visible text-on-panel"
          >
            <defs>
              {/* The bezel's glass, lit from above: the core's pale blue at
                  the top, nearly clear through the middle. */}
              <linearGradient id={id("glass")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8cc8fa" stopOpacity="0.14" />
                <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.035" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0.06" />
              </linearGradient>
              {/* Its faint inner shadow: the void at both edges of the band,
                  gone a quarter of the way in. */}
              <radialGradient id={id("shade")} gradientUnits="userSpaceOnUse" cx="50" cy="50" r={R_BO}>
                <stop offset={fix(R_BI / R_BO)} stopColor="#05080d" stopOpacity="0.6" />
                <stop offset={fix((R_BI + 3.2) / R_BO)} stopColor="#05080d" stopOpacity="0" />
                <stop offset={fix((R_BO - 1.8) / R_BO)} stopColor="#05080d" stopOpacity="0" />
                <stop offset="1" stopColor="#05080d" stopOpacity="0.4" />
              </radialGradient>
              {/* The outer hairline catches the light at the top; the inner
                  one, the lip of the groove, at the foot. */}
              <linearGradient id={id("rim")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
                <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0.22" />
              </linearGradient>
              <linearGradient id={id("lip")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0.24" />
              </linearGradient>
              {/* The slot's light, centred on the name that stops in it. The
                  brand blue's two stops (`--grad-primary`). */}
              <radialGradient id={id("slot")} gradientUnits="userSpaceOnUse" cx="50" cy={fix(50 - R_T)} r="15">
                <stop offset="0" stopColor="#008eff" stopOpacity="0.34" />
                <stop offset="0.6" stopColor="#1972b9" stopOpacity="0.12" />
                <stop offset="1" stopColor="#1972b9" stopOpacity="0" />
              </radialGradient>
              {/* The inner disc: dark glass, a little blue where the light
                  falls on it. */}
              <radialGradient id={id("disc")} cx="0.5" cy="0.3" r="0.75">
                <stop offset="0" stopColor="#163460" stopOpacity="0.62" />
                <stop offset="0.55" stopColor="#0a1322" stopOpacity="0.9" />
                <stop offset="1" stopColor="#05080d" stopOpacity="0.96" />
              </radialGradient>
              {/* The marker's glow: `--accent`, as light. */}
              <radialGradient id={id("mark")}>
                <stop offset="0.15" stopColor="#fec00f" stopOpacity="0.5" />
                <stop offset="1" stopColor="#fec00f" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* A tick every six degrees… */}
            <circle
              cx="50"
              cy="50"
              r={R_TICK}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth={TICK_LEN}
              strokeDasharray={`${TICK_W} ${fix(tickStep - TICK_W)}`}
              strokeDashoffset={TICK_W / 2}
            />
            {/* …and a long one at each stage. Twelve o'clock is the
                marker's. */}
            {stages.map((s, i) =>
              i === 0 ? null : (
                <path
                  key={s.key}
                  d={`M ${at(R_LONG_IN, i * step)} L ${at(R_LONG_OUT, i * step)}`}
                  stroke="currentColor"
                  strokeOpacity="0.42"
                  strokeWidth="1"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ),
            )}

            {/* The bezel: a dark body, so no star shows through behind a
                name, then its glass, its shade, and the slot. */}
            <path d={annulus(R_BO, R_BI)} fillRule="evenodd" className="fill-void/60" />
            <path d={annulus(R_BO, R_BI)} fillRule="evenodd" fill={`url(#${id("glass")})`} />
            <path d={annulus(R_BO, R_BI)} fillRule="evenodd" fill={`url(#${id("shade")})`} />
            <path d={sector(-step / 2, step / 2, R_BI, R_BO)} fill={`url(#${id("slot")})`} />
            {[-step / 2, step / 2].map((a) => (
              <path
                key={a}
                d={`M ${at(R_BI + 0.4, a)} L ${at(R_BO - 0.4, a)}`}
                stroke="currentColor"
                strokeOpacity="0.28"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <circle
              cx="50"
              cy="50"
              r={R_BO}
              fill="none"
              stroke={`url(#${id("rim")})`}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="50"
              cy="50"
              r={R_BI}
              fill="none"
              stroke={`url(#${id("lip")})`}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />

            {/* The timer: a track across the slot, and the arc that fills
                it. `pathLength` 1, so the fill is a share of the dwell —
                and its stroke scales with the dial, because browsers do not
                agree on which space a non-scaling stroke's dashes are
                measured in. Hidden until the first dwell starts. */}
            <g className="dial-timer">
              <path
                d={timerPath}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.14"
                strokeWidth="0.4"
                strokeLinecap="round"
              />
              <path
                ref={fill}
                d={timerPath}
                pathLength={1}
                fill="none"
                opacity="0"
                strokeDasharray="1 1"
                strokeDashoffset="1"
                strokeWidth="0.55"
                strokeLinecap="round"
                className="stroke-accent"
              />
            </g>

            {/* The marker: a notch of amber pointing at the slot. Amber is
                light on this ground, not type on a light one. */}
            <circle cx="50" cy={fix(50 - (R_MARK_TIP + R_MARK_BASE) / 2)} r="4.4" fill={`url(#${id("mark")})`} />
            <path
              d={`M ${at(R_MARK_TIP, 0)} L ${fix(50 + MARK_HALF)} ${fix(50 - R_MARK_BASE)} L ${fix(50 - MARK_HALF)} ${fix(50 - R_MARK_BASE)} Z`}
              className="fill-accent stroke-accent"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />

            {/* The inner disc, and a fine orbit in it. */}
            <circle cx="50" cy="50" r={R_DISC} fill={`url(#${id("disc")})`} />
            <circle
              cx="50"
              cy="50"
              r={R_DISC}
              fill="none"
              stroke={`url(#${id("rim")})`}
              strokeOpacity="0.5"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="50"
              cy="50"
              r={R_ORBIT}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.14"
              strokeWidth="0.28"
              strokeDasharray="0.3 1.6"
              strokeLinecap="round"
            />
          </svg>

          <nav aria-label={label}>
            {/* The core: the module, and a door to the top of its
                capabilities. */}
            <a
              href={`#${target}`}
              style={{ width: `${R_CORE * 2}%`, height: `${R_CORE * 2}%` }}
              className="dial-core absolute top-1/2 left-1/2 z-10 grid -translate-x-1/2 -translate-y-1/2 place-content-center justify-items-center rounded-pill text-center text-on-panel focus-visible:outline-white"
            >
              <Icon aria-hidden className="relative size-7" strokeWidth={1.5} />
              <span className="relative mt-2 text-sm leading-tight font-medium">
                {words.slice(0, -1).join(" ")}
                {words.length > 1 ? <br /> : null}
                {words.at(-1)}
              </span>
            </a>

            {/* ---- the bezel: the one thing that turns ------------------- */}
            <div ref={bezel} className="pointer-events-none absolute inset-0">
              <svg role="list" viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
                <defs>
                  {stages.map((s, i) => (
                    <g key={s.key}>
                      <path id={id(`cw-${i}`)} d={arc(R_T, i * step - 45, i * step + 45)} />
                      <path id={id(`ccw-${i}`)} d={arc(R_T, i * step + 45, i * step - 45, true)} />
                    </g>
                  ))}
                </defs>

                {/* A bead between each pair of stages; at rest the two
                    either side of the slot sit on its edges. */}
                {stages.map((s, i) => {
                  const p = xy(R_T, i * step + step / 2);
                  return <circle key={s.key} cx={p.x} cy={p.y} r={R_BEAD} className="fill-on-panel/35" />;
                })}

                {stages.map((s, i) => {
                  const hit = sector(i * step - step / 2 + 0.25, i * step + step / 2 - 0.25, R_BI, R_BO);
                  const ring = sector(i * step - step / 2 + 1.2, i * step + step / 2 - 1.2, R_BI + 0.9, R_BO - 0.9);
                  const name = s.stage.toUpperCase();
                  return (
                    <g key={s.key} role="listitem">
                      <a
                        href={`#stage-${s.key}`}
                        aria-label={`${pad(i)} ${s.stage} — ${s.area}`}
                        data-stage={i}
                        data-on={i === 0 ? "" : undefined}
                        data-low={low(i * step) ? "" : undefined}
                        style={{ "--i": i } as CSSProperties}
                        className="dial-link"
                      >
                        <path d={hit} fill="transparent" />
                        {/* The focus ring: the outline of the stage's own
                            sixth of the bezel, white over a blue glow
                            (#008EFF, `--grad-primary`'s light stop, which
                            has no token of its own). */}
                        <g className="dial-ring" fill="none">
                          <path
                            d={ring}
                            stroke="#008eff"
                            strokeOpacity="0.45"
                            strokeWidth="5"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                          />
                          <path
                            d={ring}
                            className="stroke-on-panel"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        {(["cw", "ccw"] as const).map((way) => (
                          <text
                            key={way}
                            textAnchor="middle"
                            className={`dial-label dial-${way} font-mono tracking-caps`}
                          >
                            <textPath href={`#${id(`${way}-${i}`)}`} startOffset="50%">
                              <tspan className="dial-idx">{pad(i)}</tspan> <tspan className="dial-name">{name}</tspan>
                            </textPath>
                          </text>
                        ))}
                      </a>
                    </g>
                  );
                })}
              </svg>
            </div>
          </nav>
        </div>

        {/* The readout: where the cycle is, and the stage's area. Hidden
            from assistive technology — every stage's link carries both. */}
        <div aria-hidden className="mt-3 grid h-6 place-items-center">
          {stages.map((s, i) => (
            <p
              key={s.key}
              data-cue
              data-on={i === 0 ? "" : undefined}
              className="dial-cue col-start-1 row-start-1 flex items-center gap-3 whitespace-nowrap"
            >
              <span className="font-mono text-[0.6875rem] tracking-caps text-on-panel/55 tabular-nums">
                <span className="text-accent">{pad(i)}</span> / {pad(n - 1)}
              </span>
              <span className="h-px w-5 bg-white/25" />
              <span className="text-sm text-on-panel">{s.area}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

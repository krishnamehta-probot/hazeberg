import type { Ref } from "react";

import { DOTS_D, DOTS_TRANSFORM, FRAME_SPAN, FRAME_TOP, VIEWBOX } from "./delivery-geo";

/** Where the land is lit from: between the two delivery centres, in the
    frame's units (`[lon, -lat]`). */
const HOT_X = 88;
const HOT_Y = -8;

/**
 * The delivery map's ground: the world's land as one field of dots, lit from
 * the two delivery centres, with the night side of the world dimmed.
 *
 * Three layers, all in the frame's degree units:
 *   - a bloom of the brand blue behind India and the Malay peninsula, wide and
 *     weak — the light the map is lit by, not a shape on it
 *   - the dots in the brand's lighter blue, dim, everywhere
 *   - the same dots again in pale blue, masked to a disc round the centres, so
 *     the land brightens towards them rather than switching on at an edge
 *
 * The two dot layers share one path through `<use>`, so the ~5,300 dots are
 * in the page once. The night mask over both is white — no effect — until an
 * effect writes the night side's outline into `night` after hydration (the
 * server cannot know the reader's minute), which then takes a third off the
 * land there; its edge is blurred four degrees either way, which is about the
 * width of real twilight on a map this size.
 *
 * Decorative throughout, and `aria-hidden`.
 */
export function DeliveryLand({ uid, night }: { uid: string; night: Ref<SVGPathElement> }) {
  const id = (s: string) => `${uid}-${s}`;
  const frame = { x: -180, y: -FRAME_TOP, width: 360, height: FRAME_SPAN };

  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="none"
      aria-hidden
      className="absolute inset-0 size-full overflow-visible"
    >
      <defs>
        <path id={id("dots")} d={DOTS_D} transform={DOTS_TRANSFORM} />

        {/* Literal stops: SVG gradients cannot read a token. The brand blue
            (#1972b9) for the bloom; white for the masks, where only the
            luminance counts. */}
        <radialGradient id={id("bloom")} gradientUnits="userSpaceOnUse" cx={HOT_X} cy={HOT_Y} r={54}>
          <stop offset="0" stopColor="#1972b9" stopOpacity="0.34" />
          <stop offset="0.45" stopColor="#1972b9" stopOpacity="0.12" />
          <stop offset="1" stopColor="#1972b9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("hot")} gradientUnits="userSpaceOnUse" cx={HOT_X} cy={HOT_Y} r={36}>
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <mask id={id("hot-mask")} maskUnits="userSpaceOnUse" {...frame}>
          <rect {...frame} fill={`url(#${id("hot")})`} />
        </mask>

        <filter
          id={id("dusk")}
          filterUnits="userSpaceOnUse"
          x={-220}
          y={-110}
          width={440}
          height={220}
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation={4} />
        </filter>
        {/* Night takes a third off the land, not half: Indian office hours
            are night across the whole Americas, and at half strength on top
            of the dim land the continent the Americas arc lands on all but
            went out. A third still reads as a shadow crossing the dots. */}
        <mask id={id("night")} maskUnits="userSpaceOnUse" {...frame}>
          <rect {...frame} fill="#ffffff" />
          <path ref={night} fill="#000000" fillOpacity={0.35} filter={`url(#${id("dusk")})`} />
        </mask>
      </defs>

      <rect {...frame} fill={`url(#${id("bloom")})`} />

      {/* Stroke widths are in the dot grid's own units (the path's transform
          scales it to degrees): 0.56 of a pitch, so a dot is a little over
          half the space it sits in at any size. Colours are literal for the
          same reason as the stops: the brand's lighter blue (`--grad-blue`'s
          first stop) and a pale blue for the lit land. The far land is at
          60%, about 2.7:1 on the void: at 50% (2.1:1) a 1.7px dot at 1280
          wide left the Americas a haze rather than a continent. */}
      <g mask={`url(#${id("night")})`} fill="none" strokeLinecap="round" strokeWidth={0.56}>
        <use href={`#${id("dots")}`} stroke="#2b8ae0" strokeOpacity={0.6} />
        <use href={`#${id("dots")}`} stroke="#b5dcff" mask={`url(#${id("hot-mask")})`} />
      </g>
    </svg>
  );
}

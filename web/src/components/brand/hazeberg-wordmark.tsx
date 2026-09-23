import type { SVGProps } from 'react';

/**
 * Hazeberg wordmark. Recovered from the live site (design/hazeberg-logo-source.svg).
 * Every path inherits currentColor, so the lockup recolours per surface —
 * ink on the light header, white over photography. Never hardcode a fill here.
 *
 * The viewBox is TIGHT to the glyphs, and deliberately so. The source file's
 * box is `0 0 300 78`, but the artwork only occupies x 55.5-254.7, y 5.1-66.0 —
 * 18.5% dead space on the left, 15.1% on the right, and an uneven 6.5%/15.4%
 * top-to-bottom. Rendered from the original box the wordmark can never line up
 * with anything to its left and always floats high in its container. Cropping
 * to the real bounds makes the element box and the ink the same rectangle, so
 * `items-center` genuinely centres it and a shared left edge is a shared left
 * edge.
 *
 * Consequence: the aspect ratio is 3.271:1, not 3.846:1. Sizing by height,
 * a tight box renders ~28% larger than the padded one did — the call sites
 * already account for this.
 */
export function HazebergWordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="55.5 5.1 199.2 60.9"
      role="img"
      aria-label="Hazeberg"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <g transform="translate(0.000000,78.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none"> <path d="M1185 717 c-59 -17 -85 -35 -79 -52 5 -13 11 -12 39 5 40 24 120 27 172 5 30 -13 43 -13 65 -4 28 11 37 32 18 44 -6 3 -13 -1 -16 -9 -8 -20 -32 -20 -70 -2 -44 21 -85 25 -129 13z"/> <path d="M1310 640 c-19 -3 -46 -13 -60 -20 -25 -14 -25 -15 -3 -18 12 -2 31 2 42 7 33 18 103 12 146 -12 36 -21 43 -21 68 -9 48 24 51 63 3 41 -19 -9 -35 -9 -63 -1 -56 16 -94 20 -133 12z"/> <path d="M912 561 c-43 -17 -65 -38 -56 -52 2 -4 30 4 61 17 52 23 61 24 102 13 26 -7 54 -19 63 -27 15 -12 23 -11 72 12 68 32 84 32 153 0 32 -15 58 -23 62 -17 3 5 14 12 24 16 20 7 23 37 4 37 -7 0 -18 -5 -24 -11 -8 -8 -29 -5 -77 11 l-66 23 -65 -22 c-60 -19 -68 -20 -95 -6 -46 24 -109 26 -158 6z"/> <path d="M559 528 c0 -2 -1 -74 -2 -160 -2 -124 1 -159 11 -163 25 -10 32 6 32 74 l0 68 63 -1 62 -1 -3 -61 c-3 -45 0 -63 12 -73 31 -26 36 -2 36 160 0 150 -1 159 -19 159 -26 0 -33 -26 -26 -89 l6 -51 -66 0 -65 0 0 70 c0 63 -2 70 -20 70 -11 0 -20 -1 -21 -2z"/> <path d="M1537 516 c-9 -24 10 -241 23 -262 20 -33 49 -46 98 -46 41 0 51 5 79 36 83 90 0 221 -119 189 l-40 -11 6 38 c3 21 3 46 0 54 -8 20 -40 21 -47 2z m177 -151 c21 -33 20 -57 -5 -89 -44 -56 -139 -13 -125 57 8 42 27 56 72 57 33 0 45 -5 58 -25z"/> <path d="M1078 433 c-7 -9 -7 -17 3 -29 10 -12 23 -14 61 -9 29 4 48 3 48 -3 0 -5 -29 -40 -65 -76 -55 -56 -64 -70 -55 -85 8 -16 24 -20 87 -23 85 -4 115 4 107 27 -5 11 -23 15 -70 15 -35 0 -64 2 -64 5 0 3 29 36 65 72 62 63 80 99 53 108 -36 11 -160 10 -170 -2z"/> <path d="M1365 438 c-41 -15 -59 -32 -80 -78 -20 -45 -14 -70 34 -122 48 -54 163 -30 185 38 4 13 1 26 -7 32 -10 8 -19 3 -41 -24 -25 -31 -32 -35 -69 -32 -22 2 -42 8 -44 13 -2 6 33 27 77 48 91 43 99 59 49 101 -17 14 -34 26 -39 26 -5 0 -14 2 -22 4 -7 3 -26 0 -43 -6z m69 -44 c27 -10 18 -20 -37 -48 -60 -29 -77 -32 -77 -13 0 23 24 47 55 56 39 12 41 12 59 5z"/> <path d="M1887 440 c-15 -3 -41 -18 -57 -33 -26 -25 -30 -36 -30 -84 0 -48 4 -58 30 -83 35 -32 60 -39 110 -28 53 11 102 83 70 103 -5 3 -24 -10 -41 -30 -27 -31 -37 -36 -68 -33 -45 4 -48 29 -6 43 17 6 47 20 68 33 21 12 42 22 48 22 19 0 8 32 -22 60 -34 31 -60 39 -102 30z m57 -46 c20 -8 21 -34 1 -34 -8 0 -30 -9 -50 -20 -37 -21 -65 -26 -65 -11 0 20 43 60 68 64 15 2 28 5 29 6 1 0 8 -2 17 -5z"/> <path d="M2114 439 c-44 -13 -56 -44 -58 -146 -1 -82 0 -88 19 -88 18 0 20 8 25 90 5 87 6 90 30 93 33 4 54 31 39 49 -13 15 -12 15 -55 2z"/> <path d="M2272 441 c-61 -17 -105 -98 -85 -158 19 -58 113 -93 159 -58 45 34 48 -2 3 -39 -38 -33 -57 -33 -104 0 -25 17 -41 22 -48 15 -27 -27 44 -81 106 -81 30 0 45 8 77 40 40 40 40 41 40 115 0 87 -12 119 -54 144 -40 24 -66 30 -94 22z m87 -80 c27 -37 26 -43 -5 -80 -46 -55 -124 -29 -124 41 0 44 25 68 71 68 30 0 42 -6 58 -29z"/> <path d="M860 423 c-41 -28 -49 -45 -50 -100 0 -44 4 -56 31 -82 26 -26 38 -31 79 -31 30 0 50 5 53 13 3 9 10 7 25 -6 11 -11 25 -16 30 -13 5 3 10 42 11 87 1 79 1 81 -33 115 -28 28 -41 34 -78 34 -25 0 -54 -7 -68 -17z m116 -50 c19 -25 17 -83 -3 -105 -22 -25 -71 -23 -100 4 -27 26 -30 73 -6 100 22 24 91 25 109 1z"/> <path d="M2471 251 c-30 -42 -26 -49 24 -49 50 0 52 2 29 46 -19 39 -27 40 -53 3z"/> </g>
    </svg>
  );
}

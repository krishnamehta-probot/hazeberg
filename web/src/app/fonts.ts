import { Manrope, Space_Mono } from "next/font/google";

/**
 * Manrope + Space Mono — the pairing from fmi-industries, one of the four
 * reference sites. Three of those four pair a neutral grotesk with a monospace
 * for micro-labels; of the four pairings this is the only one that is freely
 * licensed (Suisse Intl, Neue Haas Grotesk and stageGrotesk are all commercial).
 *
 * Manrope carries everything. Space Mono appears only at eyebrow scale — caps,
 * tracked, small — which is exactly how the references use their monos.
 *
 * `next/font` self-hosts both, so the browser never talks to Google.
 *
 * In their own module because two documents use them: the root layout, and
 * `global-not-found.tsx`, which bypasses every layout.
 */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

/** The classes that put both font variables on `<html>`. */
export const fontVariables = `${manrope.variable} ${spaceMono.variable}`;

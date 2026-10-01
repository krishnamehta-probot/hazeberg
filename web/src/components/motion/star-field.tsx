"use client";

import { useEffect, useRef } from "react";

/**
 * A still field of stars, drawn once — the ground for an opener whose subject
 * is a globe, where the inner pages' arc of light would be a second light
 * source fighting the first.
 *
 * Deliberately sparse and deliberately still. A twinkling field is a
 * screensaver; a still one is depth. Density scales with the frame's area so a
 * phone and a wide screen read the same, and the generator is seeded, so the
 * sky is the same on every visit and does not reshuffle on resize.
 *
 * Mostly white, a few in the brand's blue and fewer in its amber — the same
 * three lights as the rest of the site, at the scale of a pinprick.
 */
const TINTS = [
  [255, 255, 255],
  [0, 142, 255],
  [254, 192, 15],
] as const;

export function StarField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let drawn = "";
    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const key = `${w}x${h}@${dpr}`;
      if (key === drawn) return;
      drawn = key;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      let seed = 20261001;
      const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const count = Math.round((w * h) / 4800);
      for (let i = 0; i < count; i++) {
        const x = rand() * w;
        const y = rand() * h;
        const big = rand() > 0.94;
        const r = big ? 0.9 + rand() * 0.6 : 0.35 + rand() * 0.55;
        const alpha = big ? 0.55 + rand() * 0.35 : 0.12 + rand() * 0.45;
        const pick = rand();
        const [cr, cg, cb] = pick > 0.97 ? TINTS[2] : pick > 0.86 ? TINTS[1] : TINTS[0];
        ctx.fillStyle = `rgb(${cr} ${cg} ${cb} / ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}

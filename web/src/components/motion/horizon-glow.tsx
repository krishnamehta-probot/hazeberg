"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's light: an arc of glow sweeping across the lower frame, blue on the
 * left and amber on the right. A WebGL fragment shader, not a photograph.
 *
 * Why an arc rather than a burst. A radial starburst puts its brightest point in
 * the middle of the frame, which is exactly where the headline wants to be, so
 * the type has to move out of the way of the picture. An arc keeps all of its
 * energy on one curve low in the frame and leaves the whole centre clear.
 *
 * It is also the one place both brand colours belong together. The ramp runs
 * blue, through a near-white break, into amber — the two ends of the palette in
 * a single light source rather than two accents competing.
 *
 * Raw WebGL rather than a renderer dependency: one full-screen triangle and one
 * shader is less code than the wrapper would have been.
 *
 * Four ways it gives up cheaply, all of which matter more than the effect:
 *   - prefers-reduced-motion draws a single frame and takes no input at all
 *   - off-screen or a hidden tab cancels the loop entirely
 *   - nothing ever resizes the drawing buffer while scrolling; re-allocating it
 *     per frame is what made an earlier version flicker
 *   - no WebGL, or a lost context, leaves the section's own background showing,
 *     which is the same deep navy the shader resolves to
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/**
 * The arc is a TRUE CIRCLE — the bottom of a large one centred above the frame.
 *
 * It was a parabola first, and that is exactly why it would not read as a circle
 * on a phone: a parabola's curvature is fixed while its chord narrows, so the
 * same equation that looks like a horizon at 1440px wide flattens into a swoosh
 * at 390px. A circle whose RADIUS is tied to the viewport width keeps the same
 * share of the circle on screen at any width, which is what makes it one shape
 * rather than two different curves.
 *
 * Everything is computed in aspect-corrected space — x in units of height — so
 * the circle is a circle on screen and not an ellipse.
 *
 * Grain is part of the shader rather than a CSS layer on top. Overlaying noise
 * with mix-blend-mode over a canvas is exactly the kind of thing that resolves
 * against the wrong backdrop; done here it is just addition.
 */
const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uHot;     // 0..1 - x of the bright spot on the rim
uniform float uRad;     // circle radius, in units of viewport height
uniform float uBase;    // where the arc bottoms out, up from the foot
uniform float uShift;   // parallax, in units of viewport height
uniform float uEnergy;  // 0..1 - how fast the pointer is moving
uniform float uPulseT;  // 0..1 - a click travelling out along the rim
uniform float uPulseX;  // where that click landed
uniform float uFlip;    // 1 = show the TOP of the circle instead of the bottom

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2  uv = gl_FragCoord.xy / uRes;
  float ar = uRes.x / uRes.y;

  float px = (uv.x - 0.5) * ar + uShift;
  // Mirroring y is the whole flip: the circle's centre moves from above the frame
  // to below it, so what is on screen is its TOP edge — a dome coming down rather
  // than a horizon coming up. Everything downstream is written in py, so the
  // base, the falloff and the half-mask all turn over with it.
  float py = mix(uv.y, 1.0 - uv.y, uFlip);

  // Signed distance to the circle: negative above the arc, positive below.
  float cy = uBase + uRad + sin(uTime * 0.11) * 0.008;
  float sd = length(vec2(px, py - cy)) - uRad;

  // The rim itself - a thin hot line.
  float rim = exp(-sd * sd * 9000.0);

  // Soft bleed, and the asymmetry IS the effect: it travels a long way into the
  // frame and dies fast going off the edge.
  //
  // Which direction that is turns over with the flip, and the rates have to turn
  // over with it. Left alone, the flipped dome put its long bleed pointing DOWN
  // the screen, straight onto the copy — the eyebrow measured 1.00:1 and the
  // headline 1.02:1, white type on a near-white arc. Swapped, the dome hugs the
  // top edge and fades away from the words instead of onto them.
  float inRate  = mix(7.6, 22.0, uFlip);
  float outRate = mix(22.0, 7.6, uFlip);
  float up   = exp(-max(-sd, 0.0) * inRate);
  float down = exp(-max( sd, 0.0) * outRate);
  float glow = up * down;

  // Only the BOTTOM of the circle is the picture. On a phone the radius is barely
  // half the viewport width, so the whole ring fits on screen and the top of it
  // drew a second curve straight across the headline. This fades the light out as
  // it climbs past the circle's centre, which also gives the arc's two ends a
  // taper instead of running them off the side edges at full strength.
  float lower = smoothstep(cy + 0.08, cy - 0.16, py);
  rim  *= lower;
  glow *= lower;

  // The brightest part of the curve follows the pointer.
  //
  // Tight and deep on purpose. A wide, shallow falloff was the first attempt and
  // it did nothing you could see: the rim clips to white along most of its
  // length, so modulating it by a few percent over half the screen is swallowed
  // whole. Narrowing the spot and dropping the floor is what makes the light
  // read as following the cursor — measured as the brightness centroid moving
  // 90px before, and more than three times that after.
  float hot = exp(-pow((uv.x - uHot) * 3.4, 2.0));
  rim  *= 0.26 + 1.10 * hot;
  glow *= 0.44 + 0.80 * hot;

  // Moving the pointer quickly lifts the whole rim a little. Subtle on purpose:
  // it should register as the light being alive, not as a meter.
  rim  *= 1.0 + uEnergy * 0.45;
  glow *= 1.0 + uEnergy * 0.20;

  // A click sends a bright band out along the rim in both directions and fades.
  // Guarded, so an idle page pays nothing for it.
  if (uPulseT > 0.0) {
    float travel = abs(uv.x - uPulseX) - uPulseT * 1.15;
    float band   = exp(-travel * travel * 260.0);
    float fade   = 1.0 - uPulseT;
    rim  += band * fade * 2.4;
    glow += band * fade * 0.5;
  }

  // Both brand colours in one light source: blue, through a near-white break,
  // into amber. Nothing else is allowed in the ramp.
  vec3 blue  = vec3(0.05, 0.32, 1.00);
  vec3 pale  = vec3(0.64, 0.87, 1.00);
  vec3 amber = vec3(1.00, 0.70, 0.06);

  vec3 tint = mix(blue, pale, smoothstep(0.24, 0.56, uv.x));
  tint = mix(tint, amber, smoothstep(0.60, 0.94, uv.x));

  vec3 col = tint * (glow * 0.52 + rim * 1.30);

  // Ambient haze, so the void reads as deep navy rather than dead black.
  col += vec3(0.010, 0.026, 0.060) * up * 0.70;

  float g = hash(gl_FragCoord.xy + fract(uTime) * 311.0);
  col += (g - 0.5) * 0.04;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Where the bright spot sits when nothing is pointing at it — just right of the
    centre break, so the blue and the amber both get a share of the curve. */
const REST_HOT = 0.58;
/** How long a click's pulse takes to run off the edge of the frame. */
const PULSE_SECONDS = 1.15;

export function HorizonGlow({
  className = "",
  clearance = 180,
  interactive = true,
  flip = false,
}: {
  className?: string;
  /** Off where the light is scenery rather than a thing to play with — the
      closing panel wants one calm arc, not a surface that answers back. */
  interactive?: boolean;
  /** Show the top of the circle instead of the bottom. The hero opens on a
      horizon rising out of the frame; the closing panel answers it with a dome
      coming down, and `clearance` then measures from the TOP edge. */
  flip?: boolean;
  /** Pixels at the foot of the section the curve must stay clear of — the client
      rail's solid band, plus a gap. Given in pixels rather than a fraction
      because the band is a fixed height and the viewport is not: a fixed
      fraction puts the arc inside the band on a short window. */
  clearance?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // One triangle big enough to cover the clip cube. Cheaper than a quad, and
    // it cannot show the seam two triangles can leave down the diagonal.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uHot = u("uHot");
    const uRad = u("uRad");
    const uBase = u("uBase");
    const uShift = u("uShift");
    const uEnergy = u("uEnergy");
    const uPulseT = u("uPulseT");
    const uPulseX = u("uPulseX");
    const uFlip = u("uFlip");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    /**
     * Re-allocating the drawing buffer is expensive and it flashes. This runs on
     * a real size change only — never from inside the animation loop.
     */
    const resize = () => {
      // Capped at 1.5, not at the device ratio. This is a full-screen fragment
      // shader; on a 3x phone the honest ratio is nine times the work for a
      // difference nobody can see in a field of soft light and grain.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);

      // Radius as a share of the viewport WIDTH, eased by aspect. Bigger on a
      // phone, not smaller: at half the width the circle's own turn lands inside
      // the frame and both ends rear up into a bowl. At 1.1x it is far wider than
      // the screen, so what you see is a gentle sweep — the same read as the
      // laptop, where 0.77x of a much wider screen already gives that.
      const ar = w / h;
      const t = Math.min(1, Math.max(0, (ar - 0.5) / 1.1));
      gl.uniform1f(uRad, (1.1 - 0.33 * t) * ar);
      gl.uniform1f(uBase, Math.min(0.45, Math.max(0.12, clearance / canvas.clientHeight)));
    };

    let hotTarget = REST_HOT;
    let hot = REST_HOT;
    let shiftTarget = 0;
    let shift = 0;
    let energyTarget = 0;
    let energy = 0;
    let pulseAt = -1;
    let pulseX = 0.5;
    let lastPx = -1;
    let lastPy = -1;

    let frame = 0;
    let running = false;
    let last = 0;
    let clock = 0;

    const onPointer = (e: PointerEvent) => {
      const px = e.clientX / window.innerWidth;
      const py = e.clientY / window.innerHeight;

      // Halfway towards the pointer and clamped. The light is part of the
      // composition, not a cursor toy, and it never leaves the frame.
      hotTarget = Math.min(0.92, Math.max(0.14, REST_HOT + (px - REST_HOT) * 0.55));

      // Parallax, opposite the pointer and tiny. Reading it is what sells the
      // arc as something behind the page rather than printed on it.
      shiftTarget = -(px - 0.5) * 0.045;

      if (lastPx >= 0) {
        const d = Math.hypot(px - lastPx, py - lastPy);
        // Saturates around a deliberate sweep across the screen, which ordinary
        // drifting never reaches.
        energyTarget = Math.min(1, energyTarget + d * 5.5);
      }
      lastPx = px;
      lastPy = py;
    };

    const onDown = (e: PointerEvent) => {
      pulseX = e.clientX / window.innerWidth;
      pulseAt = clock;
    };

    const paint = () => {
      gl.uniform1f(uTime, clock);
      gl.uniform1f(uHot, hot);
      gl.uniform1f(uShift, shift);
      gl.uniform1f(uEnergy, energy);
      const p = pulseAt < 0 ? 0 : (clock - pulseAt) / PULSE_SECONDS;
      gl.uniform1f(uPulseT, p > 0 && p < 1 ? p : 0);
      gl.uniform1f(uPulseX, pulseX);
      gl.uniform1f(uFlip, flip ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      clock += dt;

      // Drift, so the light breathes with nothing pointing at it.
      const drift = Math.sin(clock * 0.14) * 0.05;

      // Framerate-independent easing: the same visual lag at 60Hz and 120Hz.
      const k = 1 - Math.exp(-dt * 2.6);
      hot += (hotTarget + drift - hot) * k;
      shift += (shiftTarget - shift) * k;

      // Energy rises with the pointer and bleeds away on its own.
      energyTarget *= Math.exp(-dt * 3.4);
      energy += (energyTarget - energy) * (1 - Math.exp(-dt * 7));

      paint();
      frame = requestAnimationFrame(draw);
    };

    /**
     * Input is bound to the hero section, not to the window, and only while the
     * section is actually on screen. Two reasons: a click down in the footer has
     * no business pulsing a light nobody can see, and a pointermove handler
     * firing for the whole page is work the rest of the site should not pay for.
     */
    const host: HTMLElement = canvas.closest("section") ?? canvas;
    let bound = false;
    const bind = () => {
      if (bound || reduce || !interactive) return;
      bound = true;
      host.addEventListener("pointermove", onPointer, { passive: true });
      host.addEventListener("pointerdown", onDown, { passive: true });
    };
    const unbind = () => {
      if (!bound) return;
      bound = false;
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerdown", onDown);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = 0;
      bind();
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      unbind();
      cancelAnimationFrame(frame);
    };

    resize();

    if (reduce) {
      // One frame at rest, and no input bound at all. A click that pulses is
      // motion too, so reduced motion does not get one.
      clock = 6;
      paint();
    }

    // Scrolled past, or a backgrounded tab: stop rendering. A full-screen shader
    // running behind the footer is pure heat.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0,
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      resize();
      // Reduced motion has no loop to pick the new size up on the next frame.
      if (reduce) paint();
    });
    ro.observe(canvas);

    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      unbind();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [clearance, interactive, flip]);

  return <canvas ref={ref} aria-hidden className={className} />;
}

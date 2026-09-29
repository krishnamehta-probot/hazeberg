"use client";

import { useEffect, useRef } from "react";

/**
 * The inner pages' light — the same idea as the home page's horizon, turned
 * ninety degrees.
 *
 * The home hero is the BOTTOM of an enormous circle rising out of the foot of
 * the frame. This is the LEFT EDGE of an enormous circle standing off the right
 * side of it: one tall arc sweeping down through the right third, with the same
 * rim-and-bleed light, the same blue -> pale -> amber ramp, and the same three
 * responses to a pointer. Same light source, seen from somewhere else.
 *
 * That is the point. A different picture entirely reads as a different site; the
 * same picture again reads as a template. The circle turned on its side is a
 * family resemblance — recognisably the same hand, not the same frame reprinted.
 *
 * Why this geometry solves the overlap by construction, rather than by tuning:
 * the bleed is DELIBERATELY ASYMMETRIC. It travels a long way into the circle,
 * which is off to the right, and dies within a fraction of that going the other
 * way, which is where the copy is. The arc physically cannot brighten the type
 * column; moving the copy would break it long before the light did. `.page-scrim`
 * underneath is the belt to this pair of braces.
 *
 * Everything else matches the horizon exactly — one triangle, raw WebGL, no
 * renderer dependency, and the same four ways it gives up cheaply:
 *   - prefers-reduced-motion draws one frame and binds no input at all
 *   - off-screen or a hidden tab cancels the loop
 *   - the drawing buffer is only ever re-allocated on a real size change
 *   - no WebGL, or a lost context, leaves the section's own void showing, which
 *     is the colour the shader resolves to anyway
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uHot;     // 0..1 - y of the bright spot on the rim
uniform float uRad;     // circle radius, in units of viewport height
uniform float uCx;      // circle centre, in units of height PAST the right edge
uniform float uShift;   // parallax, in units of viewport height
uniform float uEnergy;  // 0..1 - how fast the pointer is moving
uniform float uPulseT;  // 0..1 - a click travelling along the rim
uniform float uPulseY;  // where that click landed

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2  uv = gl_FragCoord.xy / uRes;
  float ar = uRes.x / uRes.y;

  // Aspect-corrected: x measured in units of height, so the circle is a circle
  // on screen and not an ellipse.
  vec2 p = vec2(uv.x * ar, uv.y);

  // The centre sits off the right edge and breathes a little. Everything on
  // screen is therefore OUTSIDE-left of it, and sd > 0 means "towards the type".
  vec2 c = vec2(ar + uCx + uShift, 0.5 + sin(uTime * 0.09) * 0.02);
  float d  = length(p - c);
  float sd = d - uRad;

  // The rim: a thin hot line on the arc itself.
  float rim = exp(-sd * sd * 7200.0);

  // The asymmetry IS the composition. Into the circle (sd < 0, off to the right)
  // the light carries; out of it (sd > 0, towards the copy) it is gone in a
  // third of the distance. This is what keeps the type column dark.
  float inward  = exp(-max(-sd, 0.0) * 5.2);
  float outward = exp(-max( sd, 0.0) * 19.0);
  float glow = inward * outward;

  // A second, fainter ring inside the first — the arc reads as an aperture with
  // depth rather than as one drawn line.
  float sd2 = d - uRad * 0.74;
  float echo = exp(-sd2 * sd2 * 2200.0) * smoothstep(-0.55, -0.05, sd);

  // Taper at the top and bottom edges, so the arc resolves into the frame
  // instead of being cut off by it.
  float span = smoothstep(0.0, 0.20, uv.y) * smoothstep(1.0, 0.80, uv.y);
  span = 0.30 + 0.70 * span;
  rim  *= span;
  glow *= span;
  echo *= span;

  // The brightest part of the curve follows the pointer — here that is vertical,
  // because the arc is. Tight and deep for the same reason the horizon's is: the
  // rim clips to white along most of its length, so a wide shallow falloff
  // modulates something you cannot see.
  float hot = exp(-pow((uv.y - uHot) * 2.9, 2.0));
  rim  *= 0.24 + 1.15 * hot;
  glow *= 0.42 + 0.82 * hot;
  echo *= 0.30 + 1.00 * hot;

  // Moving quickly lifts the whole rim slightly — the light reading as alive,
  // not as a meter.
  rim  *= 1.0 + uEnergy * 0.45;
  glow *= 1.0 + uEnergy * 0.18;

  // A click sends a band out along the rim in both directions and fades.
  // Guarded, so an idle page pays nothing for it.
  if (uPulseT > 0.0) {
    float travel = abs(uv.y - uPulseY) - uPulseT * 1.25;
    float band   = exp(-travel * travel * 220.0);
    float fade   = 1.0 - uPulseT;
    rim  += band * fade * 2.2 * exp(-abs(sd) * 26.0);
    glow += band * fade * 0.45;
  }

  // The same three colours as the horizon, in the same order — but ramped down
  // the arc rather than across the frame, because that is the direction this
  // shape runs. Blue high, the near-white break at the waist, amber low.
  vec3 blue  = vec3(0.05, 0.32, 1.00);
  vec3 pale  = vec3(0.64, 0.87, 1.00);
  vec3 amber = vec3(1.00, 0.70, 0.06);

  vec3 tint = mix(amber, pale, smoothstep(0.06, 0.44, uv.y));
  tint = mix(tint, blue, smoothstep(0.50, 0.90, uv.y));

  vec3 col = tint * (glow * 0.50 + rim * 1.25 + echo * 0.30);

  // Ambient haze, so the void reads as deep navy rather than dead black — and
  // only on the circle's side, so it never lifts the ground under the words.
  col += vec3(0.010, 0.026, 0.060) * inward * 0.65;

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

/** Where the bright point rests — a little above the waist, so the blue half of
    the ramp leads and the amber answers from below. */
const REST_HOT = 0.58;
const PULSE_SECONDS = 1.2;

export function ApertureGlow({ className = "" }: { className?: string }) {
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
    const uCx = u("uCx");
    const uShift = u("uShift");
    const uEnergy = u("uEnergy");
    const uPulseT = u("uPulseT");
    const uPulseY = u("uPulseY");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;

    /**
     * The arc's crossing point is expressed as a FRACTION OF THE WIDTH and the
     * centre is solved for it, rather than the other way round. A fixed centre
     * offset puts the arc at 65% of a laptop and at 20% of a phone, which is the
     * difference between a light beside the copy and a light behind it.
     *
     * Narrow screens push it further right still: below an aspect of 1 the copy
     * is full width, so the arc gets the last sliver of the frame and nothing
     * more.
     */
    const resize = () => {
      // Capped at 1.5 — this is a full-screen fragment shader, and on a 3x phone
      // the honest ratio is nine times the work for a difference nobody can see
      // in a field of soft light and grain.
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

      const ar = w / h;
      // Radius in units of height. Always larger than the frame is tall, so what
      // is on screen is a gentle sweep and never a closing circle.
      const rad = 1.25;
      const cross = ar < 1 ? 0.84 : ar < 1.7 ? 0.74 : 0.66;
      gl.uniform1f(uRad, rad);
      gl.uniform1f(uCx, rad - (1 - cross) * ar);
    };

    let hotTarget = REST_HOT;
    let hot = REST_HOT;
    let shiftTarget = 0;
    let shift = 0;
    let energyTarget = 0;
    let energy = 0;
    let pulseAt = -1;
    let pulseY = 0.5;
    let lastPx = -1;
    let lastPy = -1;

    let frame = 0;
    let running = false;
    let last = 0;
    let clock = 0;

    const onPointer = (e: PointerEvent) => {
      const px = e.clientX / window.innerWidth;
      const py = 1 - e.clientY / window.innerHeight;

      // Halfway towards the pointer and clamped: the light is part of the
      // composition, not a cursor toy, and it never leaves the frame.
      hotTarget = Math.min(0.9, Math.max(0.12, REST_HOT + (py - REST_HOT) * 0.6));

      // Parallax, opposite the pointer and tiny — what sells the arc as
      // something behind the page rather than printed on it.
      shiftTarget = -(px - 0.5) * 0.05;

      if (lastPx >= 0) {
        const d = Math.hypot(px - lastPx, py - lastPy);
        energyTarget = Math.min(1, energyTarget + d * 5.5);
      }
      lastPx = px;
      lastPy = py;
    };

    const onDown = (e: PointerEvent) => {
      pulseY = 1 - e.clientY / window.innerHeight;
      pulseAt = clock;
    };

    const paint = () => {
      gl.uniform1f(uTime, clock);
      gl.uniform1f(uHot, hot);
      gl.uniform1f(uShift, shift);
      gl.uniform1f(uEnergy, energy);
      const p = pulseAt < 0 ? 0 : (clock - pulseAt) / PULSE_SECONDS;
      gl.uniform1f(uPulseT, p > 0 && p < 1 ? p : 0);
      gl.uniform1f(uPulseY, pulseY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      clock += dt;

      const drift = Math.sin(clock * 0.13) * 0.055;

      // Framerate-independent easing: the same visual lag at 60Hz and 120Hz.
      const k = 1 - Math.exp(-dt * 2.6);
      hot += (hotTarget + drift - hot) * k;
      shift += (shiftTarget - shift) * k;

      energyTarget *= Math.exp(-dt * 3.4);
      energy += (energyTarget - energy) * (1 - Math.exp(-dt * 7));

      paint();
      frame = requestAnimationFrame(draw);
    };

    // Input is bound to the hero section and only while it is on screen: a click
    // in the footer has no business pulsing a light nobody can see.
    const host: HTMLElement = canvas.closest("section") ?? canvas;
    let bound = false;
    const bind = () => {
      if (bound || reduce) return;
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
      clock = 6;
      paint();
    }

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
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}

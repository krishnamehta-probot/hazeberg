"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion, type MotionValue } from "motion/react";

/**
 * The About scene's sphere. A WebGL fragment shader, sized to its own square box.
 *
 * It turns with the scroll: the light sweeping across it is a function of the
 * pinned section's progress, so moving the wheel rotates the object rather than
 * moving the page. That is the whole point of the scene — the scroll drives
 * something instead of scrolling past it.
 *
 * One rule the shader enforces, and it is not cosmetic: **the centre stays
 * dark.** The point's title is set in white in the middle of this thing, and a
 * highlight that rotates underneath white type is a contrast failure on a timer.
 * A radial value cut holds the core in shadow at every angle — see the note on
 * it below, which also records what it measured before the cut existed.
 *
 * Desktop only, and mounted only when the scene is. Phones get the plain list
 * instead — a second full-time WebGL context on a phone buys nothing there.
 *
 * `prefers-reduced-motion` draws one frame at a fixed angle and never loops.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uRot;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2  uv = gl_FragCoord.xy / uRes;
  vec2  p  = (uv - 0.5) * 2.0;
  float d  = length(p);

  // Antialiased edge, in pixels rather than in uv, so it is one pixel wide at
  // any size instead of a soft halo on a small canvas and a hard step on a big one.
  float aa   = 3.0 / uRes.y;
  float mask = smoothstep(1.0, 1.0 - aa, d);
  if (mask <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float a = atan(p.y, p.x) + uRot;

  // Where the light plays. Opens early, so the hue structure runs across the
  // whole sphere rather than being squeezed into a ring at the edge.
  float outer = smoothstep(0.10, 0.80, d);

  float sweep = pow(max(0.0, cos(a)), 2.4);
  float spec  = pow(max(0.0, cos(a - 0.9)), 14.0);
  float warm  = pow(max(0.0, cos(a + 2.5)), 5.0);

  vec3 deep  = vec3(0.016, 0.026, 0.045);
  vec3 blue  = vec3(0.05, 0.42, 1.00);
  vec3 cyan  = vec3(0.62, 0.92, 1.00);
  vec3 amber = vec3(1.00, 0.72, 0.08);

  vec3 col = deep;
  col = mix(col, blue,  sweep * outer * 0.95);
  col = mix(col, cyan,  spec  * outer * 0.85);
  col = mix(col, amber, warm  * outer * 0.50);

  // A cool rim, so the sphere separates from the page behind it.
  float rim = smoothstep(0.88, 1.0, d);
  col += mix(blue, cyan, 0.5) * rim * 0.45 * (0.35 + sweep);

  // The core is held in shadow. This is the rule that makes the white title safe
  // at every angle, and it is a VALUE cut rather than a light cut on purpose:
  // killing the light terms in the middle flattened the sphere into a dark disc
  // with a lit ring, while darkening the result keeps the hue running all the way
  // in and simply puts the middle in shade — which is what a sphere does anyway.
  //
  // Not optional, and not a matter of taste. The first version opened at 0.10 and
  // put the title's own corners on rgb(120,183,209) at 2.21:1. The title box
  // reaches d = 0.57; at that distance this leaves it around 7:1.
  col *= mix(0.05, 1.0, smoothstep(0.38, 0.88, d));

  float g = hash(gl_FragCoord.xy + fract(uTime) * 311.0);
  col += (g - 0.5) * 0.03;

  col = max(col, 0.0);
  // Premultiplied: the context keeps its default alpha handling, and anything
  // else fringes the edge against the page.
  gl_FragColor = vec4(col * mask, mask);
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

/** How far the sphere turns across the whole pin. Just under a full turn: a
    complete revolution lands back where it started and reads as no movement. */
const TRAVEL = Math.PI * 1.7;

export function Blob({
  progress,
  className = "",
}: {
  /** The pinned section's 0..1 progress. Read per frame rather than subscribed
      to, so the rotation is sampled at the framerate and not at the scroll's. */
  progress?: MotionValue<number>;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
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

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRot = gl.getUniformLocation(prog, "uRot");

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    let frame = 0;
    let running = false;
    let last = 0;
    let clock = 0;
    let rot = 0;

    const paint = () => {
      gl.uniform1f(uTime, clock);
      gl.uniform1f(uRot, rot);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      clock += dt;

      // Scroll sets the angle; a slow idle turn keeps it alive at either end of
      // the pin, where the progress is not moving at all.
      const target = (progress?.get() ?? 0) * TRAVEL + clock * 0.06;
      rot += (target - rot) * (1 - Math.exp(-dt * 6));

      paint();
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();
    if (reduce) {
      rot = 0.6;
      paint();
    }

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0,
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
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
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [progress, reduce]);

  return <canvas ref={ref} aria-hidden className={className} />;
}

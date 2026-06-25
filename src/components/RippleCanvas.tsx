"use client";

import { useEffect, useRef } from "react";

/* ─── GLSL shaders ──────────────────────────────────────────────────── */

const VERT = `
attribute vec2 a_pos;
varying   vec2 v_uv;
void main() {
  v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// Edge-warp shader: ONLY displaces pixels near the 4 borders.
// Creates the "edge going slightly in and out" effect when cursor moves over.
const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2      u_mouse;   // cursor UV (0..1)
uniform float     u_amp;     // 0 = quiet, >0 = active
uniform float     u_time;
uniform vec2      u_aspect;  // (w/h, 1.0)
varying vec2      v_uv;

void main() {
  vec2 uv = v_uv;

  if (u_amp < 0.004) {
    gl_FragColor = texture2D(u_tex, uv);
    return;
  }

  // Distance to each edge (0 = at edge, positive = inside image)
  float dL = uv.x;
  float dR = 1.0 - uv.x;
  float dT = 1.0 - uv.y;
  float dB = uv.y;
  float dEdge = min(min(dL, dR), min(dT, dB));

  // Mask: only pixels within ~9% of any edge get displaced
  float edgeMask = 1.0 - smoothstep(0.0, 0.09, dEdge);
  if (edgeMask < 0.001) {
    gl_FragColor = texture2D(u_tex, uv);
    return;
  }

  // Aspect-corrected distance from cursor
  vec2 d = (uv - u_mouse) * u_aspect;
  float cursorDist = length(d);

  // Wave emanating from cursor outward, attenuated by distance
  float wave        = sin(cursorDist * 16.0 - u_time * 5.5);
  float cursorDecay = exp(-cursorDist * 2.2);   // wide reach across image

  // Push edge pixels perpendicular to their edge (toward center = inward)
  vec2 toCenter = normalize(vec2(0.5) - uv + 0.0001);

  float disp = wave * cursorDecay * edgeMask * u_amp * 0.045;
  vec2 displaced = uv + toCenter * disp;

  gl_FragColor = texture2D(u_tex, displaced);
}`;

/* ─── Helpers ────────────────────────────────────────────────────────── */

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

/* ─── Component ──────────────────────────────────────────────────────── */

interface Props {
  src:        string;
  alt:        string;
  className?: string;
  style?:     React.CSSProperties;
}

export default function RippleCanvas({ src, alt, className, style }: Props) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    /* ── WebGL setup ── */
    const gl = canvas.getContext("webgl", {
      antialias: false, alpha: false, premultipliedAlpha: false,
    });
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1,  1,-1,  -1,1,  1,1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTex    = gl.getUniformLocation(prog, "u_tex");
    const uMouse  = gl.getUniformLocation(prog, "u_mouse");
    const uAmp    = gl.getUniformLocation(prog, "u_amp");
    const uTime   = gl.getUniformLocation(prog, "u_time");
    const uAspect = gl.getUniformLocation(prog, "u_aspect");

    /* ── Texture ── */
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE,
      new Uint8Array([200, 200, 200]));

    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    };
    image.src = src;

    /* ── Canvas resize ── */
    let cw = 0, ch = 0;
    let cachedAspW = 1; // aspect ratio cached here, updated only on resize
    const syncSize = () => {
      const r   = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nw  = Math.round(r.width  * dpr);
      const nh  = Math.round(r.height * dpr);
      if (nw === cw && nh === ch) return;
      cw = nw; ch = nh;
      canvas.width  = cw;
      canvas.height = ch;
      gl.viewport(0, 0, cw, ch);
      cachedAspW = r.width > 0 ? r.width / r.height : 1;
    };
    const ro = new ResizeObserver(syncSize);
    ro.observe(wrap);
    syncSize();

    /* ── State ── */
    let mx = 0.5, my = 0.5;
    let amp = 0, targetAmp = 0;
    let prevX = 0, prevY = 0;
    let t = 0;
    let raf = 0;

    /* ── Render loop ── */
    const render = () => {
      // syncSize() removed — ResizeObserver handles canvas resize, aspect cached there
      t += 0.016;

      targetAmp *= 0.94;
      amp += (targetAmp - amp) * 0.10;

      gl.uniform2f(uMouse,  mx, my);
      gl.uniform1f(uAmp,    amp);
      gl.uniform1f(uTime,   t);
      gl.uniform2f(uAspect, cachedAspW, 1.0); // use cached value, no layout reflow
      gl.uniform1i(uTex,    0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    /* ── Mouse tracking on the canvas ── */
    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left)  / r.width;
      my = 1.0 - (e.clientY - r.top) / r.height;

      const speed = Math.hypot(e.clientX - prevX, e.clientY - prevY);
      prevX = e.clientX;
      prevY = e.clientY;

      targetAmp = Math.min(targetAmp + speed * 0.10, 2.0);
    };

    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [src]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ ...style, position: "relative", width: "100%", height: "100%" }}
      aria-label={alt}
    >
      <canvas
        ref={canvasRef}
        style={{
          display:  "block",
          position: "absolute",
          inset:    0,
          width:    "100%",
          height:   "100%",
        }}
      />
    </div>
  );
}

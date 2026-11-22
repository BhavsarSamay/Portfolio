// All particle motion happens here, on the GPU. The CPU only updates a handful of uniforms per frame.
//   uIntro     0 → 1 once after load: particles fly in from a deep cloud and assemble, staggered
//   uProgress  0 → 1 with scroll: particles detach at different moments, swirl and scatter in depth
//   uPointer   cursor in portrait space: nearby particles part while the portrait is assembled

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uProgress;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uFade;
  uniform vec2 uPointer;
  uniform float uPointerOn;
  uniform float uTextHold; // 0 → 1 once the crisp headline has faded in under the particles

  attribute vec3 aScatter;
  attribute vec4 aData; // seed, speed, brightness, size
  attribute vec3 aColor; // the photo's colour at this particle
  attribute vec4 aText; // xyz: where this particle sits in the headline; w: 0 = stays as dust, 1 = line one, 2 = line two

  varying float vAlpha;
  varying vec3 vColor;

  mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
  // Quint in-out: a particle barely creeps at first, then sweeps away, then settles.
  float easeInOut(float t) { return t < 0.5 ? 16.0 * t * t * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 5.0) * 0.5; }

  void main() {
    float seed = aData.x;
    float speed = aData.y;
    float bright = aData.z;
    float size = aData.w;

    // Assembled state with a faint living shimmer.
    vec3 home = position;
    home.x += sin(uTime * 0.7 + seed * 61.0) * 0.0018;
    home.y += cos(uTime * 0.6 + seed * 47.0) * 0.0018;
    home.z += sin(uTime * 0.45 + seed * 13.0) * 0.008;

    // Intro: from a wide, deep cloud into the portrait. Inner particles arrive first.
    float ti = clamp((uIntro - seed * 0.42) / 0.58, 0.0, 1.0);
    float ie = 1.0 - pow(1.0 - ti, 4.0);
    vec3 cloud = aScatter * 1.6 + vec3(0.0, 0.0, -2.5);
    vec3 p = mix(cloud, home, ie);

    // Scroll burst: each particle detaches at its own moment and travels at its own speed.
    // Detachment is spread over the first ~60% of the scroll.
    float ts = clamp((uProgress * 2.2 - seed * 0.6) / 0.7, 0.0, 1.0);
    float se = easeInOut(ts);
    // Particles bound for the headline stay in a tighter, visible swirl; the rest fly wide as dust.
    float isText = step(0.5, aText.w);
    vec3 off = aScatter * se * (0.7 + speed * 0.45) * mix(1.0, 0.38, isText);
    off.xy = rot((seed - 0.5) * 2.6 * se) * off.xy;                 // organic swirl
    off.xz = rot((speed - 1.0) * 1.4 * se) * off.xz;                // tilt in depth
    off += vec3(sin(seed * 91.0 + uTime * 0.35), cos(seed * 73.0 + uTime * 0.3), 0.0) * 0.06 * se; // drift
    p += off;

    // Cursor parts the particles while the portrait is together.
    vec2 d = p.xy - uPointer;
    float dist = length(d);
    float f = uPointerOn * (1.0 - se) * ie * smoothstep(0.12, 0.0, dist);
    p.xy += (d / max(dist, 0.0001)) * f * 0.035;
    p.z += f * 0.06;

    // Mid-flight, most particles turn and converge to write the headline: the face becomes the words.
    float tt = clamp((uProgress - 0.24 - seed * 0.2) / 0.3, 0.0, 1.0);
    float te = isText * (tt < 0.5 ? 4.0 * tt * tt * tt : 1.0 - pow(-2.0 * tt + 2.0, 3.0) * 0.5); // cubic: visibly on its way sooner
    vec3 tp = aText.xyz + vec3(sin(uTime * 0.9 + seed * 50.0), cos(uTime * 0.8 + seed * 40.0), 0.0) * 0.0016;
    p = mix(p, tp, te);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Perspective size: particles flying toward the camera grow, receding ones shrink.
    // In flight particles swell a little (they catch the light); on the letters they tighten up.
    float flight = se * (1.0 - te);
    gl_PointSize = clamp(size * (1.0 + 0.7 * flight) * mix(1.0, 0.85, te) * uSize * uPixelRatio * (3.0 / -mv.z), 0.0, 42.0 * uPixelRatio);

    // Assembled: the photo's true colours at full strength. Scattered particles twinkle and dim slightly.
    float twinkle = 0.75 + 0.25 * sin(uTime * (1.2 + speed * 2.4) + seed * 80.0);
    vAlpha = ie * mix(1.0, twinkle, se) * (1.0 - se * 0.25) * uFade;
    // Once the crisp headline is in, the particles on it settle to a shimmer over the letters.
    vAlpha *= mix(1.0, 0.3 + 0.25 * twinkle, uTextHold * te);
    // Flying particles catch the light: they warm toward ivory and champagne gold so the swirling
    // cloud reads as a field of light against the black page, not as dark specks.
    float goldish = step(0.7, fract(seed * 3.17));
    vec3 lit = mix(vec3(0.93, 0.9, 0.84), vec3(0.92, 0.78, 0.52), goldish);
    vColor = mix(aColor, max(aColor, lit), se * 0.85);
    // Headline particles take the type's colours as soon as they turn toward it: ivory, muted ivory
    // for the italic line, a few in gold.
    vec3 ink = aText.w > 1.5 ? vec3(0.66, 0.64, 0.6) : vec3(0.97, 0.95, 0.9);
    ink = mix(ink, vec3(0.89, 0.77, 0.55), step(0.82, fract(seed * 7.31)));
    vColor = mix(vColor, ink, isText * smoothstep(0.0, 0.45, tt));
    vAlpha *= 1.0 + 0.35 * flight;
  }
`;

// The photo itself, on a plane in the same scene as the particles (so it sways with the camera exactly
// like them). It is shown, untouched, while the portrait is assembled and dissolves into the particles
// as soon as scrolling starts. Only its outer edges fade into the page.
export const photoVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vPos;
  void main() {
    vUv = uv;
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const photoFragmentShader = /* glsl */ `
  // keep in sync with frameFade() in sampleParticles.js
  float frameFade(vec2 uv) {
    float sides = smoothstep(0.0, 0.16, uv.x) * smoothstep(0.0, 0.16, 1.0 - uv.x);
    float bottom = smoothstep(0.0, 0.3, uv.y);
    float top = smoothstep(0.0, 0.05, 1.0 - uv.y);
    return sides * bottom * top;
  }
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform vec2 uPointer;
  uniform float uPointerOn;
  varying vec2 vUv;
  varying vec2 vPos;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    vec2 e = min(vUv, 1.0 - vUv);
    float edge = frameFade(vUv);
    // Near-black pixels (the photo's backdrop, ~4% luminance) turn transparent, so the page's own black
    // shows through and no rectangle is visible. Dark hair and the shirt fade into the page the same way.
    float lum = dot(tex.rgb, vec3(0.2126, 0.7152, 0.0722));
    float key = smoothstep(0.045, 0.11, lum);
    float a = uOpacity * edge * key;
    if (a < 0.003) discard;
    gl_FragColor = vec4(tex.rgb, a);
  }
`;

export const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.3, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

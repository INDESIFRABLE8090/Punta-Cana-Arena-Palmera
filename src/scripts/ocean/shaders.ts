/* Shaders GLSL de la inmersión. `SKY_GLSL` se antepone a los fragmentos que reflejan el cielo. */

export const SKY_GLSL = /* glsl */ `
uniform vec3 uSun;
vec3 skyColor(vec3 d) {
  float h = clamp(d.y, 0.0, 1.0);
  vec3 horizon = vec3(1.0, 0.80, 0.66);
  vec3 mid = vec3(0.62, 0.82, 0.92);
  vec3 top = vec3(0.17, 0.47, 0.74);
  vec3 c = mix(horizon, mid, smoothstep(0.0, 0.2, h));
  c = mix(c, top, smoothstep(0.12, 0.85, h));
  float s = max(dot(normalize(d), uSun), 0.0);
  c += vec3(1.0, 0.70, 0.42) * pow(s, 6.0) * 0.32;
  c += vec3(1.0, 0.93, 0.80) * pow(s, 700.0) * 3.0;
  return c;
}
`;

export const skyVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const skyFragment = /* glsl */ `
varying vec3 vDir;
void main() {
  gl_FragColor = vec4(skyColor(normalize(vDir)), 1.0);
}
`;

export const waterVertex = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;
varying vec3 vNormal;

vec3 gerstner(vec2 p, vec2 dir, float steep, float wavelength, inout vec3 tangent, inout vec3 binormal) {
  float k = 6.28318 / wavelength;
  float c = sqrt(9.8 / k) * 0.55;
  vec2 d = normalize(dir);
  float f = k * (dot(d, p) - c * uTime);
  float a = steep / k;
  tangent += vec3(-d.x * d.x * steep * sin(f), d.x * steep * cos(f), -d.x * d.y * steep * sin(f));
  binormal += vec3(-d.x * d.y * steep * sin(f), d.y * steep * cos(f), -d.y * d.y * steep * sin(f));
  return vec3(d.x * a * cos(f), a * sin(f), d.y * a * cos(f));
}

void main() {
  // El plano viaja con la cámara; las olas se calculan en coordenadas de mundo.
  vec3 p = vec3(position.x + modelMatrix[3].x, 0.0, -position.y + modelMatrix[3].z);
  vec3 tangent = vec3(1.0, 0.0, 0.0);
  vec3 binormal = vec3(0.0, 0.0, 1.0);
  vec2 q = p.xz;
  p += gerstner(q, vec2(1.0, 0.35), 0.13, 19.0, tangent, binormal);
  p += gerstner(q, vec2(0.25, 1.0), 0.11, 11.0, tangent, binormal);
  p += gerstner(q, vec2(-0.6, 0.75), 0.09, 6.3, tangent, binormal);
  p += gerstner(q, vec2(0.8, -0.5), 0.07, 3.7, tangent, binormal);
  vNormal = normalize(cross(binormal, tangent));
  vWorld = p;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`;

export const waterFragment = /* glsl */ `
uniform float uTime;
uniform float uUnder;
uniform vec3 uFog;
varying vec3 vWorld;
varying vec3 vNormal;

void main() {
  vec3 toCam = cameraPosition - vWorld;
  float dist = length(toCam);
  vec3 v = toCam / dist;
  vec2 p = vWorld.xz;
  float t = uTime;

  // Rizado fino para el brillo del sol; se atenúa con la distancia para evitar parpadeo.
  float detail = 1.0 / (1.0 + dist * 0.045);
  vec2 r = vec2(
    sin(p.x * 1.7 + t * 1.3) + sin(p.y * 2.3 - t * 1.1) + sin((p.x + p.y) * 3.1 + t * 1.7),
    cos(p.x * 2.1 - t * 1.2) + cos(p.y * 1.9 + t * 1.4) + cos((p.x - p.y) * 2.7 - t * 1.5));
  vec3 n = normalize(vNormal + vec3(r.x, 0.0, r.y) * 0.05 * detail);

  vec3 col;
  if (uUnder < 0.5) {
    float fres = 0.025 + 0.975 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
    vec3 rd = reflect(-v, n);
    rd.y = abs(rd.y);
    vec3 refl = skyColor(rd);
    vec3 shallow = vec3(0.09, 0.80, 0.78);
    vec3 deep = vec3(0.02, 0.33, 0.47);
    vec3 body = mix(shallow, deep, smoothstep(4.0, 80.0, dist));
    body += vec3(0.10, 0.34, 0.28) * smoothstep(0.05, 0.55, vWorld.y) * 0.6;
    col = mix(body, refl, fres);
    vec3 h = normalize(uSun + v);
    col += vec3(1.0, 0.86, 0.66) * pow(max(dot(n, h), 0.0), 260.0) * 1.7;
    // Bruma: el mar se funde con el cielo en el horizonte.
    vec3 haze = skyColor(normalize(vec3(-v.x, 0.015, -v.z)));
    col = mix(col, haze, smoothstep(90.0, 250.0, dist));
  } else {
    // Desde abajo: ventana de Snell (cielo refractado) rodeada de reflexión interna.
    vec3 nd = -n;
    vec3 i = -v;
    float cosi = max(dot(nd, v), 0.0);
    float k = 1.0 - 1.77 * (1.0 - cosi * cosi);
    vec3 rd = refract(i, nd, 1.33);
    vec3 windowCol = skyColor(normalize(vec3(rd.x, abs(rd.y) + 0.05, rd.z))) * vec3(0.72, 1.0, 0.98) * 1.15;
    vec3 inner = mix(vec3(0.02, 0.30, 0.40), vec3(0.06, 0.55, 0.60), 0.5 + 0.5 * n.x * 4.0);
    col = mix(inner, windowCol, smoothstep(0.0, 0.2, k));
    col += vec3(0.9, 1.0, 0.95) * pow(max(dot(rd, uSun), 0.0), 40.0) * 0.8 * step(0.0, k);
    col = mix(col, uFog, 1.0 - exp(-dist * 0.045));
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

export const bedVertex = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const bedFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uFog;
varying vec3 vWorld;

// Patrón de cáusticas iterativo (luz del sol enfocada por las olas).
float caustics(vec2 p, float t) {
  vec2 i = p;
  float c = 1.0;
  const float inten = 0.005;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.0);
}

void main() {
  vec2 p = vWorld.xz;
  float dist = length(cameraPosition - vWorld);
  float ripple = sin(p.x * 2.6 + sin(p.y * 0.7) * 1.8) * 0.5 + 0.5;
  vec3 sand = mix(vec3(0.86, 0.79, 0.62), vec3(0.98, 0.94, 0.82), ripple * 0.6 + 0.2);
  float c = caustics(mod(p * 0.55, 6.28318) - 250.0, uTime * 0.45 + 23.0);
  vec3 col = sand * vec3(0.62, 0.93, 0.92) + vec3(0.85, 1.0, 0.92) * c * 0.75;
  col = mix(col, uFog, 1.0 - exp(-dist * 0.05));
  gl_FragColor = vec4(col, 1.0);
}
`;

export const rayVertex = /* glsl */ `
varying vec2 vUv;
varying float vPhase;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPhase = w.x * 0.37 + w.z * 0.21;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const rayFragment = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
varying float vPhase;
void main() {
  float edge = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
  float fall = smoothstep(0.0, 0.25, vUv.y) * pow(vUv.y, 1.6);
  float flicker = 0.55 + 0.45 * sin(uTime * 0.6 + vPhase * 6.0) * sin(uTime * 0.37 + vPhase * 3.0);
  gl_FragColor = vec4(vec3(0.75, 1.0, 0.95), edge * fall * flicker * 0.16);
}
`;

export const dustVertex = /* glsl */ `
uniform float uTime;
uniform float uScale;
uniform vec3 uCam;
varying float vAlpha;
void main() {
  // Cada partícula vive en una caja que acompaña a la cámara y se repite al salir de ella.
  vec3 box = vec3(22.0, 9.0, 22.0);
  vec3 drift = vec3(sin(uTime * 0.2 + position.y * 20.0) * 0.4, uTime * 0.12, cos(uTime * 0.17 + position.x * 20.0) * 0.4);
  vec3 p = mod(position * box + drift - uCam, box) - box * 0.5 + uCam;
  p.y = min(p.y, -0.3);
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float d = -mv.z;
  vAlpha = smoothstep(11.0, 2.0, d) * smoothstep(0.2, 1.2, d) * (0.35 + 0.65 * position.z);
  gl_PointSize = uScale * (0.006 + 0.008 * position.z) / max(d, 0.3);
  gl_Position = projectionMatrix * mv;
}
`;

export const dustFragment = /* glsl */ `
varying float vAlpha;
void main() {
  float r = length(gl_PointCoord - 0.5);
  gl_FragColor = vec4(vec3(0.85, 1.0, 0.97), smoothstep(0.5, 0.1, r) * vAlpha * 0.6);
}
`;

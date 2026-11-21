precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_scene;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.55;
  for (int i = 0; i < 3; i++) { v += noise(p) * a; p = p * 2.03 + 7.1; a *= 0.48; }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv + (u_pointer - vec2(.5)) * vec2(.022, .018);
  float t = u_time;
  float shore = .785 + .085 * sin(p.y * 5.4 + .36)
              - .08 * fbm(vec2(p.y * 4.0 + 4.1, 0.9));
  float distanceToLand = p.x - shore;
  float depth = clamp((shore - p.x) * 2.05, 0.0, 1.0);
  float swell = fbm(p * vec2(6.0, 4.0) + vec2(t * .035, -t * .05));
  float bands = sin(p.y * 34.0 + sin(p.x * 16.0 + t * .26) * 1.3 + swell * 3.0);
  float caustic = sin(p.x * 87.0 + t * .67 + sin(p.y * 56.0 + t * .4) * 1.7);
  caustic *= sin(p.y * 71.0 - t * .59 + sin(p.x * 45.0) * 1.4);
  caustic = pow(max(0.0, caustic), 2.0);
  vec3 deep = vec3(.012, .118, .165);
  vec3 lagoon = vec3(.018, .46, .53);
  vec3 aqua = vec3(.23, .73, .73);
  vec3 water = mix(deep, lagoon, 1.0 - depth * .72);
  water = mix(water, aqua, clamp((1.0 - depth) * .3 + .13 * swell, 0.0, .35));
  water += vec3(.08, .16, .12) * caustic * (1.0 - depth * .62);
  water += vec3(.02, .045, .048) * bands;
  float foam = exp(-abs(distanceToLand + .005) * 82.0) * (.7 + .3 * sin(p.y * 40.0 + t * .3));
  vec3 sand = mix(vec3(.71, .68, .54), vec3(.98, .84, .65), .45 + .55 * fbm(p * 12.0));
  vec3 foliage = mix(vec3(.055,.22,.19), vec3(.20,.40,.28), fbm(p * 46.0));
  float beach = smoothstep(-.012, .012, distanceToLand);
  float forest = smoothstep(.068, .16, distanceToLand + (swell - .5) * .02);
  vec3 color = mix(water, sand, beach);
  color = mix(color, foliage, forest);
  color += foam * vec3(.46,.46,.39);
  float daylight = smoothstep(.05, .70, 1.0 - length((uv - vec2(.70,.67)) * vec2(1.0,1.15)));
  color += daylight * vec3(.045,.06,.038);
  if (u_scene > .5 && u_scene < 1.5) {
    color = mix(color, vec3(color.r * 1.18 + .065, color.g * .86, color.b * .66), .64);
  } else if (u_scene > 1.5) {
    color = mix(color, vec3(color.r * .43 + .035, color.g * .40 + .028, color.b * .78 + .08), .78);
    float glimmer = pow(max(0.0, sin(p.y * 53.0 + sin(p.x * 33.0) + t * .25)), 20.0);
    color += glimmer * vec3(.13,.18,.23);
  }
  float vignette = 1.0 - .47 * pow(length((uv - .5) * vec2(1.03,1.1)), 1.6);
  color *= vignette;
  color = pow(max(color, vec3(0.0)), vec3(.92));
  gl_FragColor = vec4(color,1.0);
}
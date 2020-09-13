export const common = `/*glsl*/
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
  vec3 a = floor(p);
  vec3 d = p - a;
  d = d * d * (3.0 - 2.0 * d);

  vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
  vec4 k1 = perm(b.xyxy);
  vec4 k2 = perm(k1.xyxy + b.zzww);

  vec4 c = k2 + a.zzzz;
  vec4 k3 = perm(c);
  vec4 k4 = perm(c + 1.0);

  vec4 o1 = fract(k3 * (1.0 / 41.0));
  vec4 o2 = fract(k4 * (1.0 / 41.0));

  vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
  vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

  return o4.y * d.y + o4.x * (1.0 - d.y);
}

float fbm(vec2 p, float t) {
  float f;
  f  = 0.55 * noise(vec3(p, t)); p *= 2.1;
  f += 0.25 * noise(vec3(p, t)); p *= 2.2;
  f += 0.15 * noise(vec3(p, t));
  return f;
}

/* Star code based on: https://www.shadertoy.com/view/llj3zV */
vec3 stars(vec3 dir) {
  vec3 n = abs(dir);
  vec2 uv = (n.x > n.y && n.x > n.z) ? dir.yz / dir.x :
            (n.y > n.x && n.y > n.z) ? dir.zx / dir.y :
                                        dir.xy / dir.z;

  vec2 u = cos(200. * uv) * fbm(50. * uv, 0.0);
  return smoothstep(0.53, 0.55, u.x * u.y) * (0.25 * sin(uv.x * uv.y) + 0.75) * vec3(1.0, 0.7, 0.5);
}

vec3 bg(vec3 dir) {
  vec3 o1 = vec3(10.0, -5.0, 1.0);
  vec3 o2 = vec3(2.0, 3.0, 1.0);
  vec3 col = vec3(
    noise(dir) + noise(dir * 3.0),
    noise(dir + o1) + noise(dir * 3.0 + o1),
    noise(dir - o2) + noise(dir * 3.0 - o2)
  ) + stars(dir);
  return 0.25 * col * col;
}`
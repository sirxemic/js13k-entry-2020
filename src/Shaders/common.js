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

vec4 sampleBackdrop(vec3 dir) {
  float e = 0.5 * noise(dir * 3.0);
  vec3 col = vec3(
    noise(dir) + 0.7 * noise(2.0 * dir) + e,
    noise(dir + vec3(10.0, -5.0, 1.0)) + 0.8 * noise(2.0 * dir - vec3(2.0, 3.0, 1.0)),
    noise(dir - vec3(2.0, 3.0, 1.0)) + 0.7 * noise(2.0 * dir + vec3(10.0, -5.0, 1.0)) + e
  );
  return vec4(0.25 * col * col, 1.0);
}`
import {
  U_MODELMATRIX,
  U_VIEWMATRIX,
  U_PROJECTIONMATRIX,
  ATTR_POSITION,
  U_COLOR,
  U_ACTIVE,
  U_TIME,
  ATTR_NORMAL
} from '../sharedLiterals'
import { ShaderProgram } from '../ShaderProgram'

export const vertexShader = `/*glsl*/
attribute vec3 ${ATTR_NORMAL};

varying vec2 vp;
varying float vc;

void main() {
  vp = (${U_VIEWMATRIX} * ${U_MODELMATRIX} * vec4(${ATTR_POSITION}, 1.0)).xy;
  vc = length(${ATTR_NORMAL});
  gl_Position = ${U_PROJECTIONMATRIX} * ${U_VIEWMATRIX} * ${U_MODELMATRIX} * vec4(${ATTR_POSITION}, 1.0);
}
`

export const fragmentShader = `/*glsl*/
uniform float ${U_COLOR};
uniform float ${U_ACTIVE};
uniform float ${U_TIME};

varying vec2 vp;
varying float vc;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 rainbow = hsv2rgb(vec3((length(vp) - 2.0 * ${U_TIME}) * 0.1, 0.5, 1.0));

  vec3 color = mix(vec3(1.0), rainbow, ${U_ACTIVE});
  gl_FragColor = vec4(pow(vc, 5.0) * ${U_COLOR} * color, 1.0);
}
`

export const TheShapeShader = new ShaderProgram(vertexShader, fragmentShader)
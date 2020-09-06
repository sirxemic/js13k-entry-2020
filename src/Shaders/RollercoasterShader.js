import {
  U_VIEWMATRIX,
  U_PROJECTIONMATRIX,
  U_CAMERAPOSITION,
  ATTR_POSITION,
  ATTR_NORMAL
} from '../sharedLiterals'
import { ShaderProgram } from '../ShaderProgram'

export const vertexShader = `/*glsl*/
attribute vec3 ${ATTR_NORMAL};

varying vec3 vp;
varying vec3 vn;

void main() {
  vp = ${ATTR_POSITION};
  vn = ${ATTR_NORMAL};

  gl_Position = ${U_PROJECTIONMATRIX} * ${U_VIEWMATRIX} * vec4(${ATTR_POSITION}, 1.0);
}
`

export const fragmentShader = `/*glsl*/
uniform vec3 ${U_CAMERAPOSITION};

varying vec3 vp;
varying vec3 vn;

void main() {
  vec3 normal = normalize(vn);
  vec3 ray = normalize(vp - ${U_CAMERAPOSITION});
  ray = reflect(ray, normal);

  vec3 color = bg(ray);
  gl_FragColor = vec4(color * color, 1.0);
}
`

export const TheRollercoasterShader = new ShaderProgram(vertexShader, fragmentShader)
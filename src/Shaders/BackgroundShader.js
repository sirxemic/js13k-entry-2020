import {
  U_VIEWMATRIX,
  U_PROJECTIONMATRIX,
  U_CAMERAPOSITION,
  ATTR_POSITION
} from '../sharedLiterals'
import { ShaderProgram } from '../ShaderProgram'

export const vertexShader = `/*glsl*/
varying vec3 vp;

void main() {
  vp = ${ATTR_POSITION};

  mat4 r = ${U_VIEWMATRIX};
  r[3].xyz = vec3(0.0);

  gl_Position = ${U_PROJECTIONMATRIX} * r * vec4(${ATTR_POSITION}, 1.0);
}
`

export const fragmentShader = `/*glsl*/
uniform vec3 ${U_CAMERAPOSITION};

varying vec3 vp;

void main() {
  vec3 r = normalize(vp);

  gl_FragColor = vec4(bg(r), 1.0);
}
`

export const BackgroundShader = new ShaderProgram(vertexShader, fragmentShader)
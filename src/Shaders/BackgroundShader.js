import {
  U_VIEWMATRIX,
  U_PROJECTIONMATRIX,
  U_CAMERAPOSITION,
  ATTR_POSITION
} from '../sharedLiterals'
import { ShaderProgram } from '../ShaderProgram'
import { common } from './common'

export const vertexShader = `/*glsl*/
uniform mat4 ${U_VIEWMATRIX};
uniform mat4 ${U_PROJECTIONMATRIX};

attribute vec3 ${ATTR_POSITION};

varying vec3 vp;

void main() {
  vp = ${ATTR_POSITION};

  mat4 r = ${U_VIEWMATRIX};
  r[3].xyz = vec3(0.0);

  gl_Position = ${U_PROJECTIONMATRIX} * r * vec4(${ATTR_POSITION}, 1.0);
}
`

export const fragmentShader = `/*glsl*/
precision highp float;

uniform vec3 ${U_CAMERAPOSITION};

varying vec3 vp;

${common}

void main() {
  vec3 r = normalize(vp);

  gl_FragColor = vec4(bg(r), 1.0);
}
`

export const BackgroundShader = new ShaderProgram(vertexShader, fragmentShader)
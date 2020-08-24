import {
  U_MODELMATRIX,
  U_VIEWMATRIX,
  U_PROJECTIONMATRIX,
  ATTR_POSITION,
  U_COLOR
} from '../sharedLiterals'
import { ShaderProgram } from '../ShaderProgram'

export const vertexShader = `/*glsl*/
uniform mat4 ${U_MODELMATRIX};
uniform mat4 ${U_VIEWMATRIX};
uniform mat4 ${U_PROJECTIONMATRIX};

attribute vec3 ${ATTR_POSITION};

void main() {
  gl_Position = ${U_PROJECTIONMATRIX} * ${U_VIEWMATRIX} * ${U_MODELMATRIX} * vec4(${ATTR_POSITION}, 1.0);
}
`

export const fragmentShader = `/*glsl*/
precision mediump float;

uniform float ${U_COLOR};

void main() {
  gl_FragColor = vec4(vec3(${U_COLOR}), 1.0);
}
`

export const TheShapeShader = new ShaderProgram(vertexShader, fragmentShader)
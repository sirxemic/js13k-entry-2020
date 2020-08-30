import {
  U_MODELMATRIX,
  U_VIEWMATRIX,
  U_PROJECTIONMATRIX,
  ATTR_POSITION,
  ATTR_NORMAL,
  U_NORMALMATRIX,
  U_CAMERAPOSITION,
  U_COLOR
} from '../sharedLiterals'
import { ShaderProgram } from '../ShaderProgram'

export const vertexShader = `/*glsl*/
uniform mat4 ${U_MODELMATRIX};
uniform mat4 ${U_VIEWMATRIX};
uniform mat4 ${U_PROJECTIONMATRIX};
uniform mat3 ${U_NORMALMATRIX};

attribute vec3 ${ATTR_POSITION};

varying float vd;

void main() {
  vd = ${ATTR_POSITION}.z;
  gl_Position = ${U_PROJECTIONMATRIX} * ${U_VIEWMATRIX} * ${U_MODELMATRIX} * vec4(${ATTR_POSITION}, 1.0);
}
`

export const fragmentShader = `/*glsl*/
precision mediump float;

uniform vec3 ${U_CAMERAPOSITION};
uniform float ${U_COLOR};

varying float vd;

void main() {
  float alpha = clamp(0.0, 1.0, 3.5-vd);
  gl_FragColor = vec4(vec3(0.5 + ${U_COLOR}), alpha);
}
`

export const TheActionShader = new ShaderProgram(vertexShader, fragmentShader)
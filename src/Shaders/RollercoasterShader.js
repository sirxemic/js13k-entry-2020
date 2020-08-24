import {
  U_MODELVIEWMATRIX,
  U_PROJECTIONMATRIX,
  U_NORMALMATRIX,
  U_CAMERAPOSITION,
  ATTR_POSITION,
  ATTR_NORMAL
} from '../sharedLiterals'
import { ShaderProgram } from '../ShaderProgram'
import { common } from './common'

export const vertexShader = `/*glsl*/
uniform mat4 ${U_MODELVIEWMATRIX};
uniform mat4 ${U_PROJECTIONMATRIX};
uniform mat3 ${U_NORMALMATRIX};

attribute vec3 ${ATTR_POSITION};
attribute vec3 ${ATTR_NORMAL};

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vPosition = ${ATTR_POSITION};
  vNormal = ${U_NORMALMATRIX} * ${ATTR_NORMAL};

  gl_Position = ${U_PROJECTIONMATRIX} * ${U_MODELVIEWMATRIX} * vec4(${ATTR_POSITION}, 1.0);
}
`

export const fragmentShader = `/*glsl*/
precision mediump float;

uniform vec3 ${U_CAMERAPOSITION};

varying vec3 vPosition;
varying vec3 vNormal;

${common}

void main() {
  vec3 normal = vNormal;
  vec3 ray = normalize(vPosition - ${U_CAMERAPOSITION});
  vec3 reflectedRay = reflect(ray, normal);

  gl_FragColor = sampleBackdrop(normalize(reflectedRay));
}
`

export const TheRollercoasterShader = new ShaderProgram(vertexShader, fragmentShader)
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
import { common } from './common'

export const vertexShader = `/*glsl*/
uniform mat4 ${U_MODELMATRIX};
uniform mat4 ${U_VIEWMATRIX};
uniform mat4 ${U_PROJECTIONMATRIX};
uniform mat3 ${U_NORMALMATRIX};

attribute vec3 ${ATTR_POSITION};
attribute vec3 ${ATTR_NORMAL};

varying vec3 vPosition;
varying float vDepth;
varying vec3 vNormal;

void main() {
  vPosition = (${U_MODELMATRIX} * vec4(${ATTR_POSITION}, 1.0)).xyz;
  vDepth = ${ATTR_POSITION}.z;
  vNormal = ${U_NORMALMATRIX} * ${ATTR_NORMAL};
  gl_Position = ${U_PROJECTIONMATRIX} * ${U_VIEWMATRIX} * ${U_MODELMATRIX} * vec4(${ATTR_POSITION}, 1.0);
}
`

export const fragmentShader = `/*glsl*/
precision mediump float;

uniform vec3 ${U_CAMERAPOSITION};
uniform float ${U_COLOR};

varying vec3 vPosition;
varying float vDepth;
varying vec3 vNormal;

${common}

void main() {
  vec3 normal = vNormal;
  vec3 ray = normalize(vPosition - ${U_CAMERAPOSITION});
  vec3 reflectedRay = reflect(ray, normal);
  float alpha = clamp(0.0, 1.0, 3.5-vDepth);
  gl_FragColor = vec4(${U_COLOR} + sampleBackdrop(normalize(reflectedRay)).xyz, alpha);
}
`

export const TheActionShader = new ShaderProgram(vertexShader, fragmentShader)
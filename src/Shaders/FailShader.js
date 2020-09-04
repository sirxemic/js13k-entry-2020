import {
  ATTR_POSITION,
  U_TEXTURE,
  U_WRAP_START
} from '../sharedLiterals'
import { ShaderProgram } from '../ShaderProgram'
import { common } from './common'

export const vertexShader = `/*glsl*/
attribute vec3 ${ATTR_POSITION};

varying vec2 uv;

void main() {
  uv = (${ATTR_POSITION}.xy + 1.0) * 0.5;
  gl_Position = vec4(${ATTR_POSITION}, 1.0);
}
`

export const fragmentShader = `/*glsl*/
precision mediump float;

uniform sampler2D ${U_TEXTURE};
uniform float ${U_WRAP_START};

varying vec2 uv;

void main() {
  gl_FragColor = texture2D(${U_TEXTURE}, uv);
}
`

export const FailShader = new ShaderProgram(vertexShader, fragmentShader)
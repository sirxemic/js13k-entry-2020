import { ATTR_POSITION } from '../sharedLiterals'
import { ShaderProgram } from '../ShaderProgram'

export const vertexShader = `/*glsl*/
varying vec2 vp;

void main() {
  vp = ${ATTR_POSITION}.xy;

  gl_Position = vec4(${ATTR_POSITION}, 1.0);
}
`

export const fragmentShader = `/*glsl*/
varying vec2 vp;

void main() {
  float a = max(0.0, length(vp) - 0.5);
  float b = abs(vp.y);

  gl_FragColor = vec4(vec3(0.0), a * b);
}
`

export const VignetteShader = new ShaderProgram(vertexShader, fragmentShader)
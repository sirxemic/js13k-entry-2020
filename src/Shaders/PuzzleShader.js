import {
  ATTR_POSITION,
  U_TEXTURE,
  U_WRAP_START,
  U_WRAP_LENGTH
} from '../sharedLiterals'
import { ShaderProgram } from '../ShaderProgram'

export const vertexShader = `/*glsl*/
varying vec2 vuv;

void main() {
  vuv = (${ATTR_POSITION}.xy + 1.0) * 0.5;
  gl_Position = vec4(${ATTR_POSITION}, 1.0);
}
`

export const fragmentShader = `/*glsl*/
uniform sampler2D ${U_TEXTURE};
uniform float ${U_WRAP_START};
uniform float ${U_WRAP_LENGTH};

varying vec2 vuv;

float sm(float x, float s, float t) {
  return 1.0 - pow(t / (t - x), -t / s);
}

void main() {
  float wr = ${U_WRAP_START};
  float wl = 1.0 - wr;
  float wd = ${U_WRAP_LENGTH};
  vec2 uv = vuv;
  if (uv.x > wr) {
    float s = sm(uv.x - wr, wd * 0.5, 1.0 - wr);
    uv.x = wr + s * wd * 0.5;
  }
  if (uv.x < wl) {
    float s = sm(wl - uv.x, wd * 0.5, wl);
    uv.x = wl - s * wd * 0.5;
  }
  gl_FragColor =
    texture2D(${U_TEXTURE}, uv) +
    texture2D(${U_TEXTURE}, uv + vec2(1.0 - 2.0 * wl + wd, 0.0)) +
    texture2D(${U_TEXTURE}, uv + vec2(1.0 - 2.0 * wr - wd, 0.0));
}
`

export const PuzzleShader = new ShaderProgram(vertexShader, fragmentShader)
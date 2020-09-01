import { gl } from './Graphics'
import { Vector3 } from './Math/Vector3'
import { Matrix3 } from './Math/Matrix3'
import { Matrix4 } from './Math/Matrix4'
import { TheCamera } from './Camera'
import { U_PROJECTIONMATRIX, U_VIEWMATRIX, U_CAMERAPOSITION, U_TEXTURE } from './sharedLiterals'

function createShader (type, source) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (process.env.NODE_ENV === 'development' && !gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error('compile error: ' + gl.getShaderInfoLog(shader))
  }

  return shader
}

export class ShaderProgram {
  constructor (vertexSource, fragmentSource) {
    this.program = gl.createProgram()
    gl.attachShader(this.program, createShader(gl.VERTEX_SHADER, vertexSource))
    gl.attachShader(this.program, createShader(gl.FRAGMENT_SHADER, fragmentSource))

    gl.linkProgram(this.program)
    if (process.env.NODE_ENV === 'development' && !gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error('link error: ' + gl.getProgramInfoLog(this.program))
    }

    this.uniformLocations = {}
    let numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < numUniforms; i++) {
        let uniform = gl.getActiveUniform(this.program, i)
        this.uniformLocations[uniform.name] = gl.getUniformLocation(this.program, uniform.name)
    }
  }

  use (uniforms = {}) {
    uniforms[U_PROJECTIONMATRIX] = TheCamera.projectionMatrix
    uniforms[U_VIEWMATRIX] = TheCamera.viewMatrix
    uniforms[U_CAMERAPOSITION] = TheCamera.position

    gl.useProgram(this.program)
    for (let uniformName in this.uniformLocations) {
      const location = this.uniformLocations[uniformName]
      if (uniforms[uniformName] instanceof Vector3) {
        gl.uniform3fv(location, uniforms[uniformName].array())
      } else if (uniforms[uniformName] instanceof Matrix3) {
        gl.uniformMatrix3fv(location, false, uniforms[uniformName].els)
      } else if (uniforms[uniformName] instanceof Matrix4) {
        gl.uniformMatrix4fv(location, false, uniforms[uniformName].els)
      } else if (uniformName === U_TEXTURE) {
        gl.uniform1i(location, uniforms[uniformName])
      } else {
        gl.uniform1f(location, uniforms[uniformName])
      }
    }
  }
}

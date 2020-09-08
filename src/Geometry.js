import { gl } from './Graphics'
import { currentProgram } from './ShaderProgram'
import { ATTR_POSITION, ATTR_NORMAL } from './sharedLiterals'

let currentLocations = []

export class Geometry {
  constructor ({
    vertices,
    normals,
    indices
  }) {
    this.verticesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    if (normals) {
      this.normalsBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)
    }

    this.indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    this.triangleCount = indices.length

    this.boundingBox = [1000, 1000, -1000, -1000]
    for (let i = 0; i < vertices.length; i += 3) {
      this.boundingBox[0] = Math.min(this.boundingBox[0], vertices[i])
      this.boundingBox[2] = Math.max(this.boundingBox[2], vertices[i])
      this.boundingBox[1] = Math.min(this.boundingBox[1], vertices[i + 1])
      this.boundingBox[3] = Math.max(this.boundingBox[3], vertices[i + 1])
    }
  }

  draw () {
    const positionsLocation = gl.getAttribLocation(currentProgram, ATTR_POSITION)
    const normalsLocation = gl.getAttribLocation(currentProgram, ATTR_NORMAL)

    const newLocations = []
    newLocations[positionsLocation] = true
    newLocations[normalsLocation] = true

    for (let i = 0; i < 2; i++) {
      if (!currentLocations[i] && newLocations[i]) {
        gl.enableVertexAttribArray(i)
      }
      if (currentLocations[i] && !newLocations[i]) {
        gl.disableVertexAttribArray(i)
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer)
    gl.vertexAttribPointer(positionsLocation, 3, gl.FLOAT, false, 0, 0)

    if (normalsLocation !== -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer)
      gl.vertexAttribPointer(normalsLocation, 3, gl.FLOAT, false, 0, 0)
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    gl.drawElements(gl.TRIANGLES, this.triangleCount, gl.UNSIGNED_SHORT, 0)
  }
}

import { gl } from './Graphics'

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
  }

  draw () {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

    if (this.normalsBuffer) {
      gl.enableVertexAttribArray(1)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer)
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0)
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    gl.drawElements(gl.TRIANGLES, this.triangleCount, gl.UNSIGNED_SHORT, 0)

    if (this.normalsBuffer) {
      gl.disableVertexAttribArray(1)
    }
  }
}

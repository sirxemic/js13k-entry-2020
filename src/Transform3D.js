import { Matrix4 } from './Math/Matrix4'
import { Matrix3 } from './Math/Matrix3'
import { U_MODELMATRIX, U_NORMALMATRIX } from './sharedLiterals'

export class Transform3D {
  constructor () {
    this.matrix = new Matrix4()
    this.worldMatrix = new Matrix4()
    this.children = []
  }

  add (child) {
    this.children.push(child)
    return child
  }

  updateMatrices (copyMatrix = true) {
    if (copyMatrix) {
      this.worldMatrix = this.matrix
    }
    for (let child of this.children) {
      child.worldMatrix.multiplyMatrices(this.worldMatrix, child.matrix)
      child.updateMatrices(false)
    }
  }

  getCommonUniforms () {
    const normalMatrix = new Matrix3()
    normalMatrix.getNormalMatrix(this.worldMatrix)

    return {
      [U_MODELMATRIX]: this.worldMatrix,
      [U_NORMALMATRIX]: normalMatrix
    }
  }
}
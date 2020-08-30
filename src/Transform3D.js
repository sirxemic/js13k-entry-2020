import { Matrix4 } from './Math/Matrix4'
import { Matrix3 } from './Math/Matrix3'
import { TheCamera } from './Camera'
import { U_PROJECTIONMATRIX, U_VIEWMATRIX, U_MODELMATRIX, U_CAMERAPOSITION, U_NORMALMATRIX } from './sharedLiterals'
import { tempMatrix4 } from './temps'

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
      child.worldMatrix.multiply(this.worldMatrix, child.matrix)
      child.updateMatrices(false)
    }
  }

  getCommonUniforms () {
    const normalMatrix = new Matrix3()
    normalMatrix.getNormalMatrix(tempMatrix4.multiply(TheCamera.viewMatrix, this.worldMatrix))

    return {
      [U_PROJECTIONMATRIX]: TheCamera.projectionMatrix,
      [U_VIEWMATRIX]: TheCamera.viewMatrix,
      [U_MODELMATRIX]: this.worldMatrix,
      [U_CAMERAPOSITION]: TheCamera.position,
      [U_NORMALMATRIX]: normalMatrix
    }
  }
}
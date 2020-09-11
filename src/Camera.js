import { Matrix4 } from './Math/Matrix4'
import { Vector3 } from './Math/Vector3'
import { TheRollercoaster } from './Rollercoaster'
import { TheCanvas } from './Graphics'
import { Input } from './Input'
import { DISTANCE_FROM_CAMERA, FOVX } from './constants'
import { delta } from './globals'
import { tempMatrix4 } from './temps'

class Camera {
  constructor () {
    this.projectionMatrix = new Matrix4()
    this.viewMatrix = new Matrix4()
    this.position = new Vector3()
    this.trackPosition = 0
    this.shakeAmount = 0
    this.velocity = 700
  }

  step () {
    this.trackPosition += this.velocity * delta / TheRollercoaster.getDerivativeAt(this.trackPosition).length()
    const transform = TheRollercoaster.getTransformAt(this.trackPosition)
    transform.multiplyMatrices(transform, this.getShakeMatrix())
    this.position.set(transform.els[12], transform.els[13], transform.els[14])

    this.viewMatrix.getInverse(transform)

    this.projectionMatrix.fromPerspective(FOVX, TheCanvas.width / TheCanvas.height, 8, 12000)

    Input.scale = 2 * DISTANCE_FROM_CAMERA * Math.tan(FOVX / 2) / TheCanvas.width
  }

  getShakeMatrix () {
    this.shakeAmount -= this.shakeAmount * (1 - Math.exp(-5 * delta))
    const r = Math.random() * this.shakeAmount
    const a = Math.random() * Math.PI * 2
    tempMatrix4.els.set([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      r * Math.cos(a) / 3, r * Math.sin(a), 0, 1
    ])

    return tempMatrix4
  }

  shake () {
    this.shakeAmount = 5
  }
}

export const TheCamera = new Camera()
import { Matrix4 } from './Math/Matrix4'
import { Vector3 } from './Math/Vector3'
import { TheRollercoaster } from './Rollercoaster'
import { TheCanvas } from './Graphics'
import { Input } from './Input'

const fovx = 1.5

class Camera {
  constructor () {
    this.projectionMatrix = new Matrix4()
    this.viewMatrix = new Matrix4()
    this.position = new Vector3()
    this.trackPosition = 0
  }

  step (delta) {
    this.trackPosition += 700 * delta / TheRollercoaster.getDerivativeAt(this.trackPosition).length()
    const transform = TheRollercoaster.getTransformAt(this.trackPosition)
    this.position.set(transform.els[12], transform.els[13], transform.els[14])

    this.viewMatrix.getInverse(transform)

    this.projectionMatrix.fromPerspective(fovx, TheCanvas.width / TheCanvas.height, 5, 10000)

    Input.scale = 2 * 50 * Math.tan(fovx / 2) / TheCanvas.width
  }
}

export const TheCamera = new Camera()
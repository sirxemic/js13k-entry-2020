import { Vector3 } from './Math/Vector3'
import { Matrix4 } from './Math/Matrix4'

const SCALE = 3000

class Rollercoaster {
  getPointAt (t) {
    return new Vector3(
      SCALE * Math.sin(2 * t),
      SCALE * 2 * Math.sin(t),
      SCALE * ((Math.cos(2 * t) + Math.cos(3 * t)) - 0.25)
    )
  }

  getDerivativeAt (t) {
    return new Vector3(
      SCALE * 2 * Math.cos(2 * t),
      SCALE * 2 * Math.cos(t),
      SCALE * (-2 * Math.sin(2 * t) - 3 * Math.sin(3 * t))
    )
  }

  getSecondDerivativeAt (t) {
    return new Vector3(
      SCALE * -4 * Math.sin(2 * t),
      SCALE * -2 * Math.sin(t),
      SCALE * (-4 * Math.cos(2 * t) - 9 * Math.cos(3 * t))
    )
  }

  getTransformAt (t) {
    const point = this.getPointAt(t)
    const tangent = this.getDerivativeAt(t).normalize()
    const normal = this.getSecondDerivativeAt(t)
    const bitangent = new Vector3().crossVectors(tangent, normal).normalize()
    normal.crossVectors(bitangent, tangent)
    const result = new Matrix4([
      ...bitangent.array(), 0,
      ...normal.array(), 0,
      ...tangent.array(), 0,
      ...point.array(), 1
    ])
    return result
  }
}

export const TheRollercoaster = new Rollercoaster()
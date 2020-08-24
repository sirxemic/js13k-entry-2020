import { Vector3 } from './Math/Vector3'
import { Matrix4 } from './Math/Matrix4'

const SCALE = 2000

class Rollercoaster {
  getPointAt (t) {
    return new Vector3(
      SCALE * Math.cos(t),
      SCALE * Math.sin(t),
      SCALE * 0.1 * Math.sin(2 * t),
    )
  }

  getDerivativeAt (t) {
    return new Vector3(
      SCALE * -Math.sin(t),
      SCALE * Math.cos(t),
      SCALE * 0.1 * Math.cos(2 * t),
    )
  }

  getTransformAt (t) {
    const point = this.getPointAt(t)
    const tangent = this.getDerivativeAt(t).normalize()
    const normal = this.getPointAt(t).multiplyScalar(-1)
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
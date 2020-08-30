import { Vector3 } from '../Math/Vector3'
import { Geometry } from '../Geometry'
import { TRACK_WIDTH } from '../constants'
import { TheRollercoaster } from '../Rollercoaster'

const HALF_WIDTH = TRACK_WIDTH / 2
const DEPTH = TRACK_WIDTH / 7
const HALF_INNER_WIDTH = TRACK_WIDTH / 4

const vertices = []
const normals = []
const indices = []
const N = 900
let offset = 0
for (let i = 0; i <= N; i++) {
  const t = i / N * Math.PI * 2
  const transform = TheRollercoaster.getTransformAt(t)
  const p1 = new Vector3(-HALF_WIDTH, 0, 0)
  const p2 = new Vector3(-HALF_INNER_WIDTH, -DEPTH, 0)
  const p3 = new Vector3(HALF_INNER_WIDTH, -DEPTH, 0)
  const p4 = new Vector3(HALF_WIDTH, 0, 0)

  const n1 = new Vector3(p1.y - p2.y, p2.x - p1.x, 0)
  const n2 = new Vector3(0, 1, 0)
  const n3 = new Vector3(p3.y - p4.y, p4.x - p3.x, 0)

  p1.applyMatrix4(transform)
  p2.applyMatrix4(transform)
  p3.applyMatrix4(transform)
  p4.applyMatrix4(transform)

  n1.transformDirection(transform)
  n2.transformDirection(transform)
  n3.transformDirection(transform)

  vertices.push(
    p1.x, p1.y, p1.z,
    p2.x, p2.y, p2.z,

    p2.x, p2.y, p2.z,
    p3.x, p3.y, p3.z,

    p3.x, p3.y, p3.z,
    p4.x, p4.y, p4.z
  )

  normals.push(
    n1.x, n1.y, n1.z,
    n1.x, n1.y, n1.z,

    n2.x, n2.y, n2.z,
    n2.x, n2.y, n2.z,

    n3.x, n3.y, n3.z,
    n3.x, n3.y, n3.z,
  )
  if (i < N) {
    indices.push(
      offset + 0,
      offset + 7,
      offset + 6,

      offset + 0,
      offset + 1,
      offset + 7,

      offset + 2,
      offset + 9,
      offset + 8,

      offset + 2,
      offset + 3,
      offset + 9,

      offset + 4,
      offset + 11,
      offset + 10,

      offset + 4,
      offset + 5,
      offset + 11
    )
  }
  offset += 6
}

export const TheRollercoasterGeometry = new Geometry({ vertices, normals, indices })
import { Geometry } from '../Geometry'

const vertices = [
  4, 0, 0,
  2.5, -1.5, 0,
  2.5, 1.5, 0,
  -3, -0.5, 0,
  -3, 0.5, 0,
  2.5, -0.5, 0,
  2.5,  0.5, 0,
]
const indices = [
  0, 1, 2,
  3, 4, 5,
  4, 5, 6
]

export const ShiftGeometry = new Geometry({ vertices, indices })
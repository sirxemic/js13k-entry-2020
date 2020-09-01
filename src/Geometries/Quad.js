import { Geometry } from '../Geometry'

export const Quad = new Geometry({
  vertices: [
    -1, -1, 0,
    +1, -1, 0,
    +1, +1, 0,
    -1, +1, 0
  ],
  indices: [
    0, 1, 2,
    0, 2, 3
  ]
})
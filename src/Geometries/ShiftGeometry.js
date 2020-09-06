import { Geometry } from '../Geometry';

export const ShiftGeometry = new Geometry({
  vertices: [
    -3, -2, 0,
    -3, 2, 0,
    2, 0, 0
  ],
  normals: [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
  ],
  indices: [
    0, 1, 2
  ]
})
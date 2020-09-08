import { Geometry } from '../Geometry'

const vertices = [
 0,     4, 0,
-1.5,     2.5, 0,
 1.5,     2.5, 0,
 0,    -4, 0,
-1.5,    -2.5, 0,
 1.5,    -2.5, 0,
-0.5,  -2.5, 0,
 0.5,  -2.5, 0,
-0.5,   2.5, 0,
 0.5,   2.5, 0,
]
const indices = [
 0, 1, 2,
 3, 4, 5,
 6, 7, 8,
 7, 8, 9
]

export const TheFlipVGeometry = new Geometry({ vertices, indices })
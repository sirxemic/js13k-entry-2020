import { Geometry } from '../Geometry';

const OUTLINE_WIDTH = 0.2
const EXTENSION_WIDTH = OUTLINE_WIDTH * 2.4
const EXTENSION_WIDTH2 = OUTLINE_WIDTH * 0.4

export const TriangleShape = new Geometry({
  vertices: [
    2, 2, 0,
    -2, -2, 0,
    2, -2, 0,
    2 + OUTLINE_WIDTH, 2 + EXTENSION_WIDTH, 0,
    -2 - EXTENSION_WIDTH, -2 - OUTLINE_WIDTH, 0,
    2 + OUTLINE_WIDTH, -2 - OUTLINE_WIDTH, 0
  ],
  normals: [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
  ],
  indices: [0, 1, 2, 0, 1, 3, 1, 3, 4, 1, 2, 4, 2, 4, 5, 2, 0, 5, 0, 5, 3]
})

export const FourShape = new Geometry({
  vertices: [
    1, 2, 0,
    -2, -1, 0,
    1, -1, 0,
    1, -2, 0,
    2, -2, 0,
    2, 2, 0,
    1 - EXTENSION_WIDTH2, 2 + OUTLINE_WIDTH, 0,
    -2 - EXTENSION_WIDTH, -1 - OUTLINE_WIDTH, 0,
    1 - OUTLINE_WIDTH, -1 - OUTLINE_WIDTH, 0,
    1 - OUTLINE_WIDTH, -2 - OUTLINE_WIDTH, 0,
    2 + OUTLINE_WIDTH, -2 - OUTLINE_WIDTH, 0,
    2 + OUTLINE_WIDTH, 2 + OUTLINE_WIDTH, 0
  ],
  normals: [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
  ],
  indices: [
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 5,
    0, 1, 6,
    1, 6, 7,
    1, 2, 7,
    2, 7, 8,
    2, 3, 8,
    3, 8, 9,
    3, 4, 9,
    4, 9, 10,
    4, 5, 10,
    5, 10, 11,
    5, 0, 11,
    0, 11, 6
  ]
})

export const UShape = new Geometry({
  vertices: [
    2, 2, 0,
    1, 2, 0,
    1, -1, 0,
    -1, -1, 0,
    -1, 2, 0,
    -2, 2, 0,
    -2, -2, 0,
    2, -2, 0,

    2 + OUTLINE_WIDTH, 2 + OUTLINE_WIDTH, 0,
    1 - OUTLINE_WIDTH, 2 + OUTLINE_WIDTH, 0,
    1 - OUTLINE_WIDTH, -1 + OUTLINE_WIDTH, 0,
    -1 + OUTLINE_WIDTH, -1 + OUTLINE_WIDTH, 0,
    -1 + OUTLINE_WIDTH, 2 + OUTLINE_WIDTH, 0,
    -2 - OUTLINE_WIDTH, 2 + OUTLINE_WIDTH, 0,
    -2 - OUTLINE_WIDTH, -2 - OUTLINE_WIDTH, 0,
    2 + OUTLINE_WIDTH, -2 - OUTLINE_WIDTH, 0,
  ],
  normals: [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
  ],
  indices: [
    0, 1, 2,
    0, 2, 7,
    2, 6, 7,
    2, 3, 6,
    3, 4, 5,
    3, 5, 6,

     0,  8,  9, 0,  9, 1,
     1,  9, 10, 1, 10, 2,
     2, 10, 11, 2, 11, 3,
     3, 11, 12, 3, 12, 4,
     4, 12, 13, 4, 13, 5,
     5, 13, 14, 5, 14, 6,
     6, 14, 15, 6, 15, 7,
     7, 15, 8, 7, 8, 0,
  ]
})

const vertices = []
const normals = []
const indices = []
const N = 40
for (let i = 0; i < N; i++) {
  const a = Math.PI * i * 2 / N
  vertices.push(
    2 * Math.cos(a), 2 * Math.sin(a), 0,
    (2 + OUTLINE_WIDTH) * Math.cos(a), (2 + OUTLINE_WIDTH) * Math.sin(a), 0
  )
  normals.push(0, 0, 1, 0, 0, 0)
  if (i < N - 1) indices.push(0, i * 2, i * 2 + 2)

  const i0 = 2 * i
  const i1 = 2 * ((i + 1) % N)
  const i2 = 2 * i + 1
  const i3 = 2 * ((i + 1) % N) + 1
  indices.push(
    i0, i1, i2,
    i1, i2, i3
  )
}
export const CircleShape = new Geometry({
  vertices,
  normals,
  indices
})
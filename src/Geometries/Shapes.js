import { Geometry } from '../Geometry';

const OUTLINE_WIDTH = 0.2
const EXTENSION_WIDTH = OUTLINE_WIDTH * 2.4
const EXTENSION_WIDTH2 = OUTLINE_WIDTH * 0.4

export const TriangleShape = new Geometry({
  vertices: [
    2, 2, 0,
    -2, -2, 0,
    2, -2, 0
  ],
  indices: [
    0, 1, 2
  ]
})

TriangleShape.outline = new Geometry({
  vertices: [
    2 + OUTLINE_WIDTH, 2 + EXTENSION_WIDTH, 0,
    -2 - EXTENSION_WIDTH, -2 - OUTLINE_WIDTH, 0,
    2 + OUTLINE_WIDTH, -2 - OUTLINE_WIDTH, 0
  ],
  indices: [
    0, 1, 2
  ]
})

export const FourShape = new Geometry({
  vertices: [
    1, 2, 0,
    -2, -1, 0,
    1, -1, 0,
    1, -2, 0,
    2, -2, 0,
    2, 2, 0
  ],
  indices: [
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 5
  ]
})

FourShape.outline = new Geometry({
  vertices: [
    1 - EXTENSION_WIDTH2, 2 + OUTLINE_WIDTH, 0,
    -2 - EXTENSION_WIDTH, -1 - OUTLINE_WIDTH, 0,
    1 - OUTLINE_WIDTH, -1 - OUTLINE_WIDTH, 0,
    1 - OUTLINE_WIDTH, -2 - OUTLINE_WIDTH, 0,
    2 + OUTLINE_WIDTH, -2 - OUTLINE_WIDTH, 0,
    2 + OUTLINE_WIDTH, 2 + OUTLINE_WIDTH, 0
  ],
  indices: [
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 5
  ]
})

const vertices = []
const indices = []
const N = 40
for (let i = 0; i < N; i++) {
  const a = Math.PI * i * 2 / N
  vertices.push(2 * Math.cos(a), 2 * Math.sin(a), 0)
  if (i < N - 1) indices.push(0, i, i + 1)
}
export const CircleShape = new Geometry({
  vertices,
  indices
})

CircleShape.outline = new Geometry({
  vertices: vertices.map(v => v * (2 + OUTLINE_WIDTH) / 2),
  indices
})

import { Geometry } from '../Geometry';

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

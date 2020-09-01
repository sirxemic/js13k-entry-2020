import { Geometry } from '../Geometry'

const vertices = []
const indices = []

const N = 64

for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    const theta = i / N * Math.PI * 2
    const phi = j / (N - 1) * Math.PI
    const x = 100 * Math.cos(theta) * Math.sin(phi)
    const y = 100 * Math.sin(theta) * Math.sin(phi)
    const z = 100 * Math.cos(phi)
    vertices.push(x, y, z)
    const o11 = j + i * N
    const o12 = (j + 1) + i * N
    const o21 = j + ((i + 1) % N) * N
    const o22 = (j + 1) + ((i + 1) % N) * N
    if (j < N - 1) {
      indices.push(
        o11, o12, o21,
        o21, o22, o12
      )
    }
  }
}
export const BackgroundGeometry = new Geometry({ vertices, indices })
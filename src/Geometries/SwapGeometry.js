import { Geometry } from '../Geometry'
import { create2DArrow } from './ArrowBuilder'
import { TILE_SIZE } from '../constants'

function makeRotateGeometry (tileSpan) {
  const vertices = []
  const normals = []
  const indices = []

  if (tileSpan === 2) {
    tileSpan = 1.8
  }

  const HALF_TAIL_WIDTH = TILE_SIZE / 6
  const HALF_HEAD_WIDTH = TILE_SIZE / 2
  const RADIUS = TILE_SIZE * (tileSpan - 1)
  const ANGLE_START = 0
  const ANGLE_END = Math.PI - Math.asin(0.25 * (TILE_SIZE * 1.2) / RADIUS)

  create2DArrow(
    vertices,
    normals,
    indices,
    ANGLE_START,
    ANGLE_END,
    RADIUS,
    HALF_TAIL_WIDTH,
    HALF_HEAD_WIDTH
  )

  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i + 1] += TILE_SIZE
    vertices[i + 2] -= 1
  }

  return new Geometry({ vertices, normals, indices })
}

export const SwapGeometries = {}
for (let tileSpan of [2, 3, 4, 5, 6, 7]) {
  SwapGeometries[tileSpan] = makeRotateGeometry(tileSpan)
}

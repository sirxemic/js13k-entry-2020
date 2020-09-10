import { Geometry } from '../Geometry'
import { create2DArrow } from './ArrowBuilder'
import { SHAPE_SIZE } from '../constants'

function makeRotateGeometry (halfSpan, halfArcAngle) {
  const vertices = []
  const indices = []

  const HALF_HORIZONTAL_SPAN = halfSpan * SHAPE_SIZE
  const RADIUS = HALF_HORIZONTAL_SPAN / Math.sin(halfArcAngle)
  const OFFSET = SHAPE_SIZE - HALF_HORIZONTAL_SPAN / Math.tan(halfArcAngle)

  const ANGLE_START = Math.PI / 2 - halfArcAngle
  const ANGLE_END = Math.PI / 2 + halfArcAngle

  create2DArrow(
    vertices,
    indices,
    ANGLE_START,
    ANGLE_END,
    RADIUS,
    true
  )

  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i + 1] += OFFSET
  }

  return new Geometry({ vertices, indices })
}

const settings = [
  [2, 0.7, 1.0],
  [3, 1.7, 0.9],
  [4, 2.6, 0.8],
  [5, 3.5, 0.8],
  [6, 4.4, 0.8],
  [7, 5.3, 0.8],
]

export const SwapGeometries = {}
for (let setting of settings) {
  SwapGeometries[setting[0]] = makeRotateGeometry(setting[1], setting[2])
}

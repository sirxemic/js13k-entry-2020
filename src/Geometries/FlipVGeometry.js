import { Geometry } from '../Geometry'
import { create3DArrow } from './ArrowBuilder'
import { TILE_SIZE } from '../constants'

const vertices = []
const normals = []
const indices = []

const HALF_TAIL_WIDTH = TILE_SIZE / 7
const HALF_HEAD_WIDTH = TILE_SIZE / 2
const HEAD_START = 0.65
const RADIUS = TILE_SIZE * 0.8
const ANGLE_START = 4
const ANGLE_END = 0

create3DArrow(vertices, normals, indices, HALF_TAIL_WIDTH, HALF_HEAD_WIDTH, HEAD_START, (t, width) => {
  const a = ANGLE_START + (ANGLE_END - ANGLE_START) * t
  const x = Math.cos(a) * RADIUS
  const y = Math.sin(a) * RADIUS
  return [
    -width, x, y,
    width, x, y
  ]
}, (t) => {
  const a = ANGLE_START + (ANGLE_END - ANGLE_START) * t
  const dx = Math.cos(a)
  const dy = Math.sin(a)
  return [
    0, dx, dy,
    0, dx, dy
  ]
})

indices.reverse()

export const TheFlipVGeometry = new Geometry({ vertices, normals, indices })
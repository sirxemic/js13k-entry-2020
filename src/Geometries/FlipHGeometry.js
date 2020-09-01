import { Geometry } from '../Geometry'
import { create3DArrow } from './ArrowBuilder'
import { SHAPE_SIZE } from '../constants'

const vertices = []
const normals = []
const indices = []

const HALF_TAIL_WIDTH = SHAPE_SIZE / 6
const HALF_HEAD_WIDTH = SHAPE_SIZE / 2
const HEAD_START = 0.8
const RADIUS = SHAPE_SIZE
const ANGLE_START = -5
const ANGLE_END = -1.8

create3DArrow(vertices, normals, indices, HALF_TAIL_WIDTH, HALF_HEAD_WIDTH, HEAD_START, (t, width) => {
  const a = ANGLE_START + (ANGLE_END - ANGLE_START) * t
  const x = Math.cos(a) * RADIUS
  const y = Math.sin(a) * RADIUS
  const dx = -Math.sin(a)
  const dy = Math.cos(a)
  return [
    y, -width, x,
    y, width, x
  ]
}, (t) => {
  const a = ANGLE_START + (ANGLE_END - ANGLE_START) * t
  const dx = Math.cos(a)
  const dy = Math.sin(a)
  return [
    dy, 0, dx,
    dy, 0, dx
  ]
})

export const TheFlipHGeometry = new Geometry({ vertices, normals, indices })
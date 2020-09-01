import { Geometry } from '../Geometry'
import { create2DArrow } from './ArrowBuilder'
import { SHAPE_SIZE } from '../constants'

const vertices = []
const normals = []
const indices = []

const HALF_TAIL_WIDTH = SHAPE_SIZE / 6
const HALF_HEAD_WIDTH = SHAPE_SIZE / 2
const RADIUS = SHAPE_SIZE * 0.75
const ANGLE_START = -4
const ANGLE_END = -1

create2DArrow(vertices, normals, indices, ANGLE_START, ANGLE_END, RADIUS, HALF_TAIL_WIDTH, HALF_HEAD_WIDTH)

export const RotateGeometry = new Geometry({ vertices, normals, indices })
import { Geometry } from '../Geometry'
import { create2DArrow } from './ArrowBuilder'
import { SHAPE_SIZE } from '../constants'

const vertices = []
const indices = []

const RADIUS = SHAPE_SIZE * 0.75
const ANGLE_START = 0
const ANGLE_END = 2.14

create2DArrow(vertices, indices, ANGLE_START, ANGLE_END, RADIUS)

export const RotateGeometry = new Geometry({ vertices, indices })
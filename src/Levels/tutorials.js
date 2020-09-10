import { TriangleShape, CircleShape, FourShape } from '../Geometries/Shapes'
import { RotateCWAction, RotateCCWAction } from '../Actions/RotateAction'
import { FlipHAction } from '../Actions/FlipHAction'
import { SwapAction } from '../Actions/SwapAction'
import { ShiftAction } from '../Actions/ShiftAction'
import { FlipVAction } from '../Actions/FlipVAction'
import { O1 } from './levelUtils'

export const tutorialLevels = [
  {
    shapes: [FourShape, CircleShape, FourShape],
    orientations: [O1, O1, O1],
    actions: [
      [FlipHAction, 1]
    ]
  },
  {
    shapes: [FourShape, CircleShape, FourShape],
    orientations: [O1, O1, [-1, 0, 0, -1]],
    actions: [
      [FlipVAction, 1]
    ]
  },
  {
    shapes: [FourShape, FourShape, CircleShape],
    orientations: [O1, [-1, 0, 0, 1], O1],
    actions: [
      [SwapAction, 0, 1]
    ]
  },
  {
    shapes: [TriangleShape, CircleShape, TriangleShape],
    orientations: [[0, 1, -1, 0], O1, [0, 1, -1, 0]],
    actions: [
      [FlipHAction, 0],
      [ShiftAction, -2],
      [ShiftAction, 2],
    ]
  },
  {
    shapes: [TriangleShape, TriangleShape, CircleShape, TriangleShape, TriangleShape],
    orientations: [[0, -1, 1, 0], [0, -1, 1, 0], O1, [0, -1, 1, 0], [0, -1, 1, 0]],
    actions: [
      [RotateCCWAction, -2],
      [FlipHAction, -1]
    ]
  },
  {
    shapes: [FourShape, TriangleShape, CircleShape, TriangleShape, FourShape],
    orientations: [O1, O1, O1, O1, [0, -1, -1, 0]],
    actions: [
      [RotateCCWAction, -1],
      [RotateCWAction, -2]
    ]
  }
]
import { TriangleShape, CircleShape, FourShape } from '../Geometries/Shapes'
import { RotateCWAction, RotateCCWAction } from '../Actions/RotateAction'
import { FlipHAction } from '../Actions/FlipHAction'
import { SwapAction } from '../Actions/SwapAction'
import { ShiftAction } from '../Actions/ShiftAction'
import { FlipVAction } from '../Actions/FlipVAction'
import { O1 } from './levelUtils'

export const mediumLevels = [
  {
    shapes: [TriangleShape, TriangleShape, CircleShape, TriangleShape, TriangleShape],
    orientations: [[1, 0, 0, -1], [1, 0, 0, -1], O1, [1, 0, 0, -1], O1],
    actions: [
      [RotateCWAction, -1],
      [FlipHAction, 1],
      [SwapAction, -1, 2],
    ],
    maxMoves: 5,
    timeLimit: 30
  },
  {
    shapes: [FourShape, FourShape, TriangleShape, CircleShape, TriangleShape],
    orientations: [O1, [-1, 0, 0, 1], O1, O1, [-1, 0, 0, 1]],
    actions: [
      [SwapAction, 0, 1, 1],
      [SwapAction, -1, 0],
      [SwapAction, -2, -1, 1]
    ],
    maxMoves: 3,
    timeLimit: 30
  },
]
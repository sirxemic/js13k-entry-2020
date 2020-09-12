import { TriangleShape, CircleShape, FourShape } from '../Geometries/Shapes'
import { RotateCWAction, RotateCCWAction } from '../Actions/RotateAction'
import { FlipHAction } from '../Actions/FlipHAction'
import { SwapAction } from '../Actions/SwapAction'
import { ShiftAction } from '../Actions/ShiftAction'
import { FlipVAction } from '../Actions/FlipVAction'
import { O1 } from './levelUtils'

export const hardLevels = [
  {
    shapes: [FourShape, FourShape, FourShape, FourShape, FourShape, FourShape, CircleShape],
    orientations: [O1, [1, 0, 0, -1], [-1, 0, 0, 1], [0, 1, 1, 0], [0, 1, -1, 0], [0, -1, -1, 0], O1],
    actions: [
      [FlipVAction, -3],
      [RotateCCWAction, -1],
      [RotateCWAction, 1],
      [FlipHAction, 3],
      [ShiftAction, -4],
      [ShiftAction, 4]
    ],
    maxMoves: 7,
    timeLimit: 60
  }
]
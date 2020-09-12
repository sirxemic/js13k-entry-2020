import { TriangleShape, CircleShape, FourShape } from '../Geometries/Shapes'
import { RotateCWAction, RotateCCWAction } from '../Actions/RotateAction'
import { FlipHAction } from '../Actions/FlipHAction'
import { SwapAction } from '../Actions/SwapAction'
import { ShiftAction } from '../Actions/ShiftAction'
import { FlipVAction } from '../Actions/FlipVAction'
import { O1 } from './levelUtils'

export const easyLevels = [
  {
    shapes: [FourShape, TriangleShape, TriangleShape, FourShape, CircleShape],
    orientations: [O1, O1, [1, 0, 0, -1], [1, 0, 0, -1], O1],
    actions: [
      [RotateCCWAction, 0],
      [ShiftAction, -3]
    ],
    maxMoves: 6,
    timeLimit: 30
  },
]
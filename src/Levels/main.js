import { TriangleShape, CircleShape, FourShape, UShape } from '../Geometries/Shapes'
import { RotateCWAction, RotateCCWAction } from '../Actions/RotateAction'
import { FlipHAction } from '../Actions/FlipHAction'
import { SwapAction } from '../Actions/SwapAction'
import { ShiftAction } from '../Actions/ShiftAction'
import { FlipVAction } from '../Actions/FlipVAction'
import { O1, H1, V1 } from './levelUtils'

export const mainLevels = [
  // Level 1
  {
    shapes: [CircleShape, FourShape, FourShape],
    orientations: [O1, [0, 1, 1, 0], O1],
    actions: [
      [RotateCCWAction, 0],
      [ShiftAction, 2]
    ],
    maxMoves: 2,
    timeLimit: 30
  },

  // Level 2
  {
    shapes: [FourShape, FourShape, TriangleShape, TriangleShape, CircleShape],
    orientations: [O1, H1, H1, O1, O1],
    actions: [
      [ShiftAction, -3],
      [SwapAction, 0, 1]
    ],
    maxMoves: 2,
    timeLimit: 30
  },

  // Level 3
  {
    shapes: [UShape, CircleShape, UShape],
    orientations: [O1, O1, V1],
    actions: [
      [FlipVAction, 0],
      [ShiftAction, -2],
      [ShiftAction, 2]
    ],
    maxMoves: 3,
    timeLimit: 30
  },

  // Level 4
  {
    shapes: [TriangleShape, TriangleShape, CircleShape],
    orientations: [O1, O1, O1],
    actions: [
      [SwapAction, -1, 0],
      [FlipHAction, 1],
      [ShiftAction, 2],
    ],
    maxMoves: 3,
    timeLimit: 30
  },

  // Level 5
  {
    shapes: [TriangleShape, TriangleShape, TriangleShape, CircleShape, TriangleShape, TriangleShape, TriangleShape],
    orientations: [V1, H1, O1, O1, H1, H1, [-1, 0, 0, -1]],
    actions: [
      [RotateCWAction, -3],
      [RotateCWAction, -2],
      [RotateCWAction, -1],
      [RotateCCWAction, 1],
      [RotateCCWAction, 2],
      [RotateCCWAction, 3],
    ],
    maxMoves: 1,
    timeLimit: 30
  },

  // Level 6
  {
    shapes: [FourShape, TriangleShape, FourShape, CircleShape, TriangleShape],
    orientations: [[0,-1,1,0], H1, [0,-1,-1,0], O1, O1],
    actions: [
      [ShiftAction, -3],
      [ShiftAction, 3],
      [SwapAction, -2, -1],
    ],
    maxMoves: 2,
    timeLimit: 30
  },

  // Level 7
  {
    shapes: [TriangleShape, UShape, CircleShape, UShape, TriangleShape],
    orientations: [[0, 1, -1, 0], O1, O1, V1, [0, 1, -1, 0]],
    actions: [
      [RotateCCWAction, -2],
      [RotateCCWAction, -1],
      [RotateCWAction, 1],
    ],
    maxMoves: 3,
    timeLimit: 30
  },

  // Level 8
  {
    shapes: [CircleShape, TriangleShape, UShape, UShape, TriangleShape],
    orientations: [O1, [-1,0,0,-1], [0,1,1,0], V1, [0,-1,-1,0]],
    actions: [
      [RotateCCWAction, -1],
      [RotateCWAction, 0],
      [ShiftAction, 3],
    ],
    maxMoves: 4,
    timeLimit: 30
  },

  // Level 9
  {
    shapes: [FourShape, FourShape, TriangleShape, CircleShape, TriangleShape],
    orientations: [O1, V1, [0,-1,1,0], O1, [0,-1,-1,0]],
    actions: [
      [RotateCCWAction, -1],
      [ShiftAction, -3],
      [RotateCWAction, 0],
    ],
    maxMoves: 3,
    timeLimit: 30
  },

  // Level 10
  {
    shapes: [FourShape, UShape, CircleShape, FourShape, UShape],
    orientations: [H1, O1, O1, O1, O1],
    actions: [
      [ShiftAction, -3, 0],
      [ShiftAction, 3, 0],
      [SwapAction, -2, 2, 1]
    ],
    maxMoves: 3,
    timeLimit: 30
  },

  // Level 11
  {
    shapes: [UShape, CircleShape, TriangleShape, UShape, TriangleShape],
    orientations: [[0,-1,1,0], O1, H1, [0,-1,-1,0], H1],
    actions: [
      [ShiftAction, 3],
      [FlipHAction, 0],
      [SwapAction, -2, 2],
    ],
    maxMoves: 3,
    timeLimit: 30
  },

  // Level 12
  {
    shapes: [FourShape, FourShape, TriangleShape, CircleShape, TriangleShape],
    orientations: [O1, H1, O1, O1, H1],
    actions: [
      [SwapAction, 0, 1, 1],
      [SwapAction, -1, 0],
      [SwapAction, -2, -1, 1]
    ],
    maxMoves: 3,
    timeLimit: 30
  },

  // Level 13
  {
    shapes: [TriangleShape, TriangleShape, TriangleShape, CircleShape, TriangleShape],
    orientations: [V1, V1, [0,-1,1,0], O1, [0,-1,1,0]],
    actions: [
      [ShiftAction, -3],
      [FlipHAction, -2],
      [ShiftAction, 3],
    ],
    maxMoves: 5,
    timeLimit: 30
  },

  // Level 14
  {
    shapes: [TriangleShape, TriangleShape, CircleShape, TriangleShape, TriangleShape],
    orientations: [V1, V1, O1, V1, O1],
    actions: [
      [RotateCWAction, -1],
      [FlipHAction, 1],
      [SwapAction, -1, 2, 1],
    ],
    maxMoves: 5,
    timeLimit: 45
  },

  // Level 15
  {
    shapes: [UShape, UShape, FourShape, FourShape, CircleShape],
    orientations: [O1, [0,-1,-1,0], [0,1,-1,0], [0,1,1,0], O1],
    actions: [
      [RotateCWAction, -1],
      [ShiftAction, 3],
      [SwapAction, -2, 1],
    ],
    maxMoves: 5,
    timeLimit: 45
  },

  // Level 16
  {
    shapes: [FourShape, CircleShape, FourShape, FourShape, FourShape],
    orientations: [[0,-1,-1,0], O1, V1, H1, [0,1,1,0]],
    actions: [
      [SwapAction, -2, -1],
      [FlipVAction, -2],
      [ShiftAction, 3],
    ],
    maxMoves: 5,
    timeLimit: 45
  },

  // Level 17
  {
    shapes: [FourShape, CircleShape, TriangleShape, TriangleShape, FourShape],
    orientations: [O1, O1, [0, 1, -1, 0], H1, H1],
    actions: [
      [ShiftAction, -3, 0],
      [ShiftAction, 3, 0],
      [RotateCCWAction, 0, 0, 1],
      [SwapAction, -1, 0, 1]
    ],
    maxMoves: 4,
    timeLimit: 45
  },

  // Level 18
  {
    shapes: [CircleShape, FourShape, UShape, UShape, FourShape],
    orientations: [O1, V1, [0, -1, 1, 0], [0, -1, -1, 0], [0, 1, -1, 0]],
    actions: [
      [RotateCCWAction, -2],
      [SwapAction, -1, 0],
      [SwapAction, -2, 0, 1],
      [SwapAction, 0, 2, 1],
    ],
    maxMoves: 5,
    timeLimit: 45
  },

  // Level 19
  {
    shapes: [UShape, FourShape, UShape, FourShape, CircleShape],
    orientations: [H1, [-1,0,0,-1], O1, O1, O1],
    actions: [
      [ShiftAction, -3],
      [RotateCCWAction, -1],
      [FlipHAction, 1],
      [SwapAction, -2, 2],
      [RotateCCWAction, 0],
    ],
    maxMoves: 6,
    timeLimit: 45
  },

  // Level 20
  {
    shapes: [FourShape, FourShape, UShape, UShape, CircleShape],
    orientations: [[0,1,1,0], [0,1,1,0], [0,-1,-1,0], [0,-1,1,0], O1],
    actions: [
      [FlipHAction, -1],
      [RotateCCWAction, -2],
      [SwapAction, -2, 1],
      [ShiftAction, 3],
    ],
    maxMoves: 5,
    timeLimit: 45
  },

  // Level 21
  {
    shapes: [FourShape, FourShape, FourShape, FourShape, FourShape, FourShape, CircleShape],
    orientations: [O1, V1, H1, [0, 1, 1, 0], [0, 1, -1, 0], [0, -1, -1, 0], O1],
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
  },

  // Level 22
  {
    shapes: [UShape, FourShape, FourShape, UShape, CircleShape, UShape, UShape],
    orientations: [[0,1,-1,0], [0,1,-1,0], H1, [0,1,1,0], O1, [0,-1,-1,0], [0,-1,1,0]],
    actions: [
      [ShiftAction, -4],
      [SwapAction, 1, 2],
      [SwapAction, -2, 2, 1],
      [SwapAction, -1, 3],
      [RotateCWAction, -1],
    ],
    maxMoves: 5,
    timeLimit: 60
  },

  // Level 23
  {
    shapes: [CircleShape, FourShape, TriangleShape, TriangleShape, TriangleShape, FourShape, TriangleShape],
    orientations: [O1, [-1,0,0,-1], [0,-1,-1,0], [0,-1,-1,0], [0,1,-1,0], [0,-1,-1,0], [0,-1,1,0]],
    actions: [
      [RotateCCWAction, -1],
      [ShiftAction, -4],
      [RotateCCWAction, 1],
      [SwapAction, 1, 2, 1],
      [SwapAction, -3, 0],
    ],
    maxMoves: 6,
    timeLimit: 60
  },
]
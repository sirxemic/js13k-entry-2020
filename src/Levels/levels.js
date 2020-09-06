import { FourShape, CircleShape, TriangleShape } from '../Geometries/Shapes'
import { FlipHAction } from '../Actions/FlipHAction'
import { FlipVAction } from '../Actions/FlipVAction'
import { SwapAction } from '../Actions/SwapAction'
import { RotateCWAction, RotateCCWAction } from '../Actions/RotateAction'
import { ShiftAction } from '../Actions/ShiftAction'

const O1 = [1, 0, 0, 1]

export const tutorialCount = 4

export const startScreen = {
  shapes: [FourShape, CircleShape, FourShape],
  orientations: [O1, O1, O1],
  actions: []
}

export const levels = [
  // Tutorials
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
    orientations: [O1, O1, O1],
    actions: [
      [FlipHAction, 0],
      [ShiftAction, -2],
      [ShiftAction, 2],
    ]
  },

  // Normal levels
  {
    shapes: [TriangleShape, TriangleShape, CircleShape, TriangleShape, TriangleShape],
    orientations: [[1, 0, 0, -1], [1, 0, 0, -1], O1, [1, 0, 0, -1], O1],
    actions: [
      [RotateCWAction, -1],
      [FlipHAction, 1],
      [SwapAction, -1, 2],
    ]
  },
  {
    shapes: [FourShape, FourShape, TriangleShape, CircleShape, TriangleShape],
    orientations: [O1, [-1, 0, 0, 1], O1, O1, [-1, 0, 0, 1]],
    actions: [
      [SwapAction, 0, 1, 1],
      [SwapAction, -1, 0],
      [SwapAction, -2, -1, 1]
    ]
  },
  {
    shapes: [FourShape, TriangleShape, TriangleShape, FourShape, CircleShape],
    orientations: [O1, O1, [1, 0, 0, -1], [1, 0, 0, -1], O1],
    actions: [
      [RotateCCWAction, 0],
      [ShiftAction, -3]
    ]
  },
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
    ]
  },
]

export function isTutorialLevel (index) {
  return index < tutorialCount
}

export function getLevelLabel (index) {
  return isTutorialLevel(index) ? 'TUTORIAL' : `LEVEL ${index - tutorialCount + 1}`
}
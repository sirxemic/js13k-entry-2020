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
      [ShiftAction, 2]
    ]
  },

  // Easy levels
  {
    shapes: [FourShape, TriangleShape, TriangleShape, FourShape, CircleShape],
    orientations: [O1, O1, [1, 0, 0, -1], [1, 0, 0, -1], O1],
    actions: [
      [RotateCWAction, 0],
      [ShiftAction, -3]
    ]
  },
  {
    shapes: [TriangleShape, FourShape, FourShape, TriangleShape, CircleShape],
    orientations: [O1, O1, [1, 0, 0, -1], [1, 0, 0, -1], O1],
    actions: [
      [RotateCWAction, 0],
      [ShiftAction, -3]
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
    shapes: [FourShape, FourShape, FourShape, FourShape, CircleShape],
    orientations: [O1, O1, [1, 0, 0, -1], [1, 0, 0, -1], O1],
    actions: [
      [RotateCWAction, 0],
      [ShiftAction, -3]
    ]
  },
  {
    shapes: [FourShape, FourShape, FourShape, FourShape, CircleShape],
    orientations: [O1, O1, [1, 0, 0, -1], [1, 0, 0, -1], O1],
    actions: [
      [RotateCWAction, 0],
      [ShiftAction, -3]
    ]
  }

  // Medium levels

]

export function isTutorialLevel (index) {
  return index < tutorialCount
}

export function getLevelLabel (index) {
  return isTutorialLevel(index) ? 'TUTORIAL' : `LEVEL ${index - tutorialCount + 1}`
}
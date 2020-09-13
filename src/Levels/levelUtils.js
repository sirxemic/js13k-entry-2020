import { FourShape } from '../Geometries/Shapes'
import { pick } from '../utils'
import { RotateCWAction, RotateCCWAction } from '../Actions/RotateAction'

export const O1 = [1, 0, 0, 1]
export const H1 = [-1, 0, 0, 1]
export const V1 = [1, 0, 0, -1]

export function randomizeLevel (level) {
  const e1 = pick(1, -1)
  const e2 = pick(1, -1)
  const [a1, b1, c1, d1] = pick([e1, 0, 0, e2], [0, e1, e2, 0])
  for (let i = 0; i < level.shapes.length; i++) {
    if (level.shapes[i] === FourShape) {
      const [a2, b2, c2, d2] = level.orientations[i]
      level.orientations[i] = [
        a2 * a1 + c2 * b1,
        b2 * a1 + d2 * b1,
        a2 * c1 + c2 * d1,
        b2 * c1 + d2 * d1
      ]
    }
  }
  switch (pick(0,1,2,3)) {
    case 0:
      // Flip 180 degrees
      level.shapes.reverse()
      level.orientations.reverse()
      level.orientations = level.orientations.map(([a, b, c, d]) => [-a, -b, -c, -d])
      level.actions.reverse()
      for (let action of level.actions) {
        action[1] *= -1
        if (action.length >= 3) action[2] *= -1
      }
      break
    case 1:
      // Flip horizontally
      level.shapes.reverse()
      level.orientations.reverse()
      level.orientations = level.orientations.map(([a, b, c, d]) => [-a, b, -c, d])
      level.actions.reverse()
      for (let action of level.actions) {
        if (action[0] === RotateCWAction) action[0] = RotateCCWAction
        else if (action[0] === RotateCCWAction) action[0] = RotateCWAction
        action[1] *= -1
        if (action.length >= 3) action[2] *= -1
      }
      break
    case 2:
      // Flip vertically
      level.orientations = level.orientations.map(([a, b, c, d]) => [a, -b, c, -d])
      for (let action of level.actions) {
        if (action[0] === RotateCWAction) action[0] = RotateCCWAction
        else if (action[0] === RotateCCWAction) action[0] = RotateCWAction
      }
      break
  }
  return level
}

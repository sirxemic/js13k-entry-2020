import { FourShape, CircleShape, TriangleShape, UShape } from './Geometries/Shapes'
import { tutorialLevels } from './Levels/tutorials'
import { mainLevels } from './Levels/main'
import { O1, H1 } from './Levels/levelUtils'

const bookend = {
  shapes: [TriangleShape, UShape, FourShape, CircleShape, FourShape, UShape, TriangleShape],
  orientations: [O1, O1, O1, O1, H1, H1, H1],
  actions: []
}

export const startScreen = bookend

export const tutorialCount = tutorialLevels.length

export const levels = [
  ...tutorialLevels,
  ...mainLevels,
  bookend
]

export function isTutorialLevel (index) {
  return index < tutorialCount
}

export function getLevelLabel (index) {
  return isTutorialLevel(index) ? 'TUTORIAL' : `PUZZLE ${index - tutorialCount + 1}`
}
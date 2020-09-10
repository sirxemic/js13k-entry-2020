import { FourShape, CircleShape } from '../Geometries/Shapes'
import { tutorialLevels } from './tutorials'
import { easyLevels } from './easy'
import { mediumLevels } from './medium'
import { hardLevels } from './hard'
import { randomizeLevel, O1 } from './levelUtils'

const bookend = {
  shapes: [FourShape, CircleShape, FourShape],
  orientations: [O1, O1, O1],
  actions: []
}

export const startScreen = bookend

export const tutorialCount = tutorialLevels.length

export const levels = [
  ...tutorialLevels,
  ...easyLevels.map(randomizeLevel),
  ...mediumLevels.map(randomizeLevel),
  ...hardLevels.map(randomizeLevel),
  bookend
]

export function isTutorialLevel (index) {
  return index < tutorialCount
}

export function getLevelLabel (index) {
  return isTutorialLevel(index) ? 'TUTORIAL' : `PUZZLE ${index - tutorialCount + 1}`
}
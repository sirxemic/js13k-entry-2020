import { isTutorialLevel, getLevelLabel } from './Levels/levels'
import { score, time } from './globals'
import { classNames } from './classNames'

if (process.env.NODE_ENV === 'development') {
  for (let key in classNames) {
    classNames[key] = key
  }
}

function getElement (name) {
  return document.querySelector('.' + name)
}

const scoreDisplay = getElement(classNames.scoreText)
const timeDisplay = getElement(classNames.timeText)
const levelDisplay = getElement(classNames.levelLabel)

function getSpan (d) {
  return `<span class="${classNames.glyph}">${d}</span>`
}

function makeSpanned (n) {
  return [...n].map(getSpan).join('')
}

export function updateLevelDisplay (levelIndex) {
  if (isTutorialLevel(levelIndex)) {
    document.body.className = classNames.stateTutorial
  } else {
    document.body.className = classNames.statePlaying
  }
  levelDisplay.textContent = getLevelLabel(levelIndex)
}

let displayedScore = 0

export function updateUI () {
  displayedScore += (score - displayedScore) * 0.25
  const scoreString = '' + Math.round(displayedScore)
  scoreDisplay.innerHTML = makeSpanned(scoreString.padStart(10, '0'))

  const timeParts = time.toFixed(2).split('.')
  timeDisplay.innerHTML = makeSpanned(timeParts[0]) + '.' + makeSpanned(timeParts[1])
}

export function showStart (callback) {
  document.body.className = classNames.stateMainMenu
  getElement(classNames.startButton).addEventListener('click', callback)
}

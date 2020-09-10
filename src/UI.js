import { isTutorialLevel, getLevelLabel } from './Levels/levels'
import { score, time, delta, lives } from './globals'
import { classNames } from './classNames'

if (process.env.NODE_ENV === 'development') {
  for (let key in classNames) {
    classNames[key] = key
  }
}

function getElement (name) {
  return document.querySelector('.' + name)
}

const startButton = getElement(classNames.startButton)
const startTutorialButton = getElement(classNames.startTutorialButton)
const scoreDisplay = getElement(classNames.scoreText)
const scoreAddDisplay = getElement(classNames.scoreAddText)
const timeDisplay = getElement(classNames.timeText)
const levelDisplay = getElement(classNames.levelLabel)
const livesDisplay = getElement(classNames.livesText)
const finalScoreDiv = getElement(classNames.finalScoreDiv)

function getDigitStyle () {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const style = getComputedStyle(document.body)
  ctx.font = `${style.fontSize} ${style.fontFamily}`
  return `width:${ctx.measureText('0').width / parseInt(style.fontSize)}em`
}

const glyphStyle = getDigitStyle()

function getSpan (d) {
  return `<span class="${classNames.glyph}" style="${glyphStyle}">${d}</span>`
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

let animatedScore = 0

export function updateUI () {
  animatedScore += (score - animatedScore) * (1 - Math.exp(-8 * delta))
  const displayedScore = Math.ceil(animatedScore)
  const scoreString = '' + displayedScore
  scoreDisplay.innerHTML = makeSpanned(scoreString.padStart(8, '0'))

  const diff = score - displayedScore
  scoreAddDisplay.innerHTML = diff > 0 ? makeSpanned('+' + diff) : ''

  const timeParts = time.toFixed(2).split('.')
  timeDisplay.innerHTML = makeSpanned(timeParts[0]) + '.' + makeSpanned(timeParts[1])

  livesDisplay.textContent = lives
}

export function showStart (callback) {
  document.body.className = classNames.stateMainMenu
  startButton.addEventListener('click', () => callback(false))
  startTutorialButton.addEventListener('click', () => callback(true))
}

export function showFinalScore () {
  document.body.className = classNames.stateEnd
  finalScoreDiv.appendChild(scoreDisplay)
}

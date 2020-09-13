import { isTutorialLevel, getLevelLabel } from './levelsEntry'
import { score, time, delta, lives, updateShowTutorial, showTutorial, updateCasualMode, casualMode, slowDownTime } from './globals'
import { classNames } from './classNames'

if (process.env.NODE_ENV === 'development') {
  for (let key in classNames) classNames[key] = key
}

function getElement (name) {
  return document.querySelector('.' + name)
}

const startButton = getElement(classNames.startButton)
const scoreDisplay = getElement(classNames.scoreText)
const scoreAddDisplay = getElement(classNames.scoreAddText)
const timeDisplay = getElement(classNames.timeText)
const levelDisplay = getElement(classNames.levelLabel)
const livesDisplay = getElement(classNames.livesText)
const movesDiv = getElement(classNames.movesDiv)
const tutorialOption = getElement(classNames.tutorialOption)
const highscoreOption = getElement(classNames.highscoreOption)
const undoButton = getElement(classNames.undoButton)

const mainUi = getElement(classNames.mainUi)
const finalScoreScreen = getElement(classNames.finalScoreScreen)
const casualEndScreen = getElement(classNames.casualEndScreen)
const mainMenu = getElement(classNames.mainMenu)

function toggleElement (element, show) {
  if (element._show === show) return
  element._show = show
  if (show) {
    element.style.display = 'block'
    element.style.opacity = 0
    setTimeout(() => element.style.opacity = 1, 0)
  } else {
    element.style.display = 'block'
    element.style.opacity = 0
    setTimeout(() => element.style.display = 'none', 200)
  }
}

function setScreen (newScreen) {
  [mainUi, finalScoreScreen, casualEndScreen, mainMenu].forEach(screen => toggleElement(screen, screen === newScreen))
}

function updateStartState () {
  tutorialOption.classList.toggle(classNames.selectedOption, showTutorial)
  highscoreOption.classList.toggle(classNames.selectedOption, casualMode)
  document.body.classList.toggle(classNames.stateCasualMode, casualMode)
}

tutorialOption.onclick = () => {
  updateShowTutorial()
  updateStartState()
}
highscoreOption.onclick = () => {
  updateCasualMode()
  updateStartState()
}

updateStartState()

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
  setScreen(mainUi)
  document.body.classList.toggle(classNames.stateTutorial, isTutorialLevel(levelIndex))
  levelDisplay.textContent = getLevelLabel(levelIndex)
}

let animatedScore = 0

export function updateUI () {
  if (score > animatedScore) {
    animatedScore += (score - animatedScore) * (1 - Math.exp(-8 * delta))
  } else {
    animatedScore = 0
  }
  const displayedScore = Math.ceil(animatedScore)
  const scoreString = '' + displayedScore
  scoreDisplay.innerHTML = makeSpanned(scoreString.padStart(8, '0'))

  const diff = score - displayedScore
  scoreAddDisplay.innerHTML = diff > 0 ? '+' + makeSpanned(''+diff) : ''

  const timeParts = time.toFixed(2).split('.')
  timeDisplay.innerHTML = makeSpanned(timeParts[0]) + '.' + makeSpanned(timeParts[1])

  livesDisplay.textContent = lives
}

export function showStart (callback) {
  setScreen(mainMenu)
  scoreAddDisplay.parentElement.insertBefore(scoreDisplay, scoreAddDisplay)
  startButton.onclick = callback
}

export function showFinalScore (finish) {
  setScreen(finalScoreScreen)
  getElement(classNames.endText).textContent = finish ? 'THE END' : 'GAME OVER'
  finalScoreScreen.appendChild(scoreDisplay)
}

export function showEndCard () {
  setScreen(casualEndScreen)
}

export function toggleMovesLeft (show) {
  toggleElement(movesDiv, show)
}

export function updateMovesLeft (amount) {
  movesDiv.textContent = amount === 1 ? '1 MOVE LEFT' : `${amount} MOVES LEFT`
}

export function bindUndo (callback) {
  undoButton.onclick = callback
  document.onkeypress = (e) => {
    if (e.key === 'z') callback()
  }
}

export function toggleUndoButton (show) {
  toggleElement(undoButton, show)
}

function processMonetization () {
  const el = getElement(classNames.monetizationPopup)
  slowDownTime()
  toggleElement(el, true)
  setTimeout(() => {
    toggleElement(el, false)
  }, 7000)
}

if (document['monetization']) {
  document['monetization'].addEventListener('monetizationstart', processMonetization)
}

import { Puzzle } from './Puzzle'
import { BackgroundShader } from './Shaders/BackgroundShader'
import { TheRollercoasterShader } from './Shaders/RollercoasterShader'
import { TheRollercoasterGeometry } from './Geometries/RollercoasterGeometry'
import { TheCamera } from './Camera'
import { gl, TheCanvas } from './Graphics'
import { Input } from './Input'
import { BackgroundGeometry } from './Geometries/BackgroundGeometry'
import { warpRenderTarget } from './RenderTarget'
import { levels, tutorialCount, startScreen } from './Levels/levels'
import { FSM } from './FSM'
import { delta, setDelta } from './globals'
import { TIME_LIMIT } from './constants'

const startButton = document.querySelector('.bd')
const tutorialButton = document.querySelector('.bd2')
const scoreDisplay = document.querySelector('.s')
const timeDisplay = document.querySelector('.t')
const levelDisplay = document.querySelector('.l')

function resizeCanvas () {
  TheCanvas.width = window.innerWidth
  TheCanvas.height = window.innerHeight
  warpRenderTarget.resize(TheCanvas.width, TheCanvas.height)
}

resizeCanvas()
window.onresize = resizeCanvas

const STATE_START_SCREEN = 0
const STATE_PLAYING = 1
const STATE_SOLVE_TRANSITION = 2
const STATE_FAIL_TRANSITION = 3

let levelIndex = 0
let nextLevelIndex
let currentPuzzle = new Puzzle(startScreen)
let nextPuzzle
let time = 0
let score = 0
let transitionTime

function getSpan (d) {
  return `<span class="g">${d}</span>`
}

function makeSpanned (n) {
  return [...n].map(getSpan).join('')
}

function updateUI () {
  const scoreString = '' + score
  scoreDisplay.innerHTML = makeSpanned(scoreString.padStart(10 - scoreString.length, '0'))

  const timeParts = time.toFixed(2).split('.')
  timeDisplay.innerHTML = makeSpanned(timeParts[0]) + '.' + makeSpanned(timeParts[1])
}

const gameFSM = new FSM({
  [STATE_START_SCREEN]: {
    execute () {
      currentPuzzle.offset -= currentPuzzle.offset * (1 - Math.exp(-10 * delta))
    }
  },

  [STATE_PLAYING]: {
    enter () {
      levelDisplay.textContent = levelIndex < tutorialCount ? 'TUTORIAL' : `LEVEL ${levelIndex - tutorialCount + 1}`
      currentPuzzle.offset = 0
      currentPuzzle.isActive = true
      time = TIME_LIMIT
    },
    execute () {
      if (currentPuzzle.done) {
        gameFSM.setState(STATE_SOLVE_TRANSITION)
      } else if (levelIndex >= tutorialCount) {
        const x = (TIME_LIMIT - time) / TIME_LIMIT
        nextPuzzle.offset = -Math.PI + Math.PI * x ** 0.25
        time -= delta
        if (time <= 0) {
          time = 0
          gameFSM.setState(STATE_FAIL_TRANSITION)
        }
      }
    }
  },

  [STATE_SOLVE_TRANSITION]: {
    enter () {
      currentPuzzle.isActive = false
      transitionTime = 0
    },
    execute () {
      transitionTime += delta
      currentPuzzle.offset = transitionTime / 100
      nextPuzzle.offset -= nextPuzzle.offset * (1 - Math.exp(-10 * delta))
      if (transitionTime > 1) {
        currentPuzzle.offset = 0
        currentPuzzle = nextPuzzle
        levelIndex = nextLevelIndex
        if (nextLevelIndex < levels.length - 1) {
          nextLevelIndex++
        }
        nextPuzzle = new Puzzle(levels[nextLevelIndex])

        gameFSM.setState(STATE_PLAYING)
      }
    }
  },
  [STATE_FAIL_TRANSITION]: {
    enter () {
      currentPuzzle.setFailed()
    },
    execute () {
      nextPuzzle.offset -= nextPuzzle.offset * (1 - Math.exp(-10 * delta))
      if (nextPuzzle.offset > -0.000001) {
        nextPuzzle.offset = 0
        currentPuzzle = nextPuzzle
        levelIndex = Math.min(levelIndex + 1, levels.length - 2)
        nextPuzzle = new Puzzle(levels[levelIndex + 1])

        gameFSM.setState(STATE_PLAYING)
      }
    }
  }
}, STATE_START_SCREEN)

startButton.addEventListener('click', () => {
  currentPuzzle.isActive = false
  nextLevelIndex = levelIndex + 1
  nextPuzzle = new Puzzle(levels[levelIndex])
  gameFSM.setState(STATE_SOLVE_TRANSITION)
  document.body.className = 's2'
})

let lastTime = 0
function tick (time) {
  requestAnimationFrame(tick)

  setDelta(Math.min(1/60, Math.max(0.5, (time - lastTime) / 1000)))
  lastTime = time
  if (isNaN(delta)) {
    return
  }

  TheCamera.step()

  gameFSM.step()

  currentPuzzle.step()
  if (nextPuzzle) nextPuzzle.step()

  Input.postUpdate()

  gl.viewport(0, 0, TheCanvas.width, TheCanvas.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  BackgroundShader.use()
  BackgroundGeometry.draw()

  gl.clear(gl.DEPTH_BUFFER_BIT)

  TheRollercoasterShader.use()
  TheRollercoasterGeometry.draw()

  // Because of shape depth hack, render next before current, so maybe get rid of hack if time and/or space allows
  if (nextPuzzle) nextPuzzle.render()
  currentPuzzle.render()

  updateUI()
}

tick()
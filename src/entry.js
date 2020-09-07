import { Puzzle } from './Puzzle'
import { BackgroundShader } from './Shaders/BackgroundShader'
import { TheRollercoasterShader } from './Shaders/RollercoasterShader'
import { TheRollercoasterGeometry } from './Geometries/RollercoasterGeometry'
import { TheCamera } from './Camera'
import { gl, TheCanvas } from './Graphics'
import { Input } from './Input'
import { BackgroundGeometry } from './Geometries/BackgroundGeometry'
import { warpRenderTarget } from './RenderTarget'
import { levels, startScreen, isTutorialLevel } from './Levels/levels'
import { FSM } from './FSM'
import { delta, setDelta, time, setTime, updateTime, addToScore, levelIndex, setLevelIndex } from './globals'
import { TIME_LIMIT } from './constants'
import { updateUI, updateLevelDisplay, showStart } from './UI'
import { loadAssets, MainSong, SuccessJingle, FailSound } from './Assets'
import { TheAudioContext } from './Audio/Context'
import { playSample } from './Audio'
import { Quad } from './Geometries/Quad'
import { VignetteShader } from './Shaders/VignetteShader'

function resizeCanvas () {
  TheCanvas.width = window.innerWidth
  TheCanvas.height = window.innerHeight
  warpRenderTarget.resize(TheCanvas.width, TheCanvas.height)
}

resizeCanvas()
window.onresize = resizeCanvas

let nextLevelIndex
let currentPuzzle = new Puzzle(startScreen)
let nextPuzzle
let transitionTime = 0

const STATE_INIT = 0
const STATE_START_SCREEN = 1
const STATE_PLAYING = 2
const STATE_SOLVE_TRANSITION = 3
const STATE_FAIL_TRANSITION = 4

const gameFSM = new FSM({
  [STATE_INIT]: {
    execute () {
      currentPuzzle.offset -= currentPuzzle.offset * (1 - Math.exp(-10 * delta))
      transitionTime += delta
      if (transitionTime > 1.5) {
        gameFSM.setState(STATE_START_SCREEN)
      }
    }
  },

  [STATE_START_SCREEN]: {
    enter () {
      showStart(async () => {
        await TheAudioContext.resume()
        MainSong.play()
        currentPuzzle.isActive = false
        nextLevelIndex = levelIndex + 1
        nextPuzzle = new Puzzle(levels[levelIndex])
        updateLevelDisplay(levelIndex)
        gameFSM.setState(STATE_SOLVE_TRANSITION)
      })
    },

    execute () {
      currentPuzzle.offset -= currentPuzzle.offset * (1 - Math.exp(-10 * delta))
    }
  },

  [STATE_PLAYING]: {
    enter () {
      updateLevelDisplay(levelIndex)

      currentPuzzle.offset = 0
      currentPuzzle.isActive = true
      setTime(TIME_LIMIT)
    },

    execute () {
      if (currentPuzzle.isDone) {
        gameFSM.setState(STATE_SOLVE_TRANSITION)
      } else if (!isTutorialLevel(levelIndex)) {
        const x = (TIME_LIMIT - time) / TIME_LIMIT
        nextPuzzle.offset = -Math.PI + Math.PI * x ** 0.25
        updateTime(delta)
        if (time <= 0) {
          setTime(0)
          gameFSM.setState(STATE_FAIL_TRANSITION)
        }
      }
    }
  },

  [STATE_SOLVE_TRANSITION]: {
    enter () {
      playSample(SuccessJingle, 1, true)
      if (!isTutorialLevel(levelIndex)) {
        addToScore(Math.ceil((time + 5 * (1 + Math.floor(levelIndex / 2))) * 100) * 10)
      }
      currentPuzzle.isActive = false
      transitionTime = 0
    },

    execute () {
      transitionTime += delta * 0.75
      currentPuzzle.offset = (transitionTime ** 2) / 100
      nextPuzzle.offset -= nextPuzzle.offset * (1 - Math.exp(-8 * delta))
      if (transitionTime > 1) {
        currentPuzzle.offset = 0
        currentPuzzle = nextPuzzle
        setLevelIndex(nextLevelIndex)
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
      playSample(FailSound, 0.1, true)
      currentPuzzle.setFailed()
      transitionTime = 0
    },
    execute () {
      transitionTime += delta
      currentPuzzle.offset = transitionTime / 100
      nextPuzzle.offset -= nextPuzzle.offset * (1 - Math.exp(-10 * delta))
      if (transitionTime > 1) {
        currentPuzzle.offset = 0
        currentPuzzle = nextPuzzle
        setLevelIndex(nextLevelIndex)
        if (nextLevelIndex < levels.length - 1) {
          nextLevelIndex++
        }
        nextPuzzle = new Puzzle(levels[nextLevelIndex])

        gameFSM.setState(STATE_PLAYING)
      }
    }
  }
}, STATE_INIT)

function step () {
  TheCamera.step()

  gameFSM.step()

  currentPuzzle.step()
  if (nextPuzzle) nextPuzzle.step()

  Input.postUpdate()
}

function render () {
  gl.viewport(0, 0, TheCanvas.width, TheCanvas.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  BackgroundShader.use()
  BackgroundGeometry.draw()

  gl.clear(gl.DEPTH_BUFFER_BIT)

  TheRollercoasterShader.use()
  TheRollercoasterGeometry.draw()

  currentPuzzle.render()
  if (nextPuzzle) nextPuzzle.render()
}

let lastTime = 0
function tick (time) {
  requestAnimationFrame(tick)

  setDelta(Math.min(1/60, Math.max(0.5, (time - lastTime) / 1000)))
  lastTime = time
  if (isNaN(delta)) {
    return
  }

  step()
  render()

  updateUI()
}

loadAssets().then(tick)

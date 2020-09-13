import { Puzzle } from './Puzzle'
import { BackgroundShader } from './Shaders/BackgroundShader'
import { TheRollercoasterShader } from './Shaders/RollercoasterShader'
import { TheRollercoasterGeometry } from './Geometries/RollercoasterGeometry'
import { TheCamera } from './Camera'
import { gl, TheCanvas } from './Graphics'
import { Input } from './Input'
import { BackgroundGeometry } from './Geometries/BackgroundGeometry'
import { warpRenderTarget } from './RenderTarget'
import { levels, tutorialCount, startScreen, isTutorialLevel } from './levelsEntry'
import { FSM } from './FSM'
import {
  delta, setDelta,
  time, setTime, updateTime,
  addToScore,
  levelIndex, setLevelIndex,
  lives, removeLife,
  showTutorial, casualMode, resetScoreAndLives
} from './globals'
import { updateUI, updateLevelDisplay, showStart, showFinalScore, bindUndo, toggleMovesLeft, updateMovesLeft, toggleUndoButton, showEndCard } from './UI'
import { loadAssets, MainSong, SuccessJingle, FailSound, WinJingle } from './Assets'
import { TheAudioContext } from './Audio/Context'
import { playSample } from './Audio'
import { clamp } from './utils'
import { loadProgress, saveProgress } from './Progress'

function resizeCanvas () {
  TheCanvas.width = window.innerWidth
  TheCanvas.height = window.innerHeight
  warpRenderTarget.resize(TheCanvas.width, TheCanvas.height)
}

resizeCanvas()
window.onresize = resizeCanvas

let currentPuzzle = new Puzzle(startScreen)
let nextPuzzle
let transitionTime = 0

const STATE_INIT = 7
const STATE_START_SCREEN = 1
const STATE_PLAYING = 2
const STATE_SOLVE_TRANSITION = 3
const STATE_FAIL_TRANSITION = 4
const STATE_FINISH = 5
const STATE_GAMEOVER = 6
const STATE_START_SCREEN_TRANSITION = 8

function onTransitionEnd () {
  currentPuzzle.trackPosition = 0
  currentPuzzle = nextPuzzle
  setLevelIndex(levelIndex + 1)
  if (levelIndex < levels.length - 1) {
    gameFSM.setState(STATE_PLAYING)
    nextPuzzle = new Puzzle(levels[levelIndex + 1])
  } else {
    gameFSM.setState(STATE_FINISH)
    nextPuzzle = null
  }
}

function onEnd () {
  if (Input.mousePress) {
    gameFSM.setState(STATE_START_SCREEN)
  }
}

bindUndo(() => {
  if (currentPuzzle.isActive) currentPuzzle.undo()
})

const gameFSM = new FSM({
  [STATE_INIT]: {
    execute () {
      currentPuzzle.trackPosition -= currentPuzzle.trackPosition * (1 - Math.exp(-10 * delta))
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
        if (!MainSong.playing) {
          MainSong.play()
        }
        let newLevelIndex
        if (casualMode) {
          newLevelIndex = loadProgress() || (showTutorial ? 0 : tutorialCount)
          if (newLevelIndex >= levels.length) newLevelIndex = 0
        } else {
          newLevelIndex = showTutorial ? 0 : tutorialCount
        }
        resetScoreAndLives()
        setLevelIndex(newLevelIndex - 1)
        nextPuzzle = new Puzzle(levels[newLevelIndex])
        gameFSM.setState(STATE_START_SCREEN_TRANSITION)
      })
    },

    execute () {
      currentPuzzle.trackPosition -= currentPuzzle.trackPosition * (1 - Math.exp(-10 * delta))
    }
  },

  [STATE_START_SCREEN_TRANSITION]: {
    enter () {
      currentPuzzle.setDone()
      currentPuzzle.isActive = false
      transitionTime = 0
    },

    execute () {
      transitionTime += delta * 0.75
      nextPuzzle.trackPosition -= nextPuzzle.trackPosition * (1 - Math.exp(-8 * delta))
      if (transitionTime > 1) {
        onTransitionEnd()
      }
    }
  },

  [STATE_PLAYING]: {
    enter () {
      if (casualMode) saveProgress(levelIndex)
      updateLevelDisplay(levelIndex)

      currentPuzzle.trackPosition = 0
      currentPuzzle.isActive = true
      setTime(currentPuzzle.timeLimit || 0)

      toggleMovesLeft(true)
    },

    execute () {
      if (currentPuzzle.isDone) {
        gameFSM.setState(STATE_SOLVE_TRANSITION)
      } else if (!casualMode && !isTutorialLevel(levelIndex)) {
        if (nextPuzzle) {
          nextPuzzle.trackPosition = Math.PI * (1 - Math.min(30, time) / 30) ** 0.25 - Math.PI
        }
        updateTime(delta)
        if (time <= 0) {
          setTime(0)
          return gameFSM.setState(STATE_FAIL_TRANSITION)
        }
      }
      updateMovesLeft(currentPuzzle.maxMoves - currentPuzzle.moves.length)
      toggleUndoButton(currentPuzzle.showUndo)
    },

    leave () {
      toggleMovesLeft(false)
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
      nextPuzzle.trackPosition -= nextPuzzle.trackPosition * (1 - Math.exp(-8 * delta))
      if (transitionTime > 1) {
        onTransitionEnd()
      }
    }
  },

  [STATE_FAIL_TRANSITION]: {
    enter () {
      playSample(FailSound, 0.1, true)
      currentPuzzle.setFailed()
      transitionTime = 0
      removeLife()
    },
    execute () {
      if (lives === 0) {
        gameFSM.setState(STATE_GAMEOVER)
        return
      }
      transitionTime += delta
      nextPuzzle.trackPosition -= nextPuzzle.trackPosition * (1 - Math.exp(-10 * delta))
      if (transitionTime > 1) {
        onTransitionEnd()
      }
    }
  },

  [STATE_FINISH]: {
    enter () {
      if (casualMode) {
        saveProgress(0)
        showEndCard()
      } else {
        showFinalScore(true)
      }
      playSample(WinJingle, 1, true)
    },

    execute: onEnd
  },

  [STATE_GAMEOVER]: {
    enter () {
      MainSong.tapeStop()
      showFinalScore()
      nextPuzzle.stop()
    },

    execute () {
      TheCamera.velocity += (200 - TheCamera.velocity) * (1 - Math.exp(-0.5 * delta))
      onEnd()
    }
  }
}, STATE_INIT)

function step () {
  TheCamera.step()

  gameFSM.step()

  document.body.style.cursor = ''
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

  if (nextPuzzle) nextPuzzle.render()
  currentPuzzle.render()
}

let lastTime = 0
function tick (time) {
  requestAnimationFrame(tick)

  setDelta(clamp((time - lastTime) / 1000, 0.001, 0.5))
  lastTime = time
  if (isNaN(delta)) {
    return
  }

  step()
  render()

  updateUI()
}

loadAssets().then(tick)

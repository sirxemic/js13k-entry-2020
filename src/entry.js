import { Puzzle } from './Puzzle'
import { BackgroundShader } from './Shaders/BackgroundShader'
import { TheRollercoasterShader } from './Shaders/RollercoasterShader'
import { TheRollercoasterGeometry } from './Geometries/RollercoasterGeometry'
import { TheCamera } from './Camera'
import { gl, TheCanvas } from './Graphics'
import { Input } from './Input'
import { BackgroundGeometry } from './Geometries/BackgroundGeometry'

const STATE_INTRO = 0
const STATE_PLAYING = 1
const STATE_SOLVE_TRANSITION = 2
const STATE_FAIL_TRANSITION = 3

let difficulty = 10
let currentPuzzle = new Puzzle(difficulty)
let nextPuzzle

let state = STATE_INTRO

let lastTime = 0
function tick (time) {
  requestAnimationFrame(tick)

  const delta = Math.min(1/60, Math.max(0.5, (time - lastTime) / 1000))
  lastTime = time
  if (isNaN(delta)) {
    return
  }

  TheCamera.step(delta)

  switch (state) {
    case STATE_INTRO:
      currentPuzzle.offset -= currentPuzzle.offset * (1 - Math.exp(-10 * delta))
  }

  currentPuzzle.step(delta)
  if (nextPuzzle) nextPuzzle.step(delta)

  Input.postUpdate()

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

tick()
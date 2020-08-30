import { Puzzle } from './Puzzle'
import { BackgroundShader } from './Shaders/BackgroundShader'
import { TheRollercoasterShader } from './Shaders/RollercoasterShader'
import { TheRollercoasterGeometry } from './Geometries/RollercoasterGeometry'
import { TheCamera } from './Camera'
import { gl, TheCanvas } from './Graphics'
import { Input } from './Input'
import { BackgroundGeometry } from './Geometries/BackgroundGeometry'

const puzzle = new Puzzle()

let lastTime = 0
function tick (time) {
  requestAnimationFrame(tick)

  const delta = Math.min(1/60, Math.max(0.5, (time - lastTime) / 1000))
  lastTime = time
  if (isNaN(delta)) {
    return
  }

  TheCamera.step(delta)
  puzzle.step(delta)

  Input.postUpdate()

  gl.viewport(0, 0, TheCanvas.width, TheCanvas.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  BackgroundShader.use()
  BackgroundGeometry.draw()

  gl.clear(gl.DEPTH_BUFFER_BIT)

  TheRollercoasterShader.use()
  TheRollercoasterGeometry.draw()

  puzzle.render()
}

tick()
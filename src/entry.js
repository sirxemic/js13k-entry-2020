import { Puzzle } from './Puzzle'
import { TheRollercoasterShader } from './Shaders/RollercoasterShader'
import { TheRollercoasterGeometry } from './Geometries/RollercoasterGeometry'
import { U_CAMERAPOSITION, U_PROJECTIONMATRIX, U_MODELVIEWMATRIX, U_NORMALMATRIX } from './sharedLiterals'
import { Matrix3 } from './Math/Matrix3'
import { TheCamera } from './Camera'
import { gl, TheCanvas } from './Graphics'
import { Input } from './Input'

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

  const normalMatrix = new Matrix3()
  normalMatrix.getNormalMatrix(TheCamera.viewMatrix)

  TheRollercoasterShader.use({
    [U_CAMERAPOSITION]: TheCamera.position,
    [U_PROJECTIONMATRIX]: TheCamera.projectionMatrix,
    [U_MODELVIEWMATRIX]: TheCamera.viewMatrix,
    [U_NORMALMATRIX]: normalMatrix
  })
  TheRollercoasterGeometry.draw()

  puzzle.render()
}

tick()
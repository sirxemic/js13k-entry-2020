import { TheRollercoaster } from './Rollercoaster'
import { TheShapeShader } from './Shaders/ShapeShader'
import { U_PROJECTIONMATRIX, U_VIEWMATRIX, U_MODELMATRIX, U_COLOR } from './sharedLiterals'
import { TheCamera } from './Camera'
import { Transform3D } from './Transform3D'
import { FourShape, CircleShape, TriangleShape } from './Geometries/Shapes'
import { TILE_SIZE } from './constants'
import { FlipVAction } from './Actions/FlipVAction'
import { SwapAction } from './Actions/SwapAction'
import { RotateAction } from './Actions/RotateAction'
import { ShiftAction } from './Actions/ShiftAction'
import { gl } from './Graphics'
import { Matrix4 } from './Math/Matrix4'
import { Input } from './Input'
import { FlipHAction } from './Actions/FlipHAction'

const scaleMatrix = new Matrix4([
  1.1, 0, 0, 0,
  0, 1.1, 0, 0,
  0, 0, 1.1, 0,
  0, 0, 0, 1
])

class Tile extends Transform3D {
  constructor (puzzle, shape, position) {
    super()
    this.position = position
    this.puzzle = puzzle
    this.shape = shape
    this.orientation = [1, 0, 0, 1]
    this.syncMatrixToOrientation()
  }

  syncMatrixToOrientation () {
    this.matrix.els.set([
      this.orientation[0], this.orientation[1], 0, 0,
      this.orientation[2], this.orientation[3], 0, 0,
      0, 0, 1, 0,
      this.position * TILE_SIZE * 2, 0, 0, 1
    ])
  }

  render () {
    gl.disable(gl.DEPTH_TEST)
    TheShapeShader.use({
      [U_PROJECTIONMATRIX]: TheCamera.projectionMatrix,
      [U_VIEWMATRIX]: TheCamera.viewMatrix,
      [U_MODELMATRIX]: (new Matrix4()).multiply(this.worldMatrix, scaleMatrix),
      [U_COLOR]: 0
    })
    this.shape.draw()
    TheShapeShader.use({
      [U_MODELMATRIX]: this.worldMatrix,
      [U_COLOR]: 1
    })
    this.shape.draw()
    gl.enable(gl.DEPTH_TEST)
  }
}

export class Puzzle extends Transform3D {
  constructor () {
    super()
    this.t = 0

    const root = new Transform3D()
    root.matrix.setTranslation(0, 0, -50)

    this.add(root)

    this.tiles = [
      root.add(new Tile(this, FourShape, -3)),
      root.add(new Tile(this, FourShape, -2)),
      root.add(new Tile(this, FourShape, -1)),
      root.add(new Tile(this, CircleShape, 0)),
      root.add(new Tile(this, FourShape, 1)),
      root.add(new Tile(this, TriangleShape, 2)),
      root.add(new Tile(this, FourShape, 3))
    ]

    this.actions = [
      root.add(new ShiftAction(this, -4)),
      root.add(new SwapAction(this, 0, 2)),
      root.add(new SwapAction(this, 2, 3, true)),
      root.add(new FlipVAction(this, -2)),
      root.add(new RotateAction(this, 0, 1)),
      root.add(new RotateAction(this, 1, -1)),
      root.add(new FlipHAction(this, 2, 1)),
      root.add(new RotateAction(this, 3, -1)),
      root.add(new ShiftAction(this, 4))
    ]

    this.executionCoroutine = null
  }

  getTile (index) {
    return this.tiles[index + (this.tiles.length - 1) / 2]
  }

  step (delta) {
    this.matrix = TheRollercoaster.getTransformAt(TheCamera.t + this.t)

    document.body.style.cursor = ''
    if (!this.executionCoroutine) {
      this.checkInput()
    } else if (this.executionCoroutine.next(delta).done) {
      this.executionCoroutine = null
    }

    this.updateMatrices()
  }

  checkInput () {
    let hoverAction = null
    for (let action of this.actions) {
      if (!hoverAction && action.checkHover()) {
        hoverAction = action
      }
      action.step()
      action.hover = false
    }

    if (hoverAction) {
      hoverAction.hover = true
      document.body.style.cursor = 'pointer'

      if (Input.mousePress) {
        this.executionCoroutine = hoverAction.execute()
      }
    }
  }

  render () {
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    for (let action of this.actions) {
      action.render()
    }
    gl.disable(gl.BLEND)
    for (let tile of this.tiles) {
      tile.render()
    }
  }
}

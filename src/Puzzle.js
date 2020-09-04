import { TheRollercoaster } from './Rollercoaster'
import { TheCamera } from './Camera'
import { Transform3D } from './Transform3D'
import { FlipHAction } from './Actions/FlipHAction'
import { FlipVAction } from './Actions/FlipVAction'
import { SwapAction } from './Actions/SwapAction'
import { RotateCWAction, RotateCCWAction } from './Actions/RotateAction'
import { ShiftAction } from './Actions/ShiftAction'
import { gl } from './Graphics'
import { Input } from './Input'
import { Tile } from './Tile'
import { warpRenderTarget } from './RenderTarget'
import { PuzzleShader } from './Shaders/PuzzleShader'
import { Quad } from './Geometries/Quad'
import { U_TEXTURE, U_WRAP_START, U_WRAP_LENGTH } from './sharedLiterals'
import { SHAPE_SIZE, DISTANCE_FROM_CAMERA, FOVX } from './constants'
import { delta } from './globals'

const simpleActions = [FlipHAction, FlipVAction, RotateCWAction, RotateCCWAction]

export class Puzzle extends Transform3D {
  constructor (level) {
    super()

    this.offset = -Math.PI

    // Falsy initializations can be removed to save space
    // this.isActive = false
    // this.failed = false
    // this.done = false
    // this.bufferedClick = false
    // this.active = false
    // this.executionCoroutine = null

    this.root = new Transform3D()
    this.root.matrix.setTranslation(0, 0, -DISTANCE_FROM_CAMERA)

    this.add(this.root)

    this.parse(level)
  }

  parse (level) {
    this.size = (level.shapes.length - 1) / 2
    this.tiles = []
    for (let i = 0; i < level.shapes.length; i++) {
      this.tiles.push(new Tile(this, level.shapes[i], -this.size + i, [...level.orientations[i]]))
    }

    this.actions = []
    for (let action of level.actions) {
      const Action = action[0]
      switch (Action) {
        case ShiftAction:
          this.actions.push(new Action(this, action[1]))
          break
        case FlipVAction:
        case FlipHAction:
        case RotateCCWAction:
        case RotateCWAction:
          this.actions.push(new Action(this, action[1]))
          break
        case SwapAction:
          this.actions.push(new Action(this, action[1], action[2], action[3]))
          break
      }
    }

    this.tiles.forEach(tile => {
      this.root.add(tile)
      tile.updateState()
    })
    this.actions.forEach(action => this.root.add(action))
  }

  getTile (index) {
    return this.tiles[index + (this.tiles.length - 1) / 2]
  }

  step () {
    if (this.failed) {
      this.failStep += delta
      this.root.matrix.rotateZ(this.failStep * 5 * Math.PI)
      const x = SHAPE_SIZE * 2 * this.failStep
      this.root.matrix.setTranslation(-x, x, -DISTANCE_FROM_CAMERA + 30 * SHAPE_SIZE * this.failStep)
    }
    this.matrix = TheRollercoaster.getTransformAt(TheCamera.trackPosition + this.offset)

    if (this.executionCoroutine && this.executionCoroutine.next(delta).done) {
      this.checkState()
      this.executionCoroutine = null
    }

    if (this.isActive && !this.done) {
      this.checkInput()
    }

    this.updateMatrices()
  }

  checkState () {
    for (let tile of this.tiles) {
      if (!tile.hasMirroredTile()) return
    }
    this.done = true
    this.tiles.forEach(tile => tile.active = true)
  }

  checkInput () {
    let hoverAction
    for (let action of this.actions) {
      if (!hoverAction && action.checkHover()) {
        hoverAction = action
      }
      action.step()
      action.hover = false
    }

    document.body.style.cursor = hoverAction ? 'pointer' : ''

    if (hoverAction) {
      hoverAction.hover = true

      if (Input.mousePress || this.bufferedClick) {
        if (this.executionCoroutine) {
          this.bufferedClick = true
        } else {
          this.bufferedClick = false
          this.executionCoroutine = hoverAction.execute()
        }
      }
    }
  }

  setFailed () {
    this.failed = true
    this.failStep = 0
  }

  render () {
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    for (let action of this.actions) {
      action.render()
    }
    gl.disable(gl.BLEND)

    if (this.isActive && !this.failed) {
      warpRenderTarget.bind()
      gl.clear(gl.COLOR_BUFFER_BIT)
      this.renderTiles()
      warpRenderTarget.unbind()

      const visiblePuzzleWidth = 2 * Math.tan(FOVX / 2) * DISTANCE_FROM_CAMERA
      const normalizedTileWidth = 2 * SHAPE_SIZE / visiblePuzzleWidth

      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      PuzzleShader.use({
        [U_TEXTURE]: 0,
        [U_WRAP_START]: 0.5 + (this.size + 0.5) * normalizedTileWidth,
        [U_WRAP_LENGTH]: normalizedTileWidth
      })
      Quad.draw()
      gl.disable(gl.BLEND)
    } else {
      this.renderTiles()
    }
  }

  renderTiles () {
    gl.disable(gl.DEPTH_TEST)
    for (let tile of this.tiles) {
      tile.render()
    }
    gl.enable(gl.DEPTH_TEST)
  }
}

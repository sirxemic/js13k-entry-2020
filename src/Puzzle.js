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
import { smoothstep } from './utils'
import { playSample } from './Audio'
import { ReverseRotateSound, RotateSound } from './Assets'

const UNDO = 1

export class Puzzle extends Transform3D {
  constructor (level) {
    super()

    this.trackPosition = -Math.PI

    this.moves = []
    this.bufferedMoves = []

    this.showUndo = false

    // Falsy initializations can be removed to save space
    // this.isActive = false
    // this.failed = false
    // this.isDone = false
    // this.bufferedClick = false
    // this.active = false
    // this.executionCoroutine = null

    this.root = new Transform3D()
    this.root.matrix.setTranslation(0, 0, -DISTANCE_FROM_CAMERA)

    this.add(this.root)

    this.parse(level)
  }

  parse (level) {
    this.maxMoves = level.maxMoves
    this.timeLimit = level.timeLimit

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
      this.endStep += delta
      this.root.matrix.rotateZ(this.endStep * 5 * Math.PI)
      const x = SHAPE_SIZE * 2 * this.endStep
      this.root.matrix.setTranslation(-x, x, -DISTANCE_FROM_CAMERA + 40 * SHAPE_SIZE * this.endStep)
    } else if (this.isDone) {
      this.endStep += delta
      const x = smoothstep(0, 0.5, this.endStep)
      this.root.matrix.rotateY(x * Math.PI)
      this.root.matrix.setTranslation(0, 0, -DISTANCE_FROM_CAMERA + 16 * SHAPE_SIZE * this.endStep * this.endStep)
    } else if (this.executionCoroutine && this.executionCoroutine.next(delta).done) {
      this.checkState()
      this.executionCoroutine = null
    }
    this.matrix = TheRollercoaster.getTransformAt(this.absolutePosition || (TheCamera.trackPosition + this.trackPosition))

    if (this.isActive && !this.isDone) {
      this.checkInput()
    }

    this.updateMatrices()
  }

  checkState () {
    this.showUndo = this.moves.length > 0
    for (let tile of this.tiles) {
      if (!tile.hasMirroredTile()) return
    }
    this.setDone()
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

    if (this.moves.length < this.maxMoves && hoverAction) {
      document.body.style.cursor = 'pointer'
      hoverAction.hover = true

      if (Input.mousePress) {
        this.bufferedMoves.push(hoverAction)
      }
    }

    if (!this.executionCoroutine ) {
      let action = this.bufferedMoves.shift()
      if (!action) return

      let isUndo = action === UNDO
      if (isUndo) {
        action = this.moves.pop()
        if (!action) {
          return
        }
      } else {
        this.moves.push(action)
      }
      this.executionCoroutine = action.execute(true, isUndo)
      playSample(isUndo ? ReverseRotateSound : RotateSound, 1, true)
    }
  }

  undo () {
    this.bufferedMoves.push(UNDO)
  }

  setDone () {
    this.isDone = true
    this.endStep = 0
    this.showUndo = false
  }

  setFailed () {
    TheCamera.shake()
    this.failed = true
    this.endStep = 0
    this.showUndo = false
  }

  stop () {
    this.absolutePosition = TheCamera.trackPosition + this.trackPosition
  }

  render () {
    if (!this.isDone) {
      gl.depthMask(false)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
      for (let action of this.actions) {
        action.render()
      }
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.depthMask(true)
    }

    if (this.isActive && !this.failed) {
      warpRenderTarget.bind()
      gl.clear(gl.COLOR_BUFFER_BIT)
      this.renderTiles()
      warpRenderTarget.unbind()

      const visiblePuzzleWidth = 2 * Math.tan(FOVX / 2) * DISTANCE_FROM_CAMERA
      const normalizedTileWidth = 2 * SHAPE_SIZE / visiblePuzzleWidth

      PuzzleShader.use({
        [U_TEXTURE]: 0,
        [U_WRAP_START]: 0.5 + (this.size + 0.5) * normalizedTileWidth,
        [U_WRAP_LENGTH]: normalizedTileWidth
      })
      Quad.draw()
    } else {
      this.renderTiles()
    }
  }

  renderTiles () {
    for (let tile of this.tiles) {
      tile.render()
    }
  }
}

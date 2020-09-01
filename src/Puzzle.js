import { TheRollercoaster } from './Rollercoaster'
import { TheCamera } from './Camera'
import { Transform3D } from './Transform3D'
import { FourShape, CircleShape, TriangleShape } from './Geometries/Shapes'
import { FlipHAction } from './Actions/FlipHAction'
import { FlipVAction } from './Actions/FlipVAction'
import { SwapAction } from './Actions/SwapAction'
import { RotateCWAction, RotateCCWAction } from './Actions/RotateAction'
import { ShiftAction } from './Actions/ShiftAction'
import { gl } from './Graphics'
import { Input } from './Input'
import { Tile } from './Tile'

const simpleActions = [FlipHAction, FlipVAction, RotateCWAction, RotateCCWAction]

export class Puzzle extends Transform3D {
  constructor (difficulty) {
    super()

    this.offset = -Math.PI

    this.bufferedClick = false

    this.root = new Transform3D()
    this.root.matrix.setTranslation(0, 0, -50)

    this.add(this.root)

    this.create(difficulty)

    this.executionCoroutine = null
  }

  create (difficulty) {
    if (difficulty > 7) {
      this.createTiles(3)
    }
    else if (difficulty > 4) {
      this.createTiles(2)
    }
    else {
      this.createTiles(1)
    }

    this.createActions(difficulty)
  }

  createTiles (amount) {
    function chooseShape () {
      const r = Math.random()
      if (r < 0.5) return FourShape
      return TriangleShape
    }
    function chooseSign () {
      return Math.random() < 0.5 ? 1 : -1
    }
    function chooseOrientation () {
      if (Math.random() < 0.5) {
        return [chooseSign(), 0, 0, chooseSign()]
      } else {
        return [0, chooseSign(), chooseSign(), 0]
      }
    }
    function getMirroredOrientation (orientation) {
      return [-orientation[0], orientation[1], -orientation[2], orientation[3]]
    }

    this.tiles = []
    for (let i = amount; i >= 1; i--) {
      this.tiles.push(new Tile(this, chooseShape(), -i, chooseOrientation()))
    }

    this.tiles.push(new Tile(this, CircleShape, 0, [1, 0, 0, 1]))
    for (let i = amount - 1; i >= 0; i--) {
      const tile = this.tiles[i]
      this.tiles.push(new Tile(this, tile.shape, -tile.position, getMirroredOrientation(tile.orientation)))
    }

    this.tiles.forEach(tile => {
      this.root.add(tile)
      tile.updateState()
    })
  }

  createActions (difficulty) {
    this.actions = []

    const validPositions = this.tiles.map(tile => tile.position).filter(x => x)

    const maxSimpleActionCount = validPositions.length
    const simpleActionCount = Math.min(maxSimpleActionCount, Math.max(1, Math.ceil(difficulty / 2)))

    for (let i = 0; i < simpleActionCount; i++) {
      const Action = simpleActions[Math.floor(Math.random() * simpleActions.length)]
      const index = Math.floor(Math.random() * validPositions.length)
      let position = validPositions[index]
      this.actions.push(new Action(this, position))
      validPositions.splice(index, 1)
    }

    this.actions.forEach(action => {
      this.root.add(action)
      action.execute(false, true).next()
    })
  }

  getTile (index) {
    return this.tiles[index + (this.tiles.length - 1) / 2]
  }

  step (delta) {
    this.matrix = TheRollercoaster.getTransformAt(TheCamera.trackPosition + this.offset)

    document.body.style.cursor = ''

    if (this.executionCoroutine && this.executionCoroutine.next(delta).done) {
      this.checkState()
      this.executionCoroutine = null
    }

    if (Math.abs(this.offset) < 0.001 && !this.done) {
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

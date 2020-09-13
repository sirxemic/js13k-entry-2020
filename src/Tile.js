import { Transform3D } from './Transform3D'
import { TILE_SIZE } from './constants'
import { TheShapeShader } from './Shaders/ShapeShader'
import { U_MODELMATRIX, U_COLOR, U_ACTIVE, U_TIME } from './sharedLiterals'
import { FourShape, TriangleShape, UShape } from './Geometries/Shapes'

export class Tile extends Transform3D {
  constructor (puzzle, shape, position, orientation) {
    super()
    this.puzzle = puzzle
    this.shape = shape
    this.position = position
    this.orientation = orientation
    this.active = false
    this.effectMix = 0
  }

  hasMirroredTile () {
    const otherTile = this.puzzle.getTile(-this.position)
    if (this.shape !== otherTile.shape) {
      return false
    }
    const [a1, b1, c1, d1] = this.orientation
    const [a2, b2, c2, d2] = otherTile.orientation

    switch (this.shape) {
      case FourShape:
        return a1 === -a2 && c1 === -c2 && b1 === b2 && d1 === d2
      case TriangleShape:
        return b1 - d1 === b2 - d2 && a1 - c1 === c2 - a2
      case UShape:
        return c1 === -c2 && d1 === d2
      default:
        return true
    }
  }

  updateState () {
    this.matrix.els.set([
      this.orientation[0], this.orientation[1], 0, 0,
      this.orientation[2], this.orientation[3], 0, 0,
      0, 0, 1, 0,
      this.position * TILE_SIZE, 0, 0, 1
    ])
  }

  render () {
    this.effectMix += (this.active - this.effectMix) * 0.2
    TheShapeShader.use({
      [U_MODELMATRIX]: this.worldMatrix,
      [U_COLOR]: 1,
      [U_ACTIVE]: this.effectMix,
      [U_TIME]: performance.now() / 1000
    })
    this.shape.draw()
  }
}

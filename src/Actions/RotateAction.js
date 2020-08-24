import { SimpleAction } from './SimpleAction'
import { Matrix4 } from '../Math/Matrix4'
import { RotateGeometry } from '../Geometries/RotateGeometry'
import { ACTION_DURATION, TILE_SIZE } from '../constants'
import { elastic } from '../utils'

const rotationMatrix = new Matrix4()

export class RotateAction extends SimpleAction {
  constructor (puzzle, position, direction = 1) {
    super(puzzle, position, RotateGeometry)
    this.direction = direction
    this.matrix.els[0] = direction
  }

  *execute () {
    const tile = this.puzzle.getTile(this.position)
    const rotationMatrixFrom = tile.matrix.clone()
    rotationMatrixFrom.setTranslation(0, 0, 0)
    let t = 0
    while (t < ACTION_DURATION) {
      rotationMatrix.rotateZ(this.direction * elastic(t / ACTION_DURATION) * Math.PI / 2)
      tile.matrix.multiply(rotationMatrix, rotationMatrixFrom)
      tile.matrix.setTranslation(tile.position * TILE_SIZE * 2, 0, 0)
      t += yield
    }
    tile.orientation = [
      this.direction * -tile.orientation[1],
      this.direction * tile.orientation[0],

      this.direction * -tile.orientation[3],
      this.direction * tile.orientation[2],
    ]
    tile.syncMatrixToOrientation()
  }
}

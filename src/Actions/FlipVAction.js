import { SimpleAction } from './SimpleAction'
import { TILE_SIZE, ACTION_DURATION } from '../constants'
import { TheFlipVGeometry } from '../Geometries/FlipVGeometry'
import { Matrix4 } from '../Math/Matrix4'
import { elastic } from '../utils'

const rotationMatrix = new Matrix4()

export class FlipVAction extends SimpleAction {
  constructor (puzzle, position) {
    super(puzzle, position, TheFlipVGeometry)
  }

  *execute () {
    const tile = this.puzzle.getTile(this.position)
    const rotationMatrixFrom = tile.matrix.clone()
    rotationMatrixFrom.setTranslation(0, 0, 0)
    let t = 0
    while (t < ACTION_DURATION) {
      rotationMatrix.rotateX(elastic(t / ACTION_DURATION) * Math.PI)
      tile.matrix.multiply(rotationMatrix, rotationMatrixFrom)
      tile.matrix.setTranslation(tile.position * TILE_SIZE * 2, 0, 0)
      t += yield
    }
    tile.orientation[1] = -tile.orientation[1]
    tile.orientation[3] = -tile.orientation[3]
    tile.syncMatrixToOrientation()
  }
}

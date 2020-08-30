import { SimpleAction } from './SimpleAction'
import { TILE_SIZE, ACTION_DURATION } from '../constants'
import { TheFlipHGeometry } from '../Geometries/FlipHGeometry'
import { elastic } from '../utils'
import { tempMatrix4 } from '../temps'

const rotationMatrix = tempMatrix4

export class FlipHAction extends SimpleAction {
  constructor (puzzle, position) {
    super(puzzle, position, TheFlipHGeometry)
    this.matrix.els[0] = -Math.sign(position)
  }

  *execute () {
    const tile = this.puzzle.getTile(this.position)
    const rotationMatrixFrom = tile.matrix.clone()
    rotationMatrixFrom.setTranslation(0, 0, 0)
    let t = 0
    while (t < ACTION_DURATION) {
      rotationMatrix.rotateY(elastic(t / ACTION_DURATION) * Math.PI)
      tile.matrix.multiply(rotationMatrix, rotationMatrixFrom)
      tile.matrix.setTranslation(tile.position * TILE_SIZE * 2, 0, 0)
      t += yield
    }
    tile.orientation[0] = -tile.orientation[0]
    tile.orientation[2] = -tile.orientation[2]
    tile.syncMatrixToOrientation()
  }
}
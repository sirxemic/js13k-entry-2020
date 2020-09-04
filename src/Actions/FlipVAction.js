import { SimpleAction } from './SimpleAction'
import { TILE_SIZE, ACTION_DURATION } from '../constants'
import { TheFlipVGeometry } from '../Geometries/FlipVGeometry'
import { elastic } from '../utils'
import { tempMatrix4 } from '../temps'

const rotationMatrix = tempMatrix4

export class FlipVAction extends SimpleAction {
  constructor (puzzle, position) {
    super(puzzle, position, TheFlipVGeometry)
  }

  *execute (animate = true) {
    const tile = this.puzzle.getTile(this.position)
    if (animate) {
      const rotationMatrixFrom = tile.matrix.clone()
      rotationMatrixFrom.setTranslation(0, 0, 0)
      let t = 0
      while (t < ACTION_DURATION) {
        rotationMatrix.rotateX(elastic(t / ACTION_DURATION) * Math.PI)
        tile.matrix.multiplyMatrices(rotationMatrix, rotationMatrixFrom)
        tile.matrix.setTranslation(tile.position * TILE_SIZE, 0, 0)
        t += yield
      }
    }
    tile.orientation[1] = -tile.orientation[1]
    tile.orientation[3] = -tile.orientation[3]
    tile.updateState()
  }
}

import { SimpleAction } from './SimpleAction'
import { RotateGeometry } from '../Geometries/RotateGeometry'
import { ACTION_DURATION, TILE_SIZE } from '../constants'
import { elastic } from '../utils'
import { tempMatrix4 } from '../temps'

const rotationMatrix = tempMatrix4

class RotateAction extends SimpleAction {
  constructor (puzzle, position, direction) {
    super(puzzle, position, RotateGeometry)
    this.rotateDirection = direction
    this.matrix.els[0] = direction
  }

  *execute (animate = true, reverse = false) {
    const direction = reverse ? -this.rotateDirection : this.rotateDirection
    const tile = this.puzzle.getTile(this.position)
    if (animate) {
      const rotationMatrixFrom = tile.matrix.clone()
      rotationMatrixFrom.setTranslation(0, 0, 0)
      let t = 0
      while (t < ACTION_DURATION) {
        rotationMatrix.rotateZ(direction * elastic(t / ACTION_DURATION) * Math.PI / 2)
        tile.matrix.multiplyMatrices(rotationMatrix, rotationMatrixFrom)
        tile.matrix.setTranslation(tile.position * TILE_SIZE, 0, 0)
        t += yield
      }
    }
    tile.orientation = [
      direction * -tile.orientation[1],
      direction * tile.orientation[0],

      direction * -tile.orientation[3],
      direction * tile.orientation[2],
    ]
    tile.updateState()
  }
}

export class RotateCWAction extends RotateAction {
  constructor (puzzle, position) {
    super(puzzle, position, -1)
  }
}

export class RotateCCWAction extends RotateAction {
  constructor (puzzle, position) {
    super(puzzle, position, 1)
  }
}
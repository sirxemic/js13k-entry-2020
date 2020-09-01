import { Action } from '../Action'
import { TILE_SIZE, ACTION_DURATION } from '../constants'
import { TheActionShader } from '../Shaders/ActionShader'
import { elastic } from '../utils'
import { ShiftGeometry } from '../Geometries/ShiftGeometry'

export class ShiftAction extends Action {
  constructor (puzzle, position) {
    super(puzzle)
    this.position = position
    this.direction = Math.sign(position)
    this.matrix.els[0] = this.direction
    this.matrix.setTranslation(position * TILE_SIZE * 2, 0, 0)

    this.minX = (position - 0.5) * TILE_SIZE * 2
    this.maxX = (position + 0.5) * TILE_SIZE * 2
    this.minY = -0.75 * TILE_SIZE
    this.maxY = 0.75 * TILE_SIZE
  }

  *execute (animate = true) {
    if (animate) {
      let t = 0
      while (t < ACTION_DURATION) {
        const offset = elastic(t / ACTION_DURATION) * 2 * TILE_SIZE * this.direction
        for (let tile of this.puzzle.tiles) {
          tile.matrix.els[12] = tile.position * TILE_SIZE * 2 + offset
          if (tile.position === this.position - this.direction && t > ACTION_DURATION / 2) {
            tile.matrix.els[12] = -this.position * TILE_SIZE * 2 + offset
          }
        }
        t += yield
      }
    }

    for (let tile of this.puzzle.tiles) {
      tile.position += this.direction
      if (tile.position === this.position) {
        tile.position = -this.position + this.direction
      }
      tile.updateState()
    }
    if (this.direction === 1) {
      this.puzzle.tiles.unshift(this.puzzle.tiles.pop())
    } else {
      this.puzzle.tiles.push(this.puzzle.tiles.shift())
    }
  }

  render () {
    TheActionShader.use(this.getCommonUniforms())
    ShiftGeometry.draw()
  }
}

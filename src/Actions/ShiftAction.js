import { Action } from '../Action'
import { TILE_SIZE, ACTION_DURATION } from '../constants'
import { TheActionShader } from '../Shaders/ActionShader'
import { elastic } from '../utils'
import { ShiftGeometry } from '../Geometries/ShiftGeometry'

export class ShiftAction extends Action {
  constructor (puzzle, position) {
    super(puzzle)
    this.position = position
    this.shiftDirection = Math.sign(position)
    this.matrix.els[0] = this.shiftDirection
    this.matrix.setTranslation(position * TILE_SIZE, 0, 0)

    this.minX = (position - 0.5) * TILE_SIZE
    this.maxX = (position + 0.5) * TILE_SIZE
    this.minY = -0.4 * TILE_SIZE
    this.maxY = 0.4 * TILE_SIZE
  }

  *execute (animate = true, reverse = false) {
    const direction = reverse ? -this.shiftDirection : this.shiftDirection
    const position = reverse ? -this.position : this.position
    if (animate) {
      let t = 0
      while (t < ACTION_DURATION) {
        const x = t / ACTION_DURATION
        const offset = elastic(x) * TILE_SIZE * direction
        for (let tile of this.puzzle.tiles) {
          tile.matrix.els[12] = tile.position * TILE_SIZE + offset
          if (tile.position === position - direction) {
            tile.matrix.els[12] += TILE_SIZE * direction * Math.min(1, 2 * x)
          }
        }
        t += yield
      }
    }

    for (let tile of this.puzzle.tiles) {
      tile.position += direction
      if (tile.position === position) {
        tile.position = -position + direction
      }
      tile.updateState()
    }
    if (direction === 1) {
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

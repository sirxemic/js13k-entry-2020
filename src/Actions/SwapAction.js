import { Action } from '../Action'
import { TILE_SIZE, ACTION_DURATION } from '../constants'
import { TheActionShader } from '../Shaders/ActionShader'
import { SwapGeometries } from '../Geometries/SwapGeometry'
import { elastic } from '../utils'

export class SwapAction extends Action {
  constructor (puzzle, position1, position2, rotate180) {
    super(puzzle)
    this.position1 = position1
    this.position2 = position2
    const span = position2 - position1 + 1
    this.shape = SwapGeometries[span]
    if (rotate180) {
      this.matrix.rotateZ(Math.PI)
    }

    this.minX = (this.position1 - 0.25) * TILE_SIZE * 2
    this.maxX = (this.position2 + 0.25) * TILE_SIZE * 2
    if (rotate180) {
      this.maxY = -TILE_SIZE
      this.minY = -TILE_SIZE - (span - 1) * TILE_SIZE
    } else {
      this.minY = TILE_SIZE
      this.maxY = TILE_SIZE + (span - 1) * TILE_SIZE
    }

    this.mid = (position1 + position2) * TILE_SIZE
    this.span = (position2 - position1) * TILE_SIZE
    this.matrix.setTranslation(this.mid, 0, 0)
  }

  *execute () {
    const tile1 = this.puzzle.getTile(this.position1)
    const tile2 = this.puzzle.getTile(this.position2)

    const tile1Index = this.puzzle.tiles.indexOf(tile1)
    const tile2Index = this.puzzle.tiles.indexOf(tile2)

    let t = 0
    while (t < ACTION_DURATION) {
      const a = elastic(t / ACTION_DURATION) * Math.PI
      const t1X = this.mid - this.span * Math.cos(a)
      const t1Y = -this.span * Math.sin(a)
      const t2X = this.mid + this.span * Math.cos(a)
      const t2Y = this.span * Math.sin(a)
      tile1.matrix.setTranslation(t1X, t1Y, 0)
      tile2.matrix.setTranslation(t2X, t2Y, 0)
      t += yield
    }

    this.puzzle.tiles[tile1Index] = tile2
    this.puzzle.tiles[tile2Index] = tile1
    tile1.position = this.position2
    tile2.position = this.position1

    tile1.syncMatrixToOrientation()
    tile2.syncMatrixToOrientation()
  }

  render () {
    TheActionShader.use(this.getCommonUniforms())
    this.shape.draw()
  }
}

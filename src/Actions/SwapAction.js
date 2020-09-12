import { Action } from '../Action'
import { TILE_SIZE, SHAPE_SIZE, ACTION_DURATION } from '../constants'
import { TheActionShader } from '../Shaders/ActionShader'
import { SwapGeometries } from '../Geometries/SwapGeometry'
import { elastic } from '../utils'

export class SwapAction extends Action {
  constructor (puzzle, position1, position2, rotate180) {
    super(puzzle)
    const minPos = this.position1 = Math.min(position1, position2)
    const maxPos = this.position2 = Math.max(position1, position2)
    const span = maxPos - minPos + 1
    this.shape = SwapGeometries[span]
    if (rotate180) {
      this.matrix.rotateZ(Math.PI)
    }

    this.mid = (minPos + maxPos) * TILE_SIZE / 2
    this.span = (maxPos - minPos) * TILE_SIZE / 2

    this.minX = (minPos - 0.25) * TILE_SIZE
    this.maxX = (maxPos + 0.25) * TILE_SIZE
    if (rotate180) {
      this.maxY = -this.shape.boundingBox[1]
      this.minY = -this.shape.boundingBox[3]
    } else {
      this.maxY = this.shape.boundingBox[3]
      this.minY = this.shape.boundingBox[1]
    }

    this.matrix.setTranslation(this.mid, 0, -0.25)
  }

  *execute (animate = true, reverse = false) {
    const tile1 = this.puzzle.getTile(this.position1)
    const tile2 = this.puzzle.getTile(this.position2)

    const tile1Index = this.puzzle.tiles.indexOf(tile1)
    const tile2Index = this.puzzle.tiles.indexOf(tile2)

    if (animate) {
      let t = 0
      while (t < ACTION_DURATION) {
        const a = elastic(t / ACTION_DURATION) * Math.PI * (reverse ? -1 : 1)
        const t1X = this.mid - this.span * Math.cos(a)
        const t1Y = -this.span * Math.sin(a)
        const t2X = this.mid + this.span * Math.cos(a)
        const t2Y = this.span * Math.sin(a)
        tile1.matrix.setTranslation(t1X, t1Y, 0)
        tile2.matrix.setTranslation(t2X, t2Y, 0)
        t += yield
      }
    }

    this.puzzle.tiles[tile1Index] = tile2
    this.puzzle.tiles[tile2Index] = tile1
    tile1.position = this.position2
    tile2.position = this.position1

    tile1.updateState()
    tile2.updateState()
  }

  render () {
    TheActionShader.use(this.getCommonUniforms())
    this.shape.draw()
  }
}

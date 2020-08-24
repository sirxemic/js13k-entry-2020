import { Action } from '../Action'
import { TILE_SIZE } from '../constants'
import { TheActionShader } from '../Shaders/ActionShader'

export class SimpleAction extends Action {
  constructor (puzzle, position, geometry) {
    super(puzzle)
    this.geometry = geometry
    this.position = position
    this.matrix.setTranslation(position * TILE_SIZE * 2, 0, 0)

    this.minX = (position - 0.5) * TILE_SIZE * 2
    this.maxX = (position + 0.5) * TILE_SIZE * 2
    this.minY = -0.75 * TILE_SIZE
    this.maxY = 0.75 * TILE_SIZE
  }

  render () {
    TheActionShader.use(this.getCommonUniforms())
    this.geometry.draw()
  }
}

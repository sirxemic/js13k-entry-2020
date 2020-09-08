import { Action } from '../Action'
import { TILE_SIZE } from '../constants'
import { TheActionShader } from '../Shaders/ActionShader'

export class SimpleAction extends Action {
  constructor (puzzle, position, geometry) {
    super(puzzle)
    this.geometry = geometry
    this.position = position
    this.matrix.setTranslation(position * TILE_SIZE, 0, -0.25)

    this.minX = (position - 0.5) * TILE_SIZE
    this.maxX = (position + 0.5) * TILE_SIZE
    this.minY = -0.4 * TILE_SIZE
    this.maxY = 0.4 * TILE_SIZE
  }

  render () {
    TheActionShader.use(this.getCommonUniforms())
    this.geometry.draw()
  }
}

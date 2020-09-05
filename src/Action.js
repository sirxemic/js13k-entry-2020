import { Transform3D } from './Transform3D'
import { U_COLOR } from './sharedLiterals'
import { Input } from './Input'

export class Action extends Transform3D {
  constructor (puzzle) {
    super()
    this.puzzle = puzzle
    this.hover = false
    this.hoverAmount = 0
  }

  step () {
    this.hoverAmount += (this.hover - this.hoverAmount) * 0.25
  }

  checkHover () {
    return Input.x > this.minX && Input.x < this.maxX && Input.y > this.minY && Input.y < this.maxY
  }

  getCommonUniforms () {
    return {
      ...super.getCommonUniforms(),
      [U_COLOR]: this.hoverAmount
    }
  }
}

import { gl } from './Graphics'

export class RenderTarget {
  constructor () {
    this.framebuffer = gl.createFramebuffer()
    this.texture = gl.createTexture()

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
    if (process.env.NODE_ENV === 'development' && gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('incomplete framebuffer')
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  resize (width, height) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  }

  bind() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
  }

  unbind() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
}

export const warpRenderTarget = new RenderTarget()
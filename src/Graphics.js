export const TheCanvas = document.querySelector('canvas')
export const gl = TheCanvas.getContext('webgl')
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
gl.enableVertexAttribArray(0)

function resizeCanvas () {
  TheCanvas.width = window.innerWidth
  TheCanvas.height = window.innerHeight
}

resizeCanvas()
window.onresize = resizeCanvas
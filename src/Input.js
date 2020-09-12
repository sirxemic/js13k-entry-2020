import { TheCanvas } from './Graphics'

export let Input = {
  x: -1000,
  y: -1000,
  scale: 1,
  mousePress: 0,
  mouseRelease: 0,
  mouseDown: 0,

  postUpdate () {
    Input.mousePress = 0
    Input.mouseRelease = 0
  }
}

function updateMousePos (e) {
  Input.x = (e.x - TheCanvas.width / 2) * Input.scale
  Input.y = (TheCanvas.height / 2 - e.y) * Input.scale
}

window.addEventListener('mousedown', e => {
  updateMousePos(e)
  if (e.button === 0) {
    Input.mousePress = 1
    Input.mouseDown = 1
  }
})

window.addEventListener('mousemove', updateMousePos)

window.addEventListener('mouseup', e => {
  updateMousePos(e)
  if (e.button === 0) {
    Input.mouseRelease = 1
    Input.mouseDown = 0
  }
})
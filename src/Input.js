import { TheCanvas } from './Graphics'

export let Input = {
  x: -1000,
  y: -1000,
  scale: 1,
  mousePress: 0,

  postUpdate () {
    Input.mousePress = 0
  }
}

function updateMousePos (e) {
  Input.x = (e.pageX - TheCanvas.width / 2) * Input.scale
  Input.y = (TheCanvas.height / 2 - e.pageY) * Input.scale
}

let touched = false
let usingMouse = false

function onMouseMove (e) {
  usingMouse = true
  updateMousePos(e)
}

document.body.addEventListener('mousedown', e => {
  if (!usingMouse) {
    return
  }

  if (e.button === 0) {
    updateMousePos(e)
    Input.mousePress = 1
  }
})

document.addEventListener('touchstart', e => {
  if (usingMouse) {
    return
  }

  if (!touched) {
    document.body.removeEventListener('mousemove', onMouseMove)
  }

  updateMousePos(e.changedTouches[0])
  Input.mousePress = 1
})

document.body.addEventListener('mousemove', onMouseMove)
const SHAPE_FOUR = 'FourShape'
const SHAPE_TRIANGLE = 'TriangleShape'
const SHAPE_CIRCLE = 'CircleShape'
const SHAPE_U = 'UShape'

const ACTION_FLIPH = 'FlipHAction'
const ACTION_FLIPV = 'FlipVAction'
const ACTION_ROTATECW = 'RotateCWAction'
const ACTION_ROTATECCW = 'RotateCCWAction'
const ACTION_SWAP = 'SwapAction'
const ACTION_SHIFT = 'ShiftAction'

function pick(...args) {
  return args[Math.floor(Math.random() * args.length)]
}

function randomOrientation() {
  const a = pick(-1, 1)
  const b = pick(-1, 1)
  return pick(
    [a, 0, 0, b],
    [0, a, b, 0]
  )
}

function flipH ([a, b, c, d]) {
  return [-a, b, -c, d]
}

function flipV ([a, b, c, d]) {
  return [a, -b, c, -d]
}

function rotateCW ([a, b, c, d]) {
  return [b, -a, d, -c]
}

function rotateCCW ([a, b, c, d]) {
  return [-b, a, -d, c]
}

function deepClone (level) {
  return {
    shapes: [...level.shapes],
    orientations: [...level.orientations]
  }
}

function applyAction (level, action, inverse = false) {
  switch (action[0]) {
    case ACTION_FLIPH:
      level.orientations[action[1]] = flipH(level.orientations[action[1]])
      break
    case ACTION_FLIPV:
      level.orientations[action[1]] = flipV(level.orientations[action[1]])
      break
    case ACTION_ROTATECCW:
      level.orientations[action[1]] = (inverse ? rotateCW : rotateCCW)(level.orientations[action[1]])
      break
    case ACTION_ROTATECW:
      level.orientations[action[1]] = (inverse ? rotateCCW : rotateCW)(level.orientations[action[1]])
      break
    case ACTION_SWAP:
      const p1 = action[1], p2 = action[2]
      const o1 = level.orientations[p1]
      const o2 = level.orientations[p2]
      level.orientations[p1] = o2
      level.orientations[p2] = o1
      const s1 = level.shapes[p1]
      const s2 = level.shapes[p2]
      level.shapes[p1] = s2
      level.shapes[p2] = s1
      break
    case ACTION_SHIFT:
      if (action[1] === (1 - inverse * 2)) {
        level.orientations.unshift(level.orientations.pop())
        level.shapes.unshift(level.shapes.pop())
      } else {
        level.orientations.push(level.orientations.shift())
        level.shapes.push(level.shapes.shift())
      }
      break
  }
}

function serializeSequence ({ shapes, orientations }) {
  let s = ''
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i]
    let g = ''
    if (shape === SHAPE_FOUR) {
      switch (JSON.stringify(orientations[i])) {
        case '[1,0,0,1]': g = 'A'; break
        case '[1,0,0,-1]': g = 'B'; break
        case '[-1,0,0,1]': g = 'C'; break
        case '[-1,0,0,-1]': g = 'D'; break
        case '[0,1,1,0]': g = 'E'; break
        case '[0,1,-1,0]': g = 'F'; break
        case '[0,-1,1,0]': g = 'G'; break
        case '[0,-1,-1,0]': g = 'H'; break
        default: throw new Error(JSON.stringify(orientations[i]))
      }
    } else if (shape === SHAPE_TRIANGLE) {
      switch (JSON.stringify(orientations[i])) {
        case '[1,0,0,1]':
        case '[0,-1,-1,0]': g = 'I'; break
        case '[1,0,0,-1]':
        case '[0,1,-1,0]': g = 'J'; break
        case '[-1,0,0,-1]':
        case '[0,1,1,0]': g = 'K'; break
        case '[-1,0,0,1]':
        case '[0,-1,1,0]': g = 'L'; break
        default: throw new Error(JSON.stringify(orientations[i]))
      }
    } else {
      g = 'O'
    }
    s += g
  }
  return s
}

module.exports = {
  SHAPE_FOUR,
  SHAPE_TRIANGLE,
  SHAPE_CIRCLE,
  SHAPE_U,
  ACTION_FLIPH,
  ACTION_FLIPV,
  ACTION_ROTATECW,
  ACTION_ROTATECCW,
  ACTION_SWAP,
  ACTION_SHIFT,
  pick,
  randomOrientation,
  flipH,
  deepClone,
  applyAction,
  serializeSequence
}
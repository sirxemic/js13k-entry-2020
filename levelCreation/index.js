const { createLevel } = require('./levelCreator');
const { solve } = require('./levelSolver');
const { SHAPE_FOUR, SHAPE_CIRCLE, ACTION_FLIPV, ACTION_FLIPH, ACTION_ROTATECCW, ACTION_ROTATECW, ACTION_SHIFT, SHAPE_TRIANGLE, SHAPE_U } = require('./utils');

function makeOrientationString (o) {
  const s = JSON.stringify(o)
  if (s === '[1,0,0,1]') return 'O1'
  if (s === '[-1,0,0,1]') return 'H1'
  if (s === '[1,0,0,-1]') return 'V1'
  return s
}

function printLevel (level, maxMoves) {
  const offset = (level.shapes.length - 1) / 2
  console.log('{')
  console.log(`  shapes: [${level.shapes.join(', ')}],`)
  console.log(`  orientations: [${level.orientations.map(makeOrientationString).join(', ')}],`)
  console.log(`  actions: [`)
  for (let action of level.actions) {
    const [actionName, ...actionArgs] = action
    if (actionName === 'ShiftAction') actionArgs[0] *= offset + 1
    else {
      actionArgs[0] -= offset
      if (actionName === 'SwapAction') actionArgs[1] -= offset
    }
    console.log(`    [${actionName}, ${actionArgs.join(', ')}],`)
  }
  console.log(`  ],`)
  console.log(`  maxMoves: ${maxMoves},`)
  console.log(`  timeLimit: 30`)
  console.log(`}`)
}

while (true) {
  const targetMoveCount = 6
  const level = createLevel(3, 5, targetMoveCount)
  const [moveCount, history] = solve(level, targetMoveCount)

  if (moveCount === targetMoveCount) {
    console.log(history)
    printLevel(level, moveCount)
    break
  }
}

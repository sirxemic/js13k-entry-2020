const {
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
  applyAction,
  serializeSequence
} = require('./utils')

function mirrorOrientations (orientations) {
  let result = []
  for (let i = orientations.length - 1; i >= 0; i--) {
    result.push(flipH(orientations[i]))
  }
  return result
}

function createShapeSequence (n) {
  let shapesLeft = []
  const orientationsLeft = []
  for (let i = 0; i < n; i++) {
    shapesLeft.push(pick(SHAPE_TRIANGLE, SHAPE_FOUR, SHAPE_U))
    orientationsLeft.push(randomOrientation())
  }

  return {
    shapes: [...shapesLeft, SHAPE_CIRCLE, ...[...shapesLeft].reverse()],
    orientations: [...orientationsLeft, [1, 0, 0, 1], ...mirrorOrientations(orientationsLeft)],
  }
}

function createActions (n, m) {
  const shapeCount = n * 2 + 1
  const actions = []

  const singleShapeActions = {}
  const swapActions = {}
  const shiftActions = {}

  function getRandomPosition () {
    return Math.floor(Math.random() * shapeCount)
  }

  function getRandomPositionPair () {
    let a, b
    do {
      a = getRandomPosition()
      b = getRandomPosition()
    } while (a === b)
    return [Math.min(a, b), Math.max(a, b)]
  }

  function getRandomAction () {
    const c = Math.random()
    if (c < 0.1) return [ACTION_FLIPH, getRandomPosition()]
    if (c < 0.2) return [ACTION_FLIPV, getRandomPosition()]
    if (c < 0.3) return [ACTION_ROTATECCW, getRandomPosition()]
    if (c < 0.4) return [ACTION_ROTATECW, getRandomPosition()]
    if (c < 0.7) return [ACTION_SWAP, ...getRandomPositionPair()]
    return [ACTION_SHIFT, Math.floor(Math.random() * 2) * 2 - 1]
  }

  function actionNotAllowed (action) {
    switch (action[0]) {
      case ACTION_FLIPH:
      case ACTION_FLIPV:
      case ACTION_ROTATECCW:
      case ACTION_ROTATECW:
        return singleShapeActions[action[1]]
      case ACTION_SWAP:
        return (swapActions[action[1]] || 0) >= 2 || (swapActions[action[2]] || 0) >= 2
      case ACTION_SHIFT:
        return shiftActions[1] || shiftActions[-1]
    }
    throw new Error('wat?')
  }

  function getAction () {
    let action
    do {
      action = getRandomAction()
    } while (actionNotAllowed(action))
    return action
  }

  for (let i = 0; i < m; i++) {
    const action = getAction()
    switch (action[0]) {
      case ACTION_FLIPH:
      case ACTION_FLIPV:
      case ACTION_ROTATECCW:
      case ACTION_ROTATECW:
        singleShapeActions[action[1]] = 1
        break
      case ACTION_SWAP:
        swapActions[action[1]] = (swapActions[action[1]] || 0) + 1
        swapActions[action[2]] = (swapActions[action[2]] || 0) + 1
        break
      case ACTION_SHIFT:
        shiftActions[action[1]] = 1
        break
    }
    actions.push(action)
  }
  return actions
}

function applyActions (level, moveCount, history = [], moveSequence = []) {
  if (moveCount === 0) {
    return moveSequence
  }

  let possibleActions = [...level.actions]
  // Temp: no consecutive shifts
  if (moveSequence[moveSequence.length - 1] && moveSequence[moveSequence.length - 1][0] === ACTION_SHIFT) {
    possibleActions.splice(possibleActions.indexOf(moveSequence[moveSequence.length - 1]), 1)
  }
  // End temp
  while (possibleActions.length > 0) {
    const levelBeforeAction = serializeSequence(level)
    const action = pick(...possibleActions)
    applyAction(level, action, true)
    const levelAfterAction = serializeSequence(level)
    if (history.includes(levelAfterAction) || levelAfterAction === levelBeforeAction) {
      // Undo
      applyAction(level, action, false)
      possibleActions.splice(possibleActions.indexOf(action), 1)
    } else {
      // Action is valid, let's go deeper
      const success = applyActions(level, moveCount - 1, history.concat([levelBeforeAction]), moveSequence.concat([action]))
      if (success) {
        return success
      } else {
        applyAction(level, action, false)
        possibleActions.splice(possibleActions.indexOf(action), 1)
      }
    }
  }

  return false
}

function createSolvedPuzzle (n, actionCount) {
  const { shapes, orientations } = createShapeSequence(n)
  const actions = createActions(n, actionCount)
  return {
    shapes,
    orientations,
    actions
  }
}

function createLevel (n, actionCount, moveCount) {
  let level
  let moveSequence
  while (!moveSequence) {
    level = createSolvedPuzzle(n, actionCount)
    moveSequence = applyActions(level, moveCount)
  }

  return level
}

module.exports = {
  createLevel
}
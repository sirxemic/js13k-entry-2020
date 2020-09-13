const {
  SHAPE_FOUR,
  SHAPE_TRIANGLE,
  SHAPE_U,
  applyAction,
  serializeSequence
} = require('./utils')

function isSymmetric (level) {
  const N = level.shapes.length
  for (let i = 0; i <= Math.ceil(N / 2); i++) {
    const s1 = level.shapes[i]
    const s2 = level.shapes[N - 1 - i]
    const [a1, b1, c1, d1] = level.orientations[i]
    const [a2, b2, c2, d2] = level.orientations[N - 1 - i]
    if (s1 !== s2) return false
    switch (s1) {
      case SHAPE_FOUR:
        if (!(a1 === -a2 && c1 === -c2 && b1 === b2 && d1 === d2)) return false
        break
      case SHAPE_TRIANGLE:
        if (!(b1 - d1 === b2 - d2 && a1 - c1 === c2 - a2)) return false
        break
      case SHAPE_U:
        if (!(c1 === -c2 && d1 === d2)) return false
        break
    }
  }
  return true
}

function solve (level, maxMoveCount, moveCount = 0, history = []) {
  if (isSymmetric(level)) {
    return [moveCount, history]
  }

  if (moveCount === maxMoveCount) {
    return [-1]
  }

  let bestMoveCount = -1
  let bestMoveHistory = null

  const levelBeforeAction = serializeSequence(level)
  for (let action of level.actions) {
    applyAction(level, action)
    const levelAfterAction = serializeSequence(level)
    if (history.includes(levelAfterAction) || levelAfterAction === levelBeforeAction) {
      // Undo
      applyAction(level, action, true)
      continue
    }

    let [result, bestHistory] = solve(level, maxMoveCount, moveCount + 1, history.concat([levelBeforeAction]))
    if (result !== -1 && (bestMoveCount === -1 || result < bestMoveCount)) {
      bestMoveCount = result
      bestMoveHistory = bestHistory
    }
    applyAction(level, action, true)
  }

  return [bestMoveCount, bestMoveHistory]
}

module.exports = {
  solve
}
const { createLevel } = require('./levelCreator');
const { solve } = require('./levelSolver');
const { SHAPE_FOUR, SHAPE_CIRCLE, ACTION_FLIPV, ACTION_FLIPH, ACTION_ROTATECCW, ACTION_ROTATECW, ACTION_SHIFT } = require('./utils');

while (true) {
  const targetMoveCount = 5
  const level = //createLevel(1, 4, targetMoveCount)
  {
    shapes: [SHAPE_FOUR, SHAPE_FOUR, SHAPE_FOUR, SHAPE_FOUR, SHAPE_FOUR, SHAPE_FOUR, SHAPE_CIRCLE],
    orientations: [[1, 0, 0, 1], [1, 0, 0, -1], [-1, 0, 0, 1], [0, 1, 1, 0], [0, 1, -1, 0], [0, -1, -1, 0], [1, 0, 0, 1]],
    actions: [
      [ACTION_FLIPV, 0],
      [ACTION_ROTATECCW, 2],
      [ACTION_ROTATECW, 4],
      [ACTION_FLIPH, 6],
      [ACTION_SHIFT, -1],
      [ACTION_SHIFT, 1]
    ],
    maxMoves: 5
  }
  const moveCount = solve(level, 9)

  console.log(moveCount)
}

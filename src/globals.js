export let delta
export function setDelta (value) {
  delta = value
}

export let score = 0
export function addToScore (add) {
  score += add
}

export let time = 0
export function setTime (value) {
  time = value
}
export function updateTime (delta) {
  time -= delta
}

export let levelIndex = 0
export function setLevelIndex (index) {
  levelIndex = index
}
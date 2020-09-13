export let delta
export function setDelta (value) {
  delta = value
}

export let score = 0
export function addToScore (add) {
  score += add
}

export let time = 0
let timeMultiplier = 1
export function setTime (value) {
  time = value
}
export function updateTime (delta) {
  time -= delta * timeMultiplier
}
export function slowDownTime () {
  timeMultiplier = 0.5
}

export let lives = 3
export function removeLife () {
  lives--
}

export function resetScoreAndLives () {
  score = 0
  lives = 3
}

export let levelIndex = 0
export function setLevelIndex (index) {
  levelIndex = index
}

export let showTutorial = true
export let casualMode = false
export function updateShowTutorial () {
  showTutorial = !showTutorial
}
export function updateCasualMode () {
  casualMode = !casualMode
}
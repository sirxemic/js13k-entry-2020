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

export let lives = 3
export function removeLife () {
  lives--
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
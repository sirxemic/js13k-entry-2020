const GAME_ID = 'sxmc404'

export function saveProgress (levelIndex) {
  window.localStorage.setItem(GAME_ID, levelIndex)
}

export function loadProgress () {
  return +window.localStorage.getItem(GAME_ID)
}

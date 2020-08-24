export function decibelsToAmplitude (db) {
  return 10 ** (db / 20)
}

export function amplitudeToDecibels (amplitude) {
  return 20 * Math.log10(amplitude)
}

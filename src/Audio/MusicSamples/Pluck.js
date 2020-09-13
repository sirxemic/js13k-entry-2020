import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  sampleTriangle
} from '../SoundGeneration'


export function createPluckSound (frequency, length, lessAttack) {
  const volumeEnvelope = [
    [0, 0],
    [0.001, lessAttack ? 0.1 : 1],
    [lessAttack ? 0.01 : 0.002, lessAttack ? 0.2 : 0.67, 0.3],
    [0.1, 0.25, 0.5],
    [1, 0]
  ]

  let p = 0

  function getSample () {
    p += getFrequencyDelta(frequency * 1.5 ** (Math.random() - 0.5))
    return sampleTriangle(p)
  }

  return applyEnvelope(generateSound(length, getSample), volumeEnvelope)
}

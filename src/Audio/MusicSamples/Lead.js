import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  lowPassFilter,
  sampleSawtooth
} from '../SoundGeneration'

const volumeEnvelope = [
  [0, 0, 1.2],
  [0.1, 0.15],
  [0.9, 0.15],
  [1, 0]
]

export function createLeadSound (frequency, length) {
  let p = 0

  function getSample (t) {
    p += getFrequencyDelta(frequency)
    return sampleSawtooth(p)
  }

  const freqEnvelope = [
    [0, 80],
    [0.5, 1400],
    [1, 80]
  ]

  return applyEnvelope(lowPassFilter(generateSound(length, getSample), freqEnvelope), volumeEnvelope)
}

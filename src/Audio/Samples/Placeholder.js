import {
  generateSound,
  bandPassFilter,
  applyEnvelope,
  sampleNoise,
  createAudioBuffer
} from '../SoundGeneration'

export function createPlaceholderSound () {
  const volumeEnvelope = [
    [0, 0.2, 0.2],
    [1, 0]
  ]

  return bandPassFilter(
    applyEnvelope(generateSound(0.2, sampleNoise), volumeEnvelope),
    2000,
  )
}

import { generateSound, bandPassFilter, applyEnvelope, sampleNoise } from '../SoundGeneration'

export function createRotateSound () {
  const volumeEnvelope = [
    [0.0, 0.5, 0.2],
    [0.3, 0],
    [0.301, 0.4, 0.2],
    [0.5, 0],
    [0.501, 0.35, 0.2],
    [1.0, 0.0]
  ]

  return bandPassFilter(
    applyEnvelope(generateSound(0.1, sampleNoise), volumeEnvelope),
    1800,
    3
  )
}

export function createReverseRotateSound () {
  const result = createRotateSound()
  result.reverse()
  return result
}
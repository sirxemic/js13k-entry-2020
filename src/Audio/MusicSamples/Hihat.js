import { contextSampleRate } from '../Context'
import {
  generateSound,
  applyEnvelope,
  sampleNoise,
  bandPassFilter
} from '../SoundGeneration'

const volumeEnvelope = [
  [0, 0],
  [0.001, 1, 0.3],
  [1, 0]
]

export function createHihatSound (frequency, length) {
  return applyEnvelope(bandPassFilter(generateSound(length * 0.2, sampleNoise), 4000), volumeEnvelope)
}

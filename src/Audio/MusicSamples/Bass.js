import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  sampleSquare,
  lowPassFilter, sampleSine
} from '../SoundGeneration'
import { EnvelopeSampler } from '../../utils'

const volumeEnvelope = [
  [0, 0],
  [0.01, 1, 3],
  [0.5, 0],
  [0.625, 1, 0.25],
  [0.75, 0],
  [0.875, 1, 0.25],
  [1, 0]
]

const pitchEnvelope = [
  [0, 3, 0.02],
  [0.5, 0]
]

export function createBassSound (frequency, length) {
  let p = 0
  let pitchSampler = new EnvelopeSampler(pitchEnvelope)

  function getSample (t) {
    p += getFrequencyDelta(frequency * 2 ** pitchSampler.sample(t))
    return sampleSquare(p) + sampleSine(p)
  }

  const freqEnvelope = [
    [0, frequency * 6 * 0.25, 0.03],
    [0.5, frequency * 0.25]
  ]

  return applyEnvelope(lowPassFilter(generateSound(length, getSample), freqEnvelope, 0.5), volumeEnvelope)
}

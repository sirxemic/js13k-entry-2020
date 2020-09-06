import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  sampleTriangle,
} from '../SoundGeneration'
import { EnvelopeSampler } from '../../utils'

const volumeEnvelope = [
  [0, 0],
  [0.01, 1],
  [0.99, 1],
  [1, 0]
]

const pitchEnvelope = [
  [0, 3],
  [0.5, 0]
]

const noiseHoldEnvelope = [
  [0, 0.4, 0.2],
  [1, 0]
]

export function createFailSound () {
  let p = 0
  let pitchSampler = new EnvelopeSampler(pitchEnvelope)
  let noiseSampler = new EnvelopeSampler(noiseHoldEnvelope)

  let m = Math.random() * 2 - 1

  function getSample (t) {
    p += getFrequencyDelta(20 * 2 ** pitchSampler.sample(t))
    if (Math.random() < noiseSampler.sample(t)) {
      m = Math.random() * 2 - 1
    }
    return sampleTriangle(p) * m
  }

  return applyEnvelope(generateSound(0.5, getSample), volumeEnvelope)
}

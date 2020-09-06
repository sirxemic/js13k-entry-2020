import {
  generateSound,
  applyEnvelope,
  sampleSquare,
  getFrequencyDelta,
  sampleTriangle,
  sampleSine,
  sampleSawtooth
} from '../SoundGeneration'
import { addNotes } from '../SongGeneration'
import { contextSampleRate } from '../Context'

function createSuccessSound (frequency) {
  const volumeEnvelope = [
    [0, 0],
    [0.1, 0.2, 0.2],
    [1, 0]
  ]

  let p = 0

  function getSample (t) {
    p += getFrequencyDelta(frequency)
    return (sampleSquare(p) + sampleSine(p) + sampleSawtooth(p)) / 16 + sampleTriangle(p)
  }

  return applyEnvelope(generateSound(0.2, getSample), volumeEnvelope)
}

export function createSuccessJingle () {
  const bpm = 900
  const measureCount = 2
  const trackBeatCount = measureCount * 4
  const trackDuration = trackBeatCount * 60 / bpm
  const sampleCount = Math.ceil(trackDuration * contextSampleRate)
  const notes = [
    [0, 0],
    [1, 5],
    [2, 9],
    [3, 12],
    [4, 9],
    [5, 19],
  ]

  const output = new Float32Array(sampleCount)
  addNotes(notes, output, createSuccessSound, bpm)

  return output
}

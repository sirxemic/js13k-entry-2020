import {
  generateSound,
  applyEnvelope,
  sampleSquare,
  getFrequencyDelta,
  sampleTriangle,
  sampleSine,
  sampleSawtooth
} from '../SoundGeneration'
import { addNotes, createTempBuffer } from '../SongGeneration'

function createSuccessSound (frequency, length) {
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

  return applyEnvelope(generateSound(length * 3, getSample), volumeEnvelope)
}

export function createSuccessJingle () {
  const bpm = 900
  const measureCount = 2
  const trackBeatCount = measureCount * 4
  const notes = [
    [0, 0],
    [1, 5],
    [2, 9],
    [3, 12],
    [4, 9],
    [5, 19],
  ]

  const output = createTempBuffer(trackBeatCount, bpm)
  addNotes(notes, output, createSuccessSound, bpm)

  return output
}

export function createWinJingle () {
  const bpm = 700
  const measureCount = 8
  const trackBeatCount = measureCount * 4
  const notes = [
    [0, 0],
    [1, 5],
    [2, 9],
    [3, 12],
    [4, 9],
    [5, 19],
    [6, 16],
    [7, 19],
    [8, 24],
    [8, -12, 2],
    [12, -17, 2],
    [13, 26],
    [14, 28],
    [15, 31],
    [16, 36],
    [16, -24, 2],
  ]

  const output = createTempBuffer(trackBeatCount, bpm)
  addNotes(notes, output, createSuccessSound, bpm)

  return output
}

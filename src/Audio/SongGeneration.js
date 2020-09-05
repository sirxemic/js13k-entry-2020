import { TheAudioContext, TheAudioDestination, TheReverbDestination, contextSampleRate } from './Context'
import { waitForNextFrame, EnvelopeSampler } from '../utils'

export function addSoundToBuffer (sourceData, targetData, offset, mono = false) {
  if (!Array.isArray(sourceData)) {
    sourceData = [sourceData]
  }

  if (!Array.isArray(targetData)) {
    targetData = [targetData]
  }

  for (let i = 0; i < targetData.length; i++) {
    const sourceDataBuffer = sourceData[i % sourceData.length]
    const targetDataBuffer = targetData[i % targetData.length]

    const maxJ = Math.min(offset + sourceDataBuffer.length, targetDataBuffer.length)
    for (let j = offset; j < maxJ; j++) {
      targetDataBuffer[j] = (
        mono
        ? sourceDataBuffer[j - offset]
        : targetDataBuffer[j] + sourceDataBuffer[j - offset]
      )
    }
  }
}

export function createTempBuffer (noteCount, bpm) {
  return new Float32Array(Math.ceil(contextSampleRate * noteCount * 60 / bpm))
}

export function makeNotesFromBars (notes) {
  let globalOffset = 0
  let result = []
  let lastOffset = 0
  notes.forEach(([offset, ...args]) => {
    if (offset < lastOffset) {
      globalOffset += 4
    }
    lastOffset = offset
    result.push([globalOffset + offset, ...args])
  })
  return result
}

export function addNotes (notes, output, instrument, bpm, mono = false) {
  const bufferCache = {}
  notes.forEach(note => {
    let key = note.slice(1).join('|')
    if (!bufferCache[key]) {
      bufferCache[key] = instrument(getFrequencyForTone(note[1]), getLengthInSeconds(note[2], bpm), ...note.slice(3))
    }
    addSoundToBuffer(
      bufferCache[key],
      output,
      getOffsetForBeat(note[0], bpm),
      mono
    )
  })
}

export function getLengthInSeconds (n, bpm) {
  return n * 60 / bpm
}

export function getSamplePositionWithinBeat (n, bpm) {
  let beatDuration = contextSampleRate * 60 / bpm
  return (n % beatDuration) / beatDuration
}

export function getOffsetForBeat (n, bpm) {
  return Math.round(contextSampleRate * n * 60 / bpm)
}

export function getFrequencyForTone (n) {
  return 440 * 2 ** (n / 12)
}

export function repeatNotes (note, length, repeat) {
  const result = []
  for (let i = 0; i < repeat; i++) {
    result.push([length * i, note])
  }
  return result
}

export function addOctave (notes) {
  for (let i = 0, l = notes.length; i < l; i++) {
    let [offset, note, ...rest] = notes[i]
    notes.push([offset, note + 12, ...rest])
  }
  return notes
}

export function zipRhythmAndNotes (rhythm, notes) {
  return rhythm.map((beat, index) => {
    return [beat, notes[index]]
  })
}

export function offsetNotes (notes, amount) {
  notes.forEach(note => { note[0] += amount })
  return notes
}

export function setNoteLengths(notes, totalBeatCount) {
  for (let i = 0; i < notes.length - 1; i++) {
    notes[i][2] = notes[i + 1][0] - notes[i][0]
  }
  notes[notes.length - 1][2] = totalBeatCount - notes[notes.length - 1][0]
  return notes
}

export async function createBuffer (trackFunction, sampleCount) {
  const buffer = TheAudioContext.createBuffer(1, sampleCount, contextSampleRate)
  trackFunction(buffer.getChannelData(0))

  await waitForNextFrame()

  return buffer
}

export function applyRepeatingEnvelope (buffer, envelope, bpm) {
  const sampler = new EnvelopeSampler(envelope)
  let prevT = 0
  for (let i = 0; i < buffer.length; i++) {
    let t = getSamplePositionWithinBeat(i, bpm)
    if (t < prevT) {
      sampler.reset()
    }
    buffer[i] *= sampler.sample(t)
    prevT = t
  }

  return buffer
}



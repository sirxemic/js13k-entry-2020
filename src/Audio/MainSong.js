import { Song } from './Song'
import { createAudioBuffer } from './SoundGeneration'
import { contextSampleRate } from './Context'
import { addNotes, makeNotesFromBars, offsetNotes, applyRepeatingEnvelope, repeatNotes } from './SongGeneration'
import { createBassSound } from './MusicSamples/Bass'
import { createLeadSound } from './MusicSamples/Lead'

const measureCount = 8
const bpm = 96
const trackBeatCount = measureCount * 4
const trackDuration = trackBeatCount * 60 / bpm
const sampleCount = Math.ceil(trackDuration * contextSampleRate)

function createLeadTrack () {
  const notes = [
    [0, -12, 4],
    [0, -9, 4],
    [0, -5, 4],
    [0, -2, 4],

    [4, -2, 4],
    [4, 3, 4],
    [4, 7, 4],

    [8, -16, 4],
    [8, -12, 4],
    [8, -9, 4],
    [8, -5, 4],

    [12, -5, 4],
    [12, -2, 4],
    [12, 3, 4],
  ]
  const output = new Float32Array(sampleCount)
  addNotes(notes, output, createLeadSound, bpm)
  applyRepeatingEnvelope(output, [
    [0, 0.25, 3],
    [0.5, 1],
    [0.99, 1],
    [1, 0.25]
  ], bpm)
  return output
}

function createBassTrack () {
  const notes = [
    ...offsetNotes(repeatNotes(-24, 1, 8).map(note => [...note, 1]), 0),
    ...offsetNotes(repeatNotes(-28, 1, 8).map(note => [...note, 1]), 8),
    ...offsetNotes(repeatNotes(-24, 1, 8).map(note => [...note, 1]), 16),
    ...offsetNotes(repeatNotes(-28, 1, 8).map(note => [...note, 1]), 24),
  ]
  const output = new Float32Array(sampleCount)
  addNotes(notes, output, createBassSound, bpm, true)
  addNotes(offsetNotes(makeNotesFromBars([
    [0, -24 + 7, 1],
    [1, -24 + 7, 1],
    [2, -24 + 7, 1],
    [3, -24 + 7, 1],

    [0, -24 + 7, 1],
    [1, -24 + 7, 1],
    [2, -24 + 7, 1],
    [3, -24 + 10, 1],

    [0, -28 + 7, 1],
    [1, -28 + 7, 1],
    [2, -28 + 7, 1],
    [3, -28 + 7, 1],

    [0, -28 + 7, 1],
    [1, -28 + 7, 1],
    [2, -28 + 7, 1],
    [3, -24 + 10, 1],
  ]), 16), output, createBassSound, bpm)
  return output
}

function createPluckTrack () {

}

export default async function createSong () {
  const [
    bufferLead,
    bufferBass,
  ] = await Promise.all([
    createLeadTrack,
    createBassTrack,
  ].map(func => createAudioBuffer(func)))

  return new Song(
    [
      { buffer: bufferLead, sendToReverb: 1 },
      { buffer: bufferBass },
    ],
    { start: 0 }
  )
}


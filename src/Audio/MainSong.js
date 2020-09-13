import { Song } from './Song'
import { createAudioBuffer } from './SoundGeneration'
import {
  addNotes,
  makeNotesFromBars,
  offsetNotes,
  repeatNotes,
  applyRepeatingEnvelope,
  getOffsetForBeat,
  getOffsetForBar,
  createTempBuffer
} from './SongGeneration'
import { createBassSound } from './MusicSamples/Bass'
import { createLeadSound } from './MusicSamples/Lead'
import { createHihatSound } from './MusicSamples/Hihat'
import { createPluckSound } from './MusicSamples/Pluck'
import { waitForNextFrame } from '../utils'

const measureCount = 52
const bpm = 100
const trackBeatCount = measureCount * 4

function repeat (buffer, barFrom, barTo) {
  let start = getOffsetForBar(barFrom, bpm)
  let end = getOffsetForBar(barTo, bpm)
  buffer.set(buffer.subarray(start, end), end)
}

async function createChordsTrack () {
  const output = createTempBuffer(trackBeatCount, bpm)

  function createChord (notes, beats = 4) {
    const chordOutput = createTempBuffer(beats, bpm)
    addNotes(notes.map(x => [0, x, 4]), chordOutput, createLeadSound, bpm)
    return chordOutput
  }

  function setChord(chord, offset) {
    output.set(chord, getOffsetForBar(offset, bpm))
  }

  setChord(createChord([-9], 2), 3.5)

  const chord1 = createChord([-12, -9, -5, -2])
  const chord2 = createChord([-2, 3, 7])
  const chord3 = createChord([-16, -12, -9, -5])
  const chord4 = createChord([-5, -2, 3])
  const chord5 = createChord([-12, -9, -5])
  const chord6 = createChord([-12, -9])

  await waitForNextFrame()

  setChord(chord1, 12)
  setChord(chord2, 13)
  setChord(chord3, 14)
  setChord(chord4, 15)

  setChord(chord1, 16)
  setChord(chord2, 17)
  setChord(chord3, 18)
  setChord(chord4, 19)

  setChord(chord6, 20)
  setChord(createChord([-9, -2]), 21)
  setChord(chord6, 22)
  setChord(createChord([-5], 2), 23)
  setChord(createChord([-7], 2), 23.5)
  setChord(chord6, 24)
  setChord(createChord([-2], 2), 25)
  setChord(createChord([0], 2), 25.5)
  setChord(chord6, 26)
  setChord(createChord([-10], 2), 27)
  setChord(createChord([-5], 2), 27.5)
  addNotes([[23 * 4, -9, 3], [25 * 4, -9, 3], [27 * 4, -14, 4]], output, createLeadSound, bpm)

  await waitForNextFrame()

  setChord(createChord([-7], 2), 35.5)

  setChord(chord5, 36)
  setChord(chord2, 37)
  setChord(createChord([-12, -9, -4]), 38)
  setChord(createChord([-12, -9, -2]), 39)
  setChord(chord5, 40)
  setChord(createChord([-2, 0, 3, 7]), 41)
  setChord(chord3, 42)
  setChord(createChord([-14, -10, -7, -2], 2), 42.5)
  setChord(chord5, 43)

  repeat(output, 36, 44)

  await waitForNextFrame()

  applyRepeatingEnvelope(output, [
    [0, 0.25, 3],
    [0.5, 1],
    [0.99, 1],
    [1, 0.25]
  ], bpm)

  await waitForNextFrame()

  return createAudioBuffer(output)
}

async function createBassTrack () {
  const part1 = createTempBuffer(16, bpm)
  addNotes([
    ...repeatNotes(-24, 1, 8),
    ...offsetNotes(repeatNotes(-28, 1, 8), 8)
  ], part1, createBassSound, bpm, true)

  await waitForNextFrame()

  const part2 = createTempBuffer(32, bpm)
  addNotes(makeNotesFromBars([
    [0, -17], [1, -17], [2, -17], [3, -17],
    [0, -17], [1, -17], [2, -17], [3, -14], [3.5, -12], [3.79, -14],
    [0, -21], [1, -21], [2, -21], [3, -21],
    [0, -21], [1, -21], [2, -21], [3, -19], [3.5, -16],
    [0, -17], [1, -17], [2, -17], [3, -17],
    [0, -17], [1, -17], [2, -17], [3, -14], [3.5, -12], [3.79, -14],
    [0, -21], [1, -21], [2, -21], [3, -21],
    [0, -19], [1, -19], [2, -22], [3, -22]
  ]), part2, createBassSound, bpm, true)
  addNotes([
    ...repeatNotes(-24, 1, 8),
    ...offsetNotes(repeatNotes(-28, 1, 7), 8),
    [15, -26],
    ...offsetNotes(repeatNotes(-24, 1, 8), 16),
    ...offsetNotes(makeNotesFromBars([
      [0, -28], [1, -28], [2, -28], [3, -28],
      [0, -26], [1, -26], [2, -29], [3, -29],
    ]), 24),
  ], part2, createBassSound, bpm, false)

  // Remove some clicks
  applyRepeatingEnvelope(part2, [
    [0, 1],
    [0.999, 1],
    [1, 0]
  ], bpm / 8)

  await waitForNextFrame()

  const part3 = createTempBuffer(16, bpm)
  addNotes([
    ...repeatNotes(-24, 1, 8),
    [8, -31],
    [9, -31],
    [10, -29],
    [11, -29],
    [12, -28],
    [13, -28],
  ], part3, createBassSound, bpm, true)

  await waitForNextFrame()

  const output = createTempBuffer(trackBeatCount, bpm)
  output.set(part1, 0)
  output.set(part2, getOffsetForBar(4, bpm))
  output.set(part1, getOffsetForBar(12, bpm))
  output.set(part1, getOffsetForBar(16, bpm))
  output.set(part2, getOffsetForBar(20, bpm))
  output.set(part2, getOffsetForBar(28, bpm))
  output.set(part1, getOffsetForBar(36, bpm))
  output.set(part3, getOffsetForBar(40, bpm))
  output.set(part1, getOffsetForBar(44, bpm))
  output.set(part3, getOffsetForBar(48, bpm))

  return createAudioBuffer(output)
}

async function createHihatTrack () {
  const output = createTempBuffer(trackBeatCount, bpm)
  const loop = createTempBuffer(4, bpm)
  addNotes([
    [0.5, 0, 1],
    [1.5, 0, 1],
    [2.5, 0, 1],
    [3.5, 0, 1],
    [3.79, 0, 0.9],
  ], loop, createHihatSound, bpm, true)
  const special = loop.subarray(getOffsetForBeat(3.5, bpm))
  for (let i = 20; i < 52; i++) {
    output.set(loop, getOffsetForBar(i, bpm))
  }
  output.set(special, getOffsetForBeat(31 * 4 + 3, bpm))
  output.set(special, getOffsetForBeat(35 * 4 + 3, bpm))
  output.set(special, getOffsetForBeat(43 * 4 + 3, bpm))
  output.set(special, getOffsetForBeat(51 * 4 + 3, bpm))

  return createAudioBuffer(output)
}

async function createMelodyTrack () {
  const output = createTempBuffer(trackBeatCount, bpm)

  // Section 1
  addNotes(
    [
      ...offsetNotes(makeNotesFromBars([
        [0, 3], [1, 3], [2, 3], [3, 3],
        [0, 3], [1, 3], [2, 3], [3, 2],
        [0, 0], [1, 0], [2, 0], [3, -2], [3.5, -9],
        [0, 0], [1, 0], [2, 0], [3, 5],
        [0, 3], [1, 3], [2, 3], [3, 3],
        [0, 3], [1, 3], [2, 5], [2.5, 7], [3, 2],
        [0, 0], [1, 0], [2, 0], [2.5, 7], [3, 8], [3.5, 7],
        [0, 2], [0.5, 0], [1, -2], [1.5, 3], [2, -2], [2.5, 2], [3, -5],
      ]), 4 * 4 + 0.5)
    ],
    output,
    createPluckSound,
    bpm,
    true
  )

  await waitForNextFrame()

  // Section 2
  addNotes(
    offsetNotes(
      [
        [0, -12], [0.5, -5], [1, 0], [1.5, 2], [2, 3], [2.5, 5], [3, 7], [3.5, 12], [3.79, 10],
        [8.5, -12], [9, -9], [9.5, -4], [10, 0], [10.5, 3], [11, 7], [11.5, 8], [11.79, -4],
      ],
      4 * 12
    ),
    output,
    createPluckSound,
    bpm
  )

  // Repeat section 2
  repeat(output, 12, 16)

  await waitForNextFrame()

  // Some nice reverse sounds
  const temp = createTempBuffer(2, bpm)
  addNotes([[0, -12]], temp, createPluckSound, bpm)
  temp.reverse()
  output.set(temp, getOffsetForBeat(19 * 4 + 2, bpm))
  output.set(temp, getOffsetForBeat(19 * 4 + 2 + 8, bpm))
  output.set(temp, getOffsetForBeat(19 * 4 + 2 + 32, bpm))

  // Section 3
  addNotes(
    [
      ...offsetNotes(makeNotesFromBars([
        [0, 3], [1, 3], [2, 3], [3, 3],
        [0, 3], [1, 3], [2, 5], [3, 2],
        [0, 0], [1, 0], [2, 0], [3, -2], [3.29, -5],
        [0, 0], [1, 0], [2, 0], [3, 5], [3.29, 7],
        [0, 3], [1, 3], [2, 3], [3, 3],
        [0, 3], [1, 3], [2, 5], [2.5, 7], [3, 2],
        [0, 0], [1, 0], [2, 0], [2.5, 7], [3, 8], [3.5, 7],
        [0, 2], [0.5, 5], [1, 2], [1.29, 0], [2, 2], [2.5, 3], [3, -5], [3.25, -9],
      ]), 28 * 4 + 0.5)
    ],
    output,
    createPluckSound,
    bpm,
    true
  )

  await waitForNextFrame()

  addNotes(
    [
      [4 * 34 + 3, 0, 1, 1],
      [4 * 34 + 3.5, 0, 1, 1],
      [4 * 35 + 2.5, -2, 1, 1],
      [4 * 35 + 3, -7, 1, 1],
      [4 * 35 + 3, -7, 1, 1],
    ],
    output,
    createPluckSound,
    bpm
  )

  // Section 4
  addNotes(
    offsetNotes(
      [
        ...[
          -12,-5,0,2,3,5,7,12,10,7,5,3,5,0,2,-2,0,-12,-9,-4,0,3,7,8,-4,0,3,7,8,7,3,0,
          -12,-5,0,2,3,5,7,12,10,7,5,3,5,0,2,-2,0,-12,-9,-4,0,-14,-10,-5,0,3,5,7,8,3,0,-5,-12,-5,0,2,3,5,7,12
        ].map((x, i) => [i * 0.5, x]),

        [3.5, -17, 1, 1], [3.79, -12],
        [7.5, -9, 1, 1], [7.79, -10],
        [11.5, -9, 1, 1], [11.79, -10],
        [19.5, -17, 1, 1], [19.79, -12],
        [23.5, -9, 1, 1], [23.79, -10],
        [27.5, -9, 1, 1], [27.79, -10],
      ],
      4 * 36
    ),
    output,
    createPluckSound,
    bpm
  )

  // Repeat section 4
  repeat(output, 36, 44)

  return createAudioBuffer(output)
}

export default async function createSong () {
  const [
    bufferChords,
    bufferBass,
    bufferHats,
    bufferMelody
  ] = await Promise.all([
    createChordsTrack(),
    createBassTrack(),
    createHihatTrack(),
    createMelodyTrack()
  ])

  return new Song(
    [
      { buffer: bufferChords, volume: 1, sendToReverb: 1 },
      { buffer: bufferMelody, volume: 0.54, sendToReverb: 1 },
      { buffer: bufferBass, volume: 0.64 },
      { buffer: bufferHats, volume: 0.06 },
    ]
  )
}


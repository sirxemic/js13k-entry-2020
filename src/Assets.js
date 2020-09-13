import { waitForNextFrame } from './utils'
import { TheAudioContext, setReverbDestination } from './Audio/Context'
import { createRotateSound, createReverseRotateSound } from './Audio/Samples/Rotate'
import { createSuccessJingle, createWinJingle } from './Audio/Samples/SuccessJingle'
import createMainSong from './Audio/MainSong'
import { createAudioBuffer } from './Audio/SoundGeneration'
import { createReverbIR } from './Audio/Samples/ReverbIR'
import { createFailSound } from './Audio/Samples/Fail'

export let MainSong
export let RotateSound
export let ReverseRotateSound
export let SuccessJingle
export let WinJingle
export let FailSound

function createReverb () {
  const reverb = TheAudioContext.createConvolver()
  reverb.buffer = createAudioBuffer(createReverbIR())

  setReverbDestination(reverb)
}

export async function loadAssets () {
  RotateSound = createAudioBuffer(createRotateSound())
  ReverseRotateSound = createAudioBuffer(createReverseRotateSound())

  await waitForNextFrame()

  SuccessJingle = createAudioBuffer(createSuccessJingle())
  WinJingle = createAudioBuffer(createWinJingle())

  await waitForNextFrame()

  FailSound = createAudioBuffer(createFailSound())

  await waitForNextFrame()

  await createReverb()

  MainSong = await createMainSong()
}

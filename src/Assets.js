import { waitForNextFrame } from './utils'
import { TheAudioContext, setReverbDestination, contextSampleRate } from './Audio/Context'
import { createRotateSound } from './Audio/Samples/Rotate'
import { createSuccessJingle } from './Audio/Samples/SuccessJingle'
import createMainSong from './Audio/MainSong'
import { createAudioBuffer } from './Audio/SoundGeneration'
import { createReverbIR } from './Audio/Samples/ReverbIR'
import { createFailSound } from './Audio/Samples/Fail'

export let MainSong

export let RotateSound = createAudioBuffer(createRotateSound)
export let SuccessJingle = createAudioBuffer(createSuccessJingle)
export let FailSound = createAudioBuffer(createFailSound)

async function createReverb () {
  const reverb = TheAudioContext.createConvolver()
  const ir = createReverbIR()
  const irBuffer = TheAudioContext.createBuffer(2, ir[0].length, contextSampleRate)
  irBuffer.getChannelData(0).set(ir[0])
  irBuffer.getChannelData(1).set(ir[1])

  reverb.buffer = irBuffer

  setReverbDestination(reverb)

  await waitForNextFrame()
}

export async function loadAssets () {
  await Promise.all(
    [
      RotateSound,
      SuccessJingle,
      FailSound
    ]
  )

  await createReverb()

  MainSong = await createMainSong()
}

import { waitForNextFrame } from './utils'
import { TheAudioContext, setReverbDestination, contextSampleRate } from './Audio/Context'
import { createPlaceholderSound } from './Audio/Samples/Placeholder'
import { createAudioBuffer } from './Audio/SoundGeneration'
import { createReverbIR } from './Audio/Samples/ReverbIR'

export let PlaceholderSound = createAudioBuffer(createPlaceholderSound)

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
      PlaceholderSound
    ]
  )

  await createReverb()

  document.body.className = ''
}

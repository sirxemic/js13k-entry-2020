import { TheAudioContext, TheAudioDestination, TheReverbDestination } from './Audio/Context'

export async function playSample (sample, volume = 1, toReverb = false) {
  let source = TheAudioContext.createBufferSource()
  source.buffer = await sample

  if (toReverb) {
    source.connect(TheReverbDestination)
  }

  if (volume !== 1) {
    let gainNode = TheAudioContext.createGain()
    gainNode.gain.setValueAtTime(volume, 0)
    source.connect(gainNode)
    source.onended = () => gainNode.disconnect(TheAudioDestination)
    gainNode.connect(TheAudioDestination)
  } else {
    source.connect(TheAudioDestination)
  }

  source.start()
}

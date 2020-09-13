import { TheAudioContext, TheAudioDestination, TheReverbDestination } from './Audio/Context'

export function playSample (sample, volume = 1, toReverb = false) {
  let source = TheAudioContext.createBufferSource()
  source.buffer = sample

  let toConnect = source


  if (volume !== 1) {
    let gainNode = TheAudioContext.createGain()
    gainNode.gain.setValueAtTime(volume, 0)
    source.connect(gainNode)
    source.onended = () => gainNode.disconnect(TheAudioDestination)
    gainNode.connect(TheAudioDestination)
    toConnect = gainNode
  } else {
    source.connect(TheAudioDestination)
  }

  if (toReverb) {
    toConnect.connect(TheReverbDestination)
  }

  source.start()
}

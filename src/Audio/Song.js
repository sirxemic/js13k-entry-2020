import { TheAudioContext, TheAudioDestination, TheReverbDestination } from './Context'

export class Song {
  constructor (channelConfigs) {
    this.channelConfigs = channelConfigs

    let master = TheAudioContext.createGain()

    this.channels = channelConfigs.map(config => {
      let gainNode = TheAudioContext.createGain()

      gainNode.connect(master)

      if (config.sendToReverb) {
        let gain = TheAudioContext.createGain()
        gain.gain.value = config.sendToReverb
        gainNode.connect(gain)
        gain.connect(TheReverbDestination)
      }

      return {
        buffer: config.buffer,
        sourceTarget: gainNode,
        volume: config.volume,
        volumeParam: gainNode.gain
      }
    })

    master.connect(TheAudioDestination)
  }

  stop () {
    this.channels.forEach(channel => {
      if (channel.source) channel.source.disconnect()
      channel.source = null
    })
  }

  fadeOut (time = 1) {
    this.channels.forEach(channel => {
      channel.volumeParam.linearRampToValueAtTime(0, TheAudioContext.currentTime + time)
    })

    setTimeout(() => this.stop(), time * 1000)
  }

  tapeStop (time = 1) {
    this.channels.forEach(channel => {
      channel.source.playbackRate.setValueAtTime(1, TheAudioContext.currentTime)
      channel.source.playbackRate.linearRampToValueAtTime(0.001, TheAudioContext.currentTime + time)
    })
  }

  play () {
    this.channels.forEach(channel => {
      if (channel.source) {
        channel.source.disconnect()
      }

      const sourceNode = TheAudioContext.createBufferSource()
      sourceNode.loop = true
      sourceNode.loopEnd = channel.buffer.duration
      sourceNode.buffer = channel.buffer
      sourceNode.connect(channel.sourceTarget)
      sourceNode.start()
      channel.source = sourceNode
      channel.volumeParam.value = channel.volume
    })
  }
}
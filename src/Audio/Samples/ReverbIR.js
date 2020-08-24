import { applyEnvelope, generateSound, sampleNoise } from '../SoundGeneration'

export function createReverbIR () {
  function createNoisyEnvelope () {
    let t = 0
    let result = []
    do {
      result.push([t, Math.random()])

      t += 0.01
    } while (t <= 1)

    return result
  }
  const volumeEnvelope1 = createNoisyEnvelope()
  const volumeEnvelope2 = createNoisyEnvelope()

  const globalEnvelope = [
    [0, 0, 0.5],
    [0.05, 1, 0.2],
    [1, 0]
  ]

  return [
    applyEnvelope(
      applyEnvelope(
        generateSound(4, sampleNoise),
        volumeEnvelope1
      ),
      globalEnvelope
    ),
    applyEnvelope(
      applyEnvelope(
        generateSound(4, sampleNoise),
        volumeEnvelope2
      ),
      globalEnvelope
    )
  ]
}

const N = 30

export function create2DArrow (vertices, normals, indices, angleStart, angleEnd, radius, halfTailWidth, halfHeadWidth) {
  let offset = 0
  for (let i = 0; i < N; i ++) {
    const t = i / (N - 1)
    const a = angleStart + (angleEnd - angleStart) * t
    const x1 = Math.cos(a) * (radius - halfTailWidth)
    const y1 = Math.sin(a) * (radius - halfTailWidth)
    const x2 = Math.cos(a) * (radius + halfTailWidth)
    const y2 = Math.sin(a) * (radius + halfTailWidth)
    vertices.push(
      x1, y1, 0,
      x2, y2, 0
    )
    normals.push(
      0, 0, 1,
      0, 0, 1
    )
    if (i < N - 1)
      indices.push(
        offset,
        offset + 1,
        offset + 3,
        offset,
        offset + 3,
        offset + 2
      )

    offset += 2
  }

  const lastX = Math.cos(angleEnd) * radius
  const lastY = Math.sin(angleEnd) * radius
  const normalX = Math.cos(angleEnd)
  const normalY = Math.sin(angleEnd)

  vertices.push(
    lastX + normalX * halfHeadWidth, lastY + normalY * halfHeadWidth, 0,
    lastX - normalX * halfHeadWidth, lastY - normalY * halfHeadWidth, 0,
    lastX - normalY * halfHeadWidth, lastY + normalX * halfHeadWidth, 0
  )

  normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1)
  indices.push(offset, offset + 1, offset + 2)
}

export function create3DArrow (vertices, normals, indices, halfTailWidth, halfHeadWidth, headStart, vertexCallback, normalCallback) {
  const headIndexStart = Math.round(headStart * N)
  let offset = 0
  for (let i = 0; i < N; i ++) {
    const t = i / (N - 1)
    if (i < headIndexStart) {
      vertices.push(
        ...vertexCallback(t, halfTailWidth)
      )
      normals.push(
        ...normalCallback(t)
      )
      indices.push(
        offset,
        offset + 1,
        offset + 3,
        offset,
        offset + 3,
        offset + 2
      )
    } else if (i === headIndexStart) {
      vertices.push(
        ...vertexCallback(t, halfTailWidth),
        ...vertexCallback(t, halfHeadWidth)
      )
      normals.push(
        ...normalCallback(t),
        ...normalCallback(t)
      )
      offset += 2
      indices.push(
        offset,
        offset + 1,
        offset + 3,
        offset,
        offset + 3,
        offset + 2
      )
    } else {
      const width = halfHeadWidth - (i - headIndexStart) / (N - 1 - headIndexStart) * halfHeadWidth
      vertices.push(
        ...vertexCallback(t, width)
      )
      normals.push(
        ...normalCallback(t)
      )
      if (i < N - 1) {
        indices.push(
          offset,
          offset + 1,
          offset + 3,
          offset,
          offset + 3,
          offset + 2
        )
      }
    }
    offset += 2
  }
}


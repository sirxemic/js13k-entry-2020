const N = 30

const halfTailWidth = 0.5
const halfHeadWidth = 1.5

export function create2DArrow (vertices, /* normals, */ indices, angleStart, angleEnd, radius, twoHeaded) {
  let offset = 0

  function addHead (angle, dir) {
    const lastX = Math.cos(angle) * radius
    const lastY = Math.sin(angle) * radius
    const normalX = Math.cos(angle)
    const normalY = Math.sin(angle)

    vertices.push(
      lastX + normalX * halfHeadWidth, lastY + normalY * halfHeadWidth, 0,
      lastX - normalX * halfHeadWidth, lastY - normalY * halfHeadWidth, 0,
      lastX + dir * normalY * halfHeadWidth, lastY - dir * normalX * halfHeadWidth, 0
    )

    // normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1)
    indices.push(offset, offset + 1, offset + 2)

    offset += 3
  }

  if (twoHeaded) {
    addHead(angleStart, 1)
  }

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
    // normals.push(
    //   0, 0, 1,
    //   0, 0, 1
    // )
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

  addHead(angleEnd, -1)
}

export class Matrix3 {
  constructor (els) {
    this.els = new Float32Array(els || 9)
  }

  getNormalMatrix (mat4) {
    const a = mat4.els
    let a00 = a[ 0], a01 = a[ 1], a02 = a[ 2], a03 = a[ 3]
    let a10 = a[ 4], a11 = a[ 5], a12 = a[ 6], a13 = a[ 7]
    let a20 = a[ 8], a21 = a[ 9], a22 = a[10], a23 = a[11]
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15]

    let b00 = a00 * a11 - a01 * a10
    let b01 = a00 * a12 - a02 * a10
    let b02 = a00 * a13 - a03 * a10
    let b03 = a01 * a12 - a02 * a11
    let b04 = a01 * a13 - a03 * a11
    let b05 = a02 * a13 - a03 * a12
    let b06 = a20 * a31 - a21 * a30
    let b07 = a20 * a32 - a22 * a30
    let b08 = a20 * a33 - a23 * a30
    let b09 = a21 * a32 - a22 * a31
    let b10 = a21 * a33 - a23 * a31
    let b11 = a22 * a33 - a23 * a32

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
    det = 1 / det

    this.els.set([
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a12 * b08 - a10 * b11 - a13 * b07) * det,
      (a10 * b10 - a11 * b08 + a13 * b06) * det,

      (a02 * b10 - a01 * b11 - a03 * b09) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,

      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det
    ])
  }
}
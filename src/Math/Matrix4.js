const identity = [
  1,0,0,0,
  0,1,0,0,
  0,0,1,0,
  0,0,0,1
]
export class Matrix4 {
  constructor (els = identity) {
    this.els = new Float32Array(els)
  }

  clone () {
    return new Matrix4(this.els)
  }

  setTranslation (x, y, z) {
    this.els.set([x, y, z], 12)
    return this
  }

  rotateX (theta) {
    const c = Math.cos(theta), s = Math.sin(theta)

		this.els.set([
			 1, 0, 0, 0,
			 0, c, s, 0,
			 0, -s, c, 0,
			 0, 0, 0, 1
    ])
  }

  rotateY (theta) {
    const c = Math.cos(theta), s = Math.sin(theta)

		this.els.set([
			 c, 0, -s, 0,
			 0, 1, 0, 0,
			 s, 0, c, 0,
			 0, 0, 0, 1
    ])
  }

  rotateZ (theta) {
    const c = Math.cos(theta), s = Math.sin(theta)

		this.els.set([
			 c, s, 0, 0,
			 -s, c, 0, 0,
			 0, 0, 1, 0,
			 0, 0, 0, 1
    ])
  }

  multiplyMatrices (a, b) {
		const ae = a.els
		const be = b.els

		const a11 = ae[0], a12 = ae[4], a13 = ae[ 8], a14 = ae[12]
		const a21 = ae[1], a22 = ae[5], a23 = ae[ 9], a24 = ae[13]
		const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14]
		const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15]

		const b11 = be[0], b12 = be[4], b13 = be[ 8], b14 = be[12]
		const b21 = be[1], b22 = be[5], b23 = be[ 9], b24 = be[13]
		const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14]
		const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15]

    this.els.set([
      a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41,
      a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41,
      a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41,
      a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41,

      a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42,
      a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42,
      a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42,
      a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42,

      a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43,
      a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43,
      a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43,
      a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43,

      a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44,
      a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44,
      a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44,
      a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44
    ])
    return this
  }

  getInverse (mat) {
    const e = mat.els

    let a00 = e[ 0], a01 = e[ 1], a02 = e[ 2], a03 = e[ 3]
    let a10 = e[ 4], a11 = e[ 5], a12 = e[ 6], a13 = e[ 7]
    let a20 = e[ 8], a21 = e[ 9], a22 = e[10], a23 = e[11]
    let a30 = e[12], a31 = e[13], a32 = e[14], a33 = e[15]

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

    let det = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

    this.els.set([
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a02 * b10 - a01 * b11 - a03 * b09) * det,
      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a22 * b04 - a21 * b05 - a23 * b03) * det,
      (a12 * b08 - a10 * b11 - a13 * b07) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a20 * b05 - a22 * b02 + a23 * b01) * det,
      (a10 * b10 - a11 * b08 + a13 * b06) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det,
      (a21 * b02 - a20 * b04 - a23 * b00) * det,
      (a11 * b07 - a10 * b09 - a12 * b06) * det,
      (a00 * b09 - a01 * b07 + a02 * b06) * det,
      (a31 * b01 - a30 * b03 - a32 * b00) * det,
      (a20 * b03 - a21 * b01 + a22 * b00) * det
    ])
  }

  fromPerspective (fovx, aspect, near, far) {
    let f = 1 / Math.tan(fovx / 2)
    let nf = 1 / (near - far)
    this.els.set([
      f, 0, 0, 0,
      0, f * aspect, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0
    ])
  }
}

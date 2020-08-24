export class Vector3 {
  constructor (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  set (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  copy (vec) {
    this.x = vec.x
    this.y = vec.y
    this.z = vec.z
    return this
  }

  length () {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
  }

  normalize () {
    const length = this.length()
    this.x /= length
    this.y /= length
    this.z /= length
    return this
  }

  multiplyScalar (scalar) {
    this.x *= scalar
    this.y *= scalar
    this.z *= scalar
    return this
  }

  crossVectors (v1, v2) {
    return this.set(
      v1.y * v2.z - v1.z * v2.y,
      v1.z * v2.x - v1.x * v2.z,
      v1.x * v2.y - v1.y * v2.x
    )
  }

  applyMatrix4 (m) {
    const x = this.x, y = this.y, z = this.z
    const e = m.els
    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15])

    return this.set(
      (e[0] * x + e[4] * y + e[8] * z + e[12]) * w,
      (e[1] * x + e[5] * y + e[9] * z + e[13]) * w,
      (e[2] * x + e[6] * y + e[10] * z + e[14]) * w
    )
  }

  transformDirection (m) {
		const x = this.x, y = this.y, z = this.z
		const e = m.els

		return this.set(
      e[0] * x + e[4] * y + e[8] * z,
      e[1] * x + e[5] * y + e[9] * z,
      e[2] * x + e[6] * y + e[10] * z
    ).normalize();
  }

  clone () {
    return new Vector3(this.x, this.y, this.z)
  }

  array () {
    return new Float32Array([this.x, this.y, this.z])
  }
}
export class FSM {
  constructor (fsm, initialState) {
    this.fsm = fsm
    this.newState = initialState
  }

  setState (name) {
    this.fsm[this.activeState].leave && this.fsm[this.activeState].leave()

    this.newState = name
  }

  step () {
    if (this.newState) {
      this.activeState = this.newState
      this.newState = null
      this.fsm[this.activeState].enter && this.fsm[this.activeState].enter()
    }
    this.fsm[this.activeState].execute && this.fsm[this.activeState].execute()
  }
}

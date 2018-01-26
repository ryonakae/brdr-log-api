'use strict'

export default class ResizeManager {
  constructor () {
    this.$window = null

    this.windowHeight = 0
    this.windowWidth = 0
    this.functions = {}
    this.fps = 60
    this.isResizing = false
  }

  init () {
    this.$window = window

    this.update()

    this.$window.addEventListener('resize', this.onResize.bind(this), false)
    this.$window.addEventListener(
      'orientationchange',
      this.onResize.bind(this),
      false
    )
  }

  add (name, func) {
    this.functions[name] = func
  }

  remove (name) {
    delete this.functions[name]
  }

  onResize () {
    if (this.isResizing) return

    this.isResizing = true

    if (this.$window.requestAnimationFrame) {
      requestAnimationFrame(this.update.bind(this))
    } else {
      setTimeout(this.update.bind(this), 1000 / this.fps)
    }
  }

  update () {
    this.windowWidth = this.$window.innerWidth
    this.windowHeight = this.$window.innerHeight

    if (Object.keys(this.functions).length > 0) {
      for (const func in this.functions) {
        this.functions[func]()
      }
    }

    this.isResizing = false
  }

  getWindowWidth () {
    return this.windowWidth
  }

  getWindowHeight () {
    return this.windowHeight
  }
}

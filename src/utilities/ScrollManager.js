'use strict'

export default class ScrollManager {
  constructor (options) {
    this.utils = options.utils

    this.scrollAmount = 0
    this.scrollDirection = null
    this.scrollTop = 0
    this.scrollBottom = 0
    this.touchStartY = 0

    this.functions = {}
    this.fps = 60
    this.isScrolling = false
  }

  init () {
    this.update()

    // pcはwheelイベント、タッチデバイスはtouchstart & touchmoveイベント
    if (this.utils.getDevice() === 'pc') {
      window.addEventListener(
        'wheel',
        e => {
          this.onScroll(e)
        },
        false
      )
    } else {
      window.addEventListener(
        'touchstart',
        e => {
          this.onTouchstart(e)
        },
        false
      )
      window.addEventListener(
        'touchmove',
        e => {
          this.onScroll(e)
        },
        false
      )
    }
  }

  add (name, func) {
    this.functions[name] = func
  }

  remove (name) {
    delete this.functions[name]
  }

  onScroll (event) {
    if (this.isScrolling) return

    this.isScrolling = true

    if (window.requestAnimationFrame) {
      requestAnimationFrame(() => {
        this.update(event)
      })
    } else {
      setTimeout(() => {
        this.update(event)
      }, 1000 / this.fps)
    }
  }

  onTouchstart (event) {
    this.touchStartY = event.changedTouches[0].pageY
  }

  update (event) {
    this.scrollTop = window.pageYOffset
    this.scrollBottom = this.getScrollTop() + window.innerHeight

    // スクロール量を設定
    // update関数の引数にeventが入ってる時だけ実行
    if (event) {
      if (this.utils.getDevice() === 'pc') {
        this.scrollAmount = event.deltaY
      } else {
        this.scrollAmount = this.touchStartY - event.changedTouches[0].pageY
      }
    }

    // スクロール方向を設定
    if (this.getAmount() > 0) {
      this.scrollDirection = 'down'
    } else if (this.getAmount() < 0) {
      this.scrollDirection = 'up'
    }

    // this.functionsに入っている関数をすべて実行
    if (Object.keys(this.functions).length > 0) {
      for (const func in this.functions) {
        this.functions[func]()
      }
    }

    this.isScrolling = false
  }

  getScrollTop () {
    return this.scrollTop
  }

  getScrollBottom () {
    return this.scrollBottom
  }

  getAmount () {
    return this.scrollAmount
  }

  getDirection () {
    return this.scrollDirection
  }
}

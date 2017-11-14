
'use strict'

import 'es6-promise/auto'
import UAParser from 'ua-parser-js'

export default class Utils {
  constructor () {
    this.ua = null
  }

  init () {
    const parser = new UAParser()
    this.ua = parser.getResult()
  }

  getDevice () {
    if (this.ua.device.type === 'mobile') {
      return 'mobile'
    } else if (this.ua.device.type === 'tablet') {
      return 'tablet'
    } else {
      return 'pc'
    }
  }

  getOs () {
    if (this.ua.os.name === 'iOS') {
      return 'ios'
    } else if (this.ua.os.name === 'Android') {
      return 'android'
    } else {
      return 'other'
    }
  }

  getBrowser () {
    return this.ua.browser.name
  }

  getIeVersion () {
    const match = navigator.userAgent.match(/(?:MSIE |Trident\/.* rv:)(\d+)/)
    return match ? parseInt(match[1]) : undefined
  }

  getIosVersion () {
    if (this.ua.os.name === 'iOS') {
      return this.ua.os.version
    } else {
      return undefined
    }
  }

  getNow () {
    return Math.floor(new Date().getTime() / 1000)
  }

  // wait for promise
  wait (delay, initial) {
    let waitObj

    if (initial) {
      waitObj = new Promise((resolve) => {
        setTimeout(resolve, delay)
      })
    } else {
      waitObj = () => {
        return new Promise((resolve) => {
          setTimeout(resolve, delay)
        })
      }
    }

    return waitObj
  }

  randomRange (min, max) {
    return Math.random() * (max - min) + min
  }

  map (value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
  }
}

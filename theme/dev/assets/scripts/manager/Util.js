'use strict';

import UAParser from 'ua-parser-js';
const parser = new UAParser();
const ua = parser.getResult();

export default class Util {
  getDevice() {
    if (ua.device.type === 'mobile') {
      return 'mobile';
    }
    else if (ua.device.type === 'tablet') {
      return 'tablet';
    }
    else {
      return 'pc';
    }
  }

  getOs() {
    if (ua.os.name === 'iOS') {
      return 'ios';
    }
    else if (ua.os.name === 'Android') {
      return 'android';
    }
    else {
      return 'other';
    }
  }

  getBrowser() {
    return ua.browser.name;
  }

  getIeVersion() {
    const match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
    return match ? parseInt(match[1]) : undefined;
  }

  getIosVersion() {
    if (ua.os.name === 'iOS') {
      return ua.os.version;
    }
    else {
      return undefined;
    }
  }

  getNow() {
    return Math.floor( new Date().getTime() / 1000 );
  }

  // Promise用wait関数
  wait(delay) {
    return new Promise((resolve, reject)=>{
      setTimeout(resolve, delay);
    });
  }
}

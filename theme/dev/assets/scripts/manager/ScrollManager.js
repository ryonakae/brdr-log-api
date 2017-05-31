'use strict';

const $ = require('jquery');

export default class ScrollManager {
  constructor(options){
    this.$window = null;

    this.resizeManager = options.resizeManager;
    this.util = options.util;

    this.scrollAmount = 0;
    this.scrollDirection = null;
    this.scrollTop = 0;
    this.scrollBottom = 0;
    this.touchStartY = 0;

    this.functions = {};
    this.fps = 60;
    this.isScrolling = false;

    this.init();
  }

  init(){
    this.$window = $(window);

    this.update();

    // pcはwheelイベント、タッチデバイスはtouchstart & touchmoveイベント
    if (this.util.getDevice() === 'pc') {
      this.$window.on('wheel', (e)=>{
        this.onScroll(e);
      });
    }
    else {
      this.$window.on('touchstart', (e)=>{
        this.onTouchstart(e);
      });
      this.$window.on('touchmove', (e)=>{
        this.onScroll(e);
      });
    }
  }

  add(name, func){
    this.functions[name] = func;
  }

  remove(name){
    delete this.functions[name];
  }

  onScroll(event){
    if (this.isScrolling) return;

    this.isScrolling = true;

    if (window.requestAnimationFrame) {
      requestAnimationFrame(()=>{
        this.update(event);
      });
    }
    else {
      setTimeout(()=>{
        this.update(event);
      }, 1000/this.fps);
    }
  }

  onTouchstart(event){
    this.touchStartY = event.originalEvent.changedTouches[0].pageY;
  }

  update(event){
    this.scrollTop = window.pageYOffset;
    this.scrollBottom = this.getScrollTop() + this.resizeManager.getWindowHeight();

    // スクロール量を設定
    // update関数の引数にeventが入ってる時だけ実行
    if (event) {
      if (this.util.getDevice() === 'pc') {
        this.scrollAmount = event.originalEvent.deltaY;
      }
      else {
        const touchMoveY = event.originalEvent.changedTouches[0].pageY;
        this.scrollAmount = this.touchStartY - touchMoveY;
      }
    }

    // スクロール方向を設定
    if (this.getAmount() > 0) {
      this.scrollDirection = 'down';
    }
    else if (this.getAmount() < 0) {
      this.scrollDirection = 'up';
    }

    // this.functionsに入っている関数をすべて実行
    if (Object.keys(this.functions).length > 0) {
      for (const func in this.functions) {
        this.functions[func]();
      }
    }

    this.isScrolling = false;
  }

  getScrollTop(){
    return this.scrollTop;
  }

  getScrollBottom(){
    return this.scrollBottom;
  }

  getAmount(){
    return this.scrollAmount;
  }

  getDirection(){
    return this.scrollDirection;
  }
}

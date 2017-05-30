export default class ResizeManager {
  constructor(){
    this.$window = null;

    this.windowHeight = 0;
    this.windowWidth = 0;
    this.functions = {};
    this.fps = 60;
    this.isResizing = false;

    this.init();
  }

  init(){
    this.$window = $(window);

    this.update();

    this.$window.on('resize.resizeManager orientationchange.resizeManager', this.onResize.bind(this));
  }

  add(name, func){
    this.functions[name] = func;
  }

  remove(name){
    delete this.functions[name];
  }

  onResize(){
    if (this.isResizing) return;

    this.isResizing = true;

    if (window.requestAnimationFrame) {
      requestAnimationFrame(this.update.bind(this));
    }
    else {
      setTimeout(this.update.bind(this), 1000/this.fps);
    }
  }

  update(){
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    if (Object.keys(this.functions).length > 0) {
      for (const func in this.functions) {
        this.functions[func]();
      }
    }

    this.isResizing = false;
  }

  getWindowWidth(){
    return this.windowWidth;
  }

  getWindowHeight(){
    return this.windowHeight;
  }
}

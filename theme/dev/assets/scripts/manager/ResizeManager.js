export default class ResizeManager {
  constructor(){
    this.windowHeight = 0;
    this.windowWidth = 0;
    this.functions = [];
    this.fps = 60;
    this.isResizing = false;

    this.init();
  }

  init(){
    this.update();

    window.addEventListener('resize', this.onResize.bind(this), false);
    window.addEventListener('orientationchange', this.onResize.bind(this), false);
  }

  add(name, func){
    this.functions[name] = func;
  }

  remove(func){
    // not working
    this.functions.splice(func, 1);
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

    console.log(this.functions['func1']);
    // for (let i = 0; i < this.functions.length; i++) {
    //   this.functions[i]();
    // }

    this.isResizing = false;
  }

  getWindowWidth(){
    return this.windowWidth;
  }

  getWindowHeight(){
    return this.windowHeight;
  }
}

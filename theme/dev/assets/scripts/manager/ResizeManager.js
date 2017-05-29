// require jQuery
export default class ResizeManager {
  constructor(){
    this.$window = null;
    this.windowHeight = 0;
    this.windowWidth = 0;
    this.functions = [];
    this.fps = 60;
    this.isRunning = false;

    this.init();
  }

  init(){
    this.$window = $(window);
    this.update();

    this.$window.on('resize orientationchange', ()=>{
      if (this.isRunning) return;

      this.isRunning = true;

      if (window.requestAnimationFrame) {
        requestAnimationFrame(this.update.bind(this));
      }
      else {
        setTimeout(this.update.bind(this), 1000/this.fps);
      }
    });
  }

  add(func){
    this.functions.push(func);
  }

  remove(func){
    // not working
    this.functions.splice(func, 1);
  }

  update(){
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    for (let i = 0; i < this.functions.length; i++) {
      let func = this.functions[i];
      func();
    }

    this.isRunning = false;
  }
}

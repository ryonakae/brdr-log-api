'use strict';

import 'es6-promise/auto';

// import and initialize manager
import Util from './manager/Util';
import ResizeManager from './manager/ResizeManager';
import ScrollManager from './manager/ScrollManager';
const util = new Util();
const resizeManager = new ResizeManager();
const scrollManager = new ScrollManager({
  resizeManager: resizeManager,
  util: util
});

// export manager
export {util, resizeManager, scrollManager};

// import vue
import Vue from 'vue';

// import App
import App from './App.vue';

// import vuex store & router
import store from './store';
import router from './router';

// create app
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
});

// Hot Module Replacementに対応させる
if (module.hot) module.hot.accept();

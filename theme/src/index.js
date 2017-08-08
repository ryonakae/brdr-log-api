'use strict'

import 'es6-promise/auto'

// import vue
import Vue from 'vue'

// import App
import App from './App.vue'

// import vuex store & router
import store from './store'
import router from './router'

// import and initialize manager
import Util from './manager/Util'
import ResizeManager from './manager/ResizeManager'
import ScrollManager from './manager/ScrollManager'

const util = new Util()
const resizeManager = new ResizeManager()
const scrollManager = new ScrollManager({
  resizeManager: resizeManager,
  util: util
})

// create vue instance
const vm = new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})

// Hot Module Replacementに対応させる
if (module.hot) module.hot.accept()

// export manager
export {util, resizeManager, scrollManager}

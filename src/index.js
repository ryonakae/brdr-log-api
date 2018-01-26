'use strict'

import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import Utils from '@/utilities/Utils'
import ResizeManager from '@/utilities/ResizeManager'
import ScrollManager from '@/utilities/ScrollManager'
import App from '@/App.vue'

// create manager instance
const utils = new Utils()
const resizeManager = new ResizeManager()
const scrollManager = new ScrollManager({
  resizeManager: resizeManager,
  utils: utils
})
utils.init()
resizeManager.init()
scrollManager.init()

// create vue instance
const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// Hot Module Replacementに対応させる
if (module.hot) module.hot.accept()

// export manager
export { utils, resizeManager, scrollManager }

'use strict'

import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import App from '@/App.vue'
import { Utils, Resizer, Scroller } from 'web-utility-js'
import viewportUnitsBuggyfill from 'viewport-units-buggyfill'

// ServiceWorkerを登録する
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(window.wpSettings.template_directory_url + '/service-worker.js', {
      scope: '/'
    })
    .then(registration => {
      registration.update()
      console.log('[Service Worker]', 'registered: ', registration)
    })
    .catch(err => {
      console.log('[Service Worker]', 'registration failed: ', err)
    })
}

// utilityのインスタンスを作り、初期化
const utils = new Utils()
const resizer = new Resizer()
const scroller = new Scroller()
utils.init()
resizer.init()
scroller.init()

// viewportUnitsBuggyfillを初期化
// resizerにrefresh()を追加
viewportUnitsBuggyfill.init()
resizer.add('refleshViewportUnits', viewportUnitsBuggyfill.refresh)

// Vueのインスタンスを作成
const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// Hot Module Replacement
if (module.hot) module.hot.accept()

// utilityをexport
export { utils, resizer, scroller }

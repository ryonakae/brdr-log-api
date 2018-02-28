'use strict'

import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import App from '@/App.vue'
import { Utils, Resizer, Scroller } from 'web-utility-js'

// registor service worker
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

// create manager instance
const utils = new Utils()
const resizer = new Resizer()
const scroller = new Scroller()
utils.init()
resizer.init()
scroller.init()

// create vue instance
const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// Hot Module Replacement
if (module.hot) module.hot.accept()

// export manager
export { utils, resizer, scroller }

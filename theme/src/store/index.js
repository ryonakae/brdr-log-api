'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import state from './state'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // development時のみ厳格モード有効
  state,
  mutations,
  actions
})

// Hot Module Replacementに対応させる
if (module.hot) {
  module.hot.accept([
    './mutations',
    './actions'
  ], () => {
    // import modules
    const newMutations = require('./mutations').default
    const newActions = require('./actions').default

    store.hotUpdate({
      mutations: newMutations,
      actions: newActions
    })
  })
}

export default store

import Vue from 'vue'
import Vuex from 'vuex'
import state from '@/store/state'
import mutations from '@/store/mutations'
import actions from '@/store/actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // development時のみ厳格モード有効
  state,
  mutations,
  actions
})

// Hot Module Replacementに対応させる
if (module.hot) {
  module.hot.accept(['@/store/mutations', '@/store/actions'], () => {
    const newMutations = require('@/store/mutations').default
    const newActions = require('@/store/actions').default

    store.hotUpdate({
      mutations: newMutations,
      actions: newActions
    })
  })
}

export default store

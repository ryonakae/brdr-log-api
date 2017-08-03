'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import {util} from '../App.vue';

Vue.use(Vuex);

const state = {
  pageTitle: '',
  siteTitle: document.title,
  siteUrl: location.protocol + '//' + location.host,
  allPostData: [],
  currentPostData: {},
  perPage: 10,
  perPageMobile: 6,
  infiniteScrollLock: false,
  loadedPostItem: 0,
  isWebfontLoaded: false,
  isLogoLoading: false,
  isFiltered: false,
  filteredCategory: '',
  isPreview: wpApiSettings.is_preview,
  nonce: wpApiSettings.nonce,
  isUserLoggedIn: wpApiSettings.is_logged_in,
};

const store = new Vuex.Store({
  // development時のみ厳格モード有効
  strict: process.env.NODE_ENV !== 'production',

  state,
  mutations,
  actions
});

// Hot Module Replacementに対応させる
if (module.hot) {
  module.hot.accept([
    './mutations',
    './actions'
  ], ()=>{
    // import modules
    const newMutations = require('./mutations').default;
    const newActions = require('./actions').default;

    store.hotUpdate({
      mutations: newMutations,
      actions: newActions
    });
  });
}

export default store;

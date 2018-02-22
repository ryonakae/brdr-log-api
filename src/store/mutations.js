'use strict'

// 同期、単一の処理
export default {
  initClient (state) {
    state.client.defaults.baseURL = state.siteUrl + '/wp-json/wp/v2'
    state.client.defaults.timeout = 10000
    state.client.defaults.headers = { 'X-WP-Nonce': window.wpSettings.nonce }
  },

  setPageTitle (state, title) {
    state.pageTitle = title

    if (title === '') {
      document.title = state.siteTitle
    } else {
      document.title = title + ' - ' + state.siteTitle
    }
  },

  setAllPosts (state, data) {
    state.allPosts = data
  },

  setCurrentPost (state, data) {
    state.currentPost = data
  },

  incrementLoadedPost (state) {
    state.loadedPost++
  },

  resetLoadedPost (state) {
    state.loadedPost = 0
  },

  changeIsFontLoaded (state, boolean) {
    state.isFontLoaded = boolean
  },

  changeIsLoading (state, boolean) {
    state.isLoading = boolean
  },

  changeIsFiltered (state, boolean) {
    state.isFiltered = boolean
  }
}

// 同期、単一の処理
export default {
  initClient (state) {
    state.client.defaults.baseURL = state.siteUrl + '/wp-json/wp/v2'
    state.client.defaults.timeout = 10000
    state.client.defaults.headers = { 'X-WP-Nonce': window.wpSettings.nonce }
  },

  setPageTitle (state, title) {
    state.pageTitle = title
    document.title =
      title === '' ? state.siteTitle : title + ' - ' + state.siteTitle
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

  setTitleOffset (state, offset) {
    state.titleOffset = offset
  },

  changeIsFontLoaded (state, boolean) {
    state.isFontLoaded = boolean
  },

  changeIsLoading (state, boolean) {
    state.isLoading = boolean
  },

  setCategoryId (state, id) {
    state.categoryId = id
  },

  setCategoryName (state, name) {
    state.categoryName = name
  }
}

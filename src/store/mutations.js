'use strict'

// 同期、単一の処理
export default {
  setPageTitle (state, title) {
    state.pageTitle = title
  },

  setAllPosts (state, data) {
    state.allPosts = data
  },

  setCurrentPost (state, data) {
    state.currentPost = data
  },

  incrementLoadedPost (state, reset) {
    if (reset) {
      state.loadedPost = 0
    } else {
      state.loadedPost++
    }
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

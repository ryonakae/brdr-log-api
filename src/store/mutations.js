'use strict'

// 同期、単一の処理
export default {
  SET_PAGE_TITLE (state, title) {
    state.pageTitle = title
  },

  SET_ALL_POST_DATA (state, data) {
    state.allPostData = data
  },

  SET_CURRENT_POST_DATA (state, data) {
    state.currentPostData = data
  },

  SET_PER_PAGE (state, count) {
    state.perPage = count
  },

  INCREMENT_LOADED_POST_COUNT (state) {
    state.loadedPostCount++
  },

  RESET_LOADED_POST_COUNT (state) {
    state.loadedPostCount = 0
  },

  CHANGE_INFINITE_SCROLL_LOCK (state, boolean) {
    state.infiniteScrollLock = boolean
  },

  CHANGE_IS_WEBFONT_LOADED (state, boolean) {
    state.isWebfontLoaded = boolean
  },

  CHANGE_IS_LOADING (state, boolean) {
    state.isLoading = boolean
  },

  CHANGE_IS_NOT_FOUND (state, boolean) {
    state.isNotFound = boolean
  },

  CHANGE_IS_FILTERED (state, boolean) {
    state.isFiltered = boolean
  },

  SET_FILTERED_CATEGORY (state, categoryName) {
    state.filteredCategory = categoryName
  }
}

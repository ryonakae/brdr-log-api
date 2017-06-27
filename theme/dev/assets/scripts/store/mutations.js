'use strict';

// 同期、単一の処理
export default {
  SET_PAGE_TITLE(state, title) {
    state.pageTitle = title;
  },

  SET_ALL_POST_DATA(state, data) {
    state.allPostData = data;
  },

  SET_CURRENT_POST_DATA(state, data) {
    state.currentPostData = data;
  },

  SET_PER_PAGE(state, count) {
    state.perPage = count;
  },

  CHANGE_INFINITE_SCROLL_LOCK(state, boolean) {
    state.infiniteScrollLock = boolean;
  },

  INCREMENT_LOADED_POST_ITEM(state) {
    state.loadedPostItem++;
  },

  RESET_LOADED_POST_ITEM(state) {
    state.loadedPostItem = 0;
  },

  CHANGE_IS_WEBFONT_LOADED(state, boolean) {
    state.isWebfontLoaded = boolean;
  },

  CHANGE_IS_LOGO_LOADING(state, boolean) {
    state.isLogoLoading = boolean;
  },

  CHANGE_IS_FILTERED(state, boolean) {
    state.isFiltered = boolean;
  }
};

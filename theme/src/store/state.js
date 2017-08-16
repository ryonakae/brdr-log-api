'use strict'

export default {
  pageTitle: '',
  siteTitle: document.title,
  siteUrl: location.protocol + '//' + location.host,
  allPostData: [],
  currentPostData: {},
  perPage: 10,
  perPageMobile: 6,
  infiniteScrollLock: false,
  loadedPostItem: 0,
  isLogoLoading: false,
  isFiltered: false,
  filteredCategory: '',
  isPreview: window.wpApiSettings.is_preview,
  nonce: window.wpApiSettings.nonce,
  isUserLoggedIn: window.wpApiSettings.is_logged_in,
  client: null // axios client
}

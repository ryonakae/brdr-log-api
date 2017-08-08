'use strict';

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
  isWebfontLoaded: false,
  isLogoLoading: false,
  isFiltered: false,
  filteredCategory: '',
  isPreview: wpApiSettings.is_preview,
  nonce: wpApiSettings.nonce,
  isUserLoggedIn: wpApiSettings.is_logged_in,
  client: null // axios client
};

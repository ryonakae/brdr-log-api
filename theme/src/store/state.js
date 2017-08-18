'use strict'

import axios from 'axios'

export default {
  pageTitle: '',
  siteTitle: document.title,
  siteUrl: location.protocol + '//' + location.host,
  allPostData: [],
  currentPostData: {},
  perPage: 10,
  perPageMobile: 6,
  loadedPostItem: 0,
  infiniteScrollLock: false,
  isLoadedFirst: false,
  isLogoLoading: true,
  isFiltered: false,
  filteredCategory: '',
  client: axios.create(),
  isPreview: window.wpApiSettings.is_preview,
  nonce: window.wpApiSettings.nonce,
  isUserLoggedIn: window.wpApiSettings.is_logged_in
}

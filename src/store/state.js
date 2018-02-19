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
  loadedPostCount: 0,
  infiniteScrollLock: false,
  isWebfontLoaded: false,
  isNotFound: false,
  isLoading: true,
  isFiltered: false,
  filteredCategory: '',
  client: axios.create(),
  isPreview: window.wpSettings.is_preview,
  nonce: window.wpSettings.nonce,
  isUserLoggedIn: window.wpSettings.is_logged_in
}

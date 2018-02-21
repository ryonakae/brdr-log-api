'use strict'

import axios from 'axios'

export default {
  client: axios.create(),
  pageTitle: '',
  siteTitle: document.title,
  siteUrl: location.protocol + '//' + location.host,
  perPage: 3,
  loadedPost: 0,
  infiniteScrollLock: false,
  isFontLoaded: false,
  isLoading: true,
  isFiltered: false,
  filteredCategoryName: '',
  isPreview: window.wpSettings.is_preview,
  nonce: window.wpSettings.nonce,
  isUserLoggedIn: window.wpSettings.is_logged_in
}

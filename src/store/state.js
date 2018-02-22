import axios from 'axios'

export default {
  client: axios.create(),
  pageTitle: '',
  siteTitle: document.title,
  siteUrl: location.protocol + '//' + location.host,
  perPage: 3,
  loadedPost: 0,
  allPosts: [],
  currentPost: {},
  isLoading: true,
  isFontLoaded: false,
  isFiltered: false,
  categoryId: 0,
  categoryName: ''
}

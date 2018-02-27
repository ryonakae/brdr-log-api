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
  titleOffset: 0,
  isLoading: true,
  isFontLoaded: false,
  categoryId: 0,
  categoryName: ''
}

'use strict'

import { utils, scrollManager } from '@/index'
import router from '@/router'

// 非同期、複数のmutationsを組み合わせた処理
export default {
  changeTitle ({ commit, state }, title) {
    return new Promise(resolve => {
      // pageTitleを変更
      commit('SET_PAGE_TITLE', title)

      // document.titleも変更
      // 引数が「''」ならサイトタイトルだけにする
      if (title === '') {
        document.title = state.siteTitle
      } else {
        document.title = title + ' - ' + state.siteTitle
      }

      resolve()
    })
  },

  setAllPost ({ commit }, data) {
    return new Promise(resolve => {
      commit('SET_ALL_POST_DATA', data)
      resolve()
    })
  },

  // currentPostDataにpostオブジェクトをセット
  setCurrentPost ({ commit }, data) {
    return new Promise(resolve => {
      commit('SET_CURRENT_POST_DATA', data)
      resolve()
    })
  },

  clearCurrentPost ({ commit }) {
    return new Promise(resolve => {
      commit('SET_CURRENT_POST_DATA', {})
      resolve()
    })
  },

  changeLoadedPostCount ({ commit }, arg) {
    return new Promise(resolve => {
      if (arg === 'increment') {
        commit('INCREMENT_LOADED_POST_COUNT')
      } else if (arg === 'reset') {
        commit('RESET_LOADED_POST_COUNT')
      }

      resolve()
    })
  },

  onNotFound ({ dispatch, commit }, options) {
    return new Promise(resolve => {
      commit('CHANGE_IS_NOT_FOUND', true)
      dispatch('changeTitle', 'Page Not Found')
      dispatch('loading', { status: 'end', wait: 300 })
      resolve()
    })
  },

  // logoのloading
  loading ({ commit, state }, options) {
    return new Promise(resolve => {
      utils.wait(options.wait, true).then(() => {
        if (options.status === 'start') {
          commit('CHANGE_IS_LOADING', true)
        } else if (options.status === 'end') {
          commit('CHANGE_IS_LOADING', false)
        }
        resolve()
      })
    })
  },

  // axiosのクライアントをセットアップ
  initClient ({ state }) {
    return new Promise(resolve => {
      state.client.defaults.baseURL = state.siteUrl + '/wp-json/wp/v2'
      state.client.defaults.timeout = 10000
      state.client.defaults.headers = { 'X-WP-Nonce': state.nonce }
      resolve()
    })
  },

  // 記事一覧を取得
  getAllPosts ({ state }, options) {
    return new Promise((resolve, reject) => {
      const _queryOptions = { _embed: '' }
      if (state.isUserLoggedIn) _queryOptions.status = 'any'
      const queryOptions = Object.assign(_queryOptions, options)

      state.client
        .get('/posts', { params: queryOptions })
        .then(res => {
          console.log('[Axios]', res.data)
          // res.bodyが空(これ以上記事ない)ときはrejectを返す
          res.data.length > 0
            ? resolve(res.data)
            : reject(new Error('error on getAllPosts'))
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    })
  },

  // スクロールでさらに記事一覧を取得
  infiniteScroll ({ dispatch, commit, state }, options) {
    return new Promise((resolve, reject) => {
      console.log('fire infiniteScroll')
      const documentHeight = document.body.clientHeight

      // スクロールが7割位になったら次のポストロード
      if (scrollManager.scrollBottom > documentHeight * 0.7) {
        if (state.infiniteScrollLock) return

        commit('CHANGE_INFINITE_SCROLL_LOCK', true)

        // ローディング開始
        dispatch('loading', { status: 'start', wait: 0 })

        // getAllPostsする（optionsはそのまま渡す）
        dispatch('getAllPosts', options)
          .then(result => {
            // 現在のallPostDataとresultを結合する
            const newData = state.allPostData.concat(result)
            console.log('infiniteScroll', newData)
            // 結合した配列をallPostDataにセット
            return dispatch('setAllPost', newData)
          })
          .then(() => {
            commit('CHANGE_INFINITE_SCROLL_LOCK', false)
            resolve()
          })
          .catch(err => {
            // エラーか、これ以上投稿ないとき
            console.log('error or nomore posts', err)
            commit('CHANGE_INFINITE_SCROLL_LOCK', true)

            // ローディング終了
            dispatch('loading', { status: 'end', wait: 300 })

            reject(new Error('error on infiniteScroll: ' + err))
          })
      }
    })
  },

  // 記事一覧を作成
  // getAllPosts→setAllPost→infiniteScroll
  createIndex ({ dispatch, commit, state }, options) {
    return new Promise(resolve => {
      // infiniteScrollをリセット
      scrollManager.remove('index.infiniteScroll')
      commit('CHANGE_INFINITE_SCROLL_LOCK', false)

      // getAllPostsする→setAllPostする→infiniteScroll開始
      dispatch('getAllPosts', options)
        .then(result => {
          dispatch('setAllPost', result)
        })
        .then(() => {
          // infiniteScroll
          scrollManager.add('index.infiniteScroll', () => {
            // getAllPostsのoptionに、offsetの値をmergeして、infiniteScroll actionを実行
            const infiniteScrollOptions = Object.assign(options, {
              offset: state.allPostData.length
            })
            dispatch('infiniteScroll', infiniteScrollOptions)
          })

          resolve()
        })
    })
  },

  // 単一の投稿を取得
  getPost ({ state }, id) {
    return new Promise((resolve, reject) => {
      const queryOptions = { _embed: '' }

      state.client
        .get('/posts/' + id, { params: queryOptions })
        .then(res => {
          console.log(res)
          resolve(res.data)
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    })
  },

  // 投稿のリビジョンを取得
  getPostRevisions ({ state }, id) {
    return new Promise((resolve, reject) => {
      state.client
        .get('/posts/' + id + '/revisions')
        .then(res => {
          // console.log(res)
          resolve(res.data[0])
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    })
  },

  // 固定ページを取得
  getPage ({ state }, slug) {
    return new Promise((resolve, reject) => {
      const queryOptions = {
        _embed: '',
        slug: slug
      }

      state.client
        .get('/pages', { params: queryOptions })
        .then(res => {
          console.log(res)
          res.data.length > 0
            ? resolve(res.data[0])
            : reject(new Error('error on getPage'))
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    })
  },

  // カテゴリidからカテゴリの名前を取得
  // resolveの引数にカテゴリ情報を入れて、thenに渡す
  getCategoryName ({ state }, id) {
    return new Promise((resolve, reject) => {
      state.client
        .get('/categories/' + id)
        .then(res => {
          // console.log(res)
          resolve(res.data)
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    })
  },

  // すべてのカテゴリの名前を取得
  getAllCategoryName ({ dispatch }, categories) {
    return new Promise((resolve, reject) => {
      const _categories = []

      categories.forEach((categoryId, index) => {
        dispatch('getCategoryName', categoryId)
          .then(result => {
            // 管理画面で追加した順番にカテゴリを配列に追加
            _categories.splice(index, 0, result)

            // ループの最後
            if (categories.length === index + 1) {
              // console.log(_categories)
              resolve(_categories)
            }
          })
          .catch(err => {
            console.error(err)
            reject(err)
          })
      })
    })
  },

  // カテゴリで絞り込む
  filterByCategory ({ dispatch, commit, state }, options) {
    return new Promise(resolve => {
      // ローディング開始
      dispatch('loading', { status: 'start', wait: 0 })

      // createIndexのオプションを作成
      // categoryIdが'reset'なら全記事取得
      let indexOptions = {
        per_page: state.perPage,
        offset: 0,
        categories: options.categoryId
      }

      if (options.categoryId === 'reset') {
        indexOptions = {
          per_page: state.perPage,
          offset: 0
        }
      }

      // カテゴリの名前をセット
      if (options.categoryName) {
        commit('SET_FILTERED_CATEGORY', options.categoryName)
      }

      // カテゴリで絞り込み
      dispatch('createIndex', indexOptions).then(() => {
        // transitionがtrueならindexに遷移
        if (options.transition) {
          router.push('/')
        }

        // 一番上にスクロール
        window.scrollTo(0, 0)

        // categoryIdが'reset'ならisFilteredをfalseに
        // それ以外ならtrueに
        if (options.categoryId === 'reset') {
          commit('CHANGE_IS_FILTERED', false)
        } else {
          commit('CHANGE_IS_FILTERED', true)
        }

        // ローディング終了
        dispatch('loading', { status: 'end', wait: 300 })

        resolve()
      })
    })
  }
}

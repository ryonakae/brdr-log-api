'use strict'

import { utils, scrollManager } from '@/index'
import router from '@/router'

// 非同期、複数のmutationsを組み合わせた処理
export default {
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
  async filter ({ dispatch, commit, state }, options) {
    console.log('[action - filter]')
    // return new Promise(resolve => {
    //   // ローディング開始
    //   dispatch('loading', { status: 'start', wait: 0 })
    //
    //   // createIndexのオプションを作成
    //   // categoryIdが'reset'なら全記事取得
    //   let indexOptions = {
    //     per_page: state.perPage,
    //     offset: 0,
    //     categories: options.categoryId
    //   }
    //
    //   if (options.categoryId === 'reset') {
    //     indexOptions = {
    //       per_page: state.perPage,
    //       offset: 0
    //     }
    //   }
    //
    //   // カテゴリの名前をセット
    //   if (options.categoryName) {
    //     commit('SET_FILTERED_CATEGORY', options.categoryName)
    //   }
    //
    //   // カテゴリで絞り込み
    //   dispatch('createIndex', indexOptions).then(() => {
    //     // transitionがtrueならindexに遷移
    //     if (options.transition) {
    //       router.push('/')
    //     }
    //
    //     // 一番上にスクロール
    //     window.scrollTo(0, 0)
    //
    //     // categoryIdが'reset'ならisFilteredをfalseに
    //     // それ以外ならtrueに
    //     if (options.categoryId === 'reset') {
    //       commit('CHANGE_IS_FILTERED', false)
    //     } else {
    //       commit('CHANGE_IS_FILTERED', true)
    //     }
    //
    //     // ローディング終了
    //     dispatch('loading', { status: 'end', wait: 300 })
    //
    //     resolve()
    //   })
    // })
  }
}

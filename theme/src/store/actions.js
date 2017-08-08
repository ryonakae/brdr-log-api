'use strict';

import axios from 'axios';
import {util, scrollManager} from '../';
import router from '../router';

// axiosのインスタンスの設定
const client = axios.create();
export {client};

// 非同期、複数のmutationsを組み合わせた処理
export default {
  changeTitle({commit, state}, title) {
    return new Promise((resolve, reject)=>{
      // pageTitleを変更
      commit('SET_PAGE_TITLE', title);

      // document.titleも変更
      // 引数が「''」ならサイトタイトルだけにする
      if (title === '') {
        document.title = state.siteTitle;
      }
      else {
        document.title = title + ' - ' + state.siteTitle;
      }

      util.wait(10).then(resolve);
    });
  },

  changePerPage({commit}, count) {
    return new Promise((resolve, reject)=>{
      commit('SET_PER_PAGE', count);
      util.wait(10).then(resolve);
    });
  },

  setAllPost({commit}, data) {
    return new Promise((resolve, reject)=>{
      commit('SET_ALL_POST_DATA', data);
      util.wait(10).then(resolve);
    });
  },

  // currentPostDataにpostオブジェクトをセット
  setCurrentPost({commit}, data) {
    return new Promise((resolve, reject)=>{
      commit('SET_CURRENT_POST_DATA', data);
      util.wait(10).then(resolve);
    });
  },

  clearCurrentPost({commit}) {
    return new Promise((resolve, reject)=>{
      commit('SET_CURRENT_POST_DATA', {});
      util.wait(10).then(resolve);
    });
  },

  changeLoadedPostItem({commit}, arg) {
    return new Promise((resolve, reject)=>{
      if (arg === 'increment') {
        commit('INCREMENT_LOADED_POST_ITEM');
      }
      else if (arg === 'reset') {
        commit('RESET_LOADED_POST_ITEM');
      }

      util.wait(10).then(resolve);
    });
  },

  // axiosのクライアントをセットアップ
  initClient({state}) {
    client.defaults.baseURL = state.siteUrl + '/wp-json/wp/v2';
    client.defaults.timeout = 10000;
    client.defaults.headers = {'X-WP-Nonce': state.nonce};
  },

  // 記事一覧を取得
  getAllPosts({state}, options) {
    return new Promise((resolve, reject)=>{
      const _queryOptions = {_embed: null};
      if (state.isUserLoggedIn) _queryOptions.status = 'any';
      const queryOptions = Object.assign(_queryOptions, options);

      client.get('/posts', {params: queryOptions})
        .then((res)=>{
          console.log(res);
          // res.bodyが空(これ以上記事ない)ときはrejectを返す
          res.data.length > 0 ? resolve(res.data) : reject();
        })
        .catch((err)=>{
          console.log(err);
          reject(err);
        });
    });
  },

  // スクロールでさらに記事一覧を取得
  infiniteScroll({dispatch, commit, state}, options) {
    console.log('fire infiniteScroll');
    const documentHeight = document.body.clientHeight;

    // スクロールが7割位になったら次のポストロード
    if (scrollManager.scrollBottom > documentHeight * 0.7) {
      if (state.infiniteScrollLock) return;

      commit('CHANGE_INFINITE_SCROLL_LOCK', true);

      // logoをローディング中にする
      dispatch('logoLoading', {boolean:true, wait:0});

      // getAllPostsする（optionsはそのまま渡す）
      dispatch('getAllPosts', options)
        .then((result)=>{
          // 現在のallPostDataとresultを結合する
          const newData = state.allPostData.concat(result);
          console.log('infiniteScroll', newData);
          // 結合した配列をallPostDataにセット
          return dispatch('setAllPost', newData);
        })
        .then(()=>{
          commit('CHANGE_INFINITE_SCROLL_LOCK', false);
        })
        .catch((err)=>{
          // エラーか、これ以上投稿ないとき
          console.log('error or nomore posts', err);
          commit('CHANGE_INFINITE_SCROLL_LOCK', true);

          // logoのローディング終了
          dispatch('logoLoading', {boolean:false, wait:300});
        });
    }
  },

  // 記事一覧を作成
  // getAllPosts→setAllPost→infiniteScroll
  createIndex({dispatch, commit, state}, options) {
    return new Promise((resolve, reject)=>{
      // infiniteScrollをリセット
      scrollManager.remove('index.infiniteScroll');
      commit('CHANGE_INFINITE_SCROLL_LOCK', false);

      // getAllPostsする→setAllPostする→infiniteScroll開始
      dispatch('getAllPosts', options)
        .then((result)=>{
          dispatch('setAllPost', result);
        })
        .then(()=>{
          // infiniteScroll
          scrollManager.add('index.infiniteScroll', ()=>{
            // getAllPostsのoptionに、offsetの値をmergeして、infiniteScroll actionを実行
            const infiniteScrollOptions = Object.assign(options, {offset:state.allPostData.length});
            dispatch('infiniteScroll', infiniteScrollOptions);
          });

          resolve();
        });
    });
  },

  // 単一の投稿を取得
  getPost({state}, id) {
    return new Promise((resolve, reject)=>{
      const queryOptions = {
        _embed: null
      };

      client.get('/posts/' + id, {params: queryOptions})
        .then((res)=>{
          console.log(res);
          resolve(res.data);
        })
        .catch((err)=>{
          console.log(err);
          reject(err);
        });
    });
  },

  // 投稿のリビジョンを取得
  getPostRevisions({state}, id) {
    return new Promise((resolve, reject)=>{
      client.get('/posts/' + id + '/revisions')
        .then((res)=>{
          console.log(res);
          resolve(res.data[0]);
        })
        .catch((err)=>{
          console.log(err);
          reject(err);
        });
    });
  },

  // 固定ページを取得
  getPage({state}, slug) {
    return new Promise((resolve, reject)=>{
      const queryOptions = {
        _embed: null,
        slug: slug
      };

      client.get('/pages', {params: queryOptions})
        .then((res)=>{
          console.log(res);
          res.data.length > 0 ? resolve(res.data[0]) : reject();
        })
        .catch((err)=>{
          console.log(err);
          reject(err);
        });
    });
  },

  // カテゴリidからカテゴリの名前を取得
  // resolveの引数にカテゴリ情報を入れて、thenに渡す
  getCategoryName({state}, id) {
    return new Promise((resolve, reject)=>{
      const getUrl = state.siteUrl + '/wp-json/wp/v2/categories/' + id;

      client.get('/categories/' + id)
        .then((res)=>{
          console.log(res);
          resolve(res.data);
        })
        .catch((err)=>{
          console.log(err);
          reject(err);
        });
    });
  },

  // すべてのカテゴリの名前を取得
  getAllCategoryName({dispatch}, categories) {
    return new Promise((resolve, reject)=>{
      const _categories = [];

      categories.forEach((categoryId, index)=>{
        dispatch('getCategoryName', categoryId)
          .then((result)=>{
            // 管理画面で追加した順番にカテゴリを配列に追加
            _categories.splice(index, 0, result);

            // ループの最後
            if (categories.length === index+1) {
              console.log(_categories);
              util.wait(10).then(resolve(_categories));
            }
          })
          .catch((err)=>{
            console.log(err);
          });
      });
    });
  },

  // カテゴリで絞り込む
  filterByCategory({dispatch, commit, state}, options) {
    return new Promise((resolve, reject)=>{
      // logoのローディング開始
      dispatch('logoLoading', {boolean:true, wait:0});

      // createIndexのオプションを作成
      // categoryIdが'reset'なら全記事取得
      let indexOptions = {
        per_page: state.perPage,
        offset: 0,
        categories: options.categoryId
      };

      if (options.categoryId === 'reset') {
        indexOptions = {
          per_page: state.perPage,
          offset: 0
        };
      }

      // カテゴリの名前をセット
      if (options.categoryName) {
        commit('SET_FILTERED_CATEGORY', options.categoryName);
      }

      // カテゴリで絞り込み
      dispatch('createIndex', indexOptions)
        .then(()=>{
          // transitionがtrueならindexに遷移
          if (options.transition) {
            router.push('/');
          }

          // 一番上にスクロール
          window.scrollTo(0,0);

          // categoryIdが'reset'ならisFilteredをfalseに
          // それ以外ならtrueに
          if (options.categoryId === 'reset') {
            commit('CHANGE_IS_FILTERED', false);
          }
          else {
            commit('CHANGE_IS_FILTERED', true);
          }

          // logoのローディング終了
          dispatch('logoLoading', {boolean:false, wait:300});

          resolve();
        });
    });
  },

  // logoのloading
  logoLoading({commit, state}, options) {
    return new Promise((resolve, reject)=>{
      util.wait(options.wait)
        .then(()=>{
          commit('CHANGE_IS_LOGO_LOADING', options.boolean);
          console.log('isLogoLoading', state.isLogoLoading);
          resolve();
        });
    });
  }
};

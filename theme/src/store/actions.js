'use strict';

import superagent from 'superagent';
import {util, scrollManager} from '../';
import router from '../router';

// 非同期、複数のmutationsを組み合わせた処理
export default {
  changeTitle(context, title) {
    return new Promise((resolve, reject)=>{
      // pageTitleを変更
      context.commit('SET_PAGE_TITLE', title);

      // document.titleも変更
      // 引数が「''」ならサイトタイトルだけにする
      if (title === '') {
        document.title = context.state.siteTitle;
      }
      else {
        document.title = title + ' - ' + context.state.siteTitle;
      }

      util.wait(10).then(resolve);
    });
  },

  changePerPage(context, count) {
    return new Promise((resolve, reject)=>{
      context.commit('SET_PER_PAGE', count);
      util.wait(10).then(resolve);
    });
  },

  setAllPost(context, data) {
    return new Promise((resolve, reject)=>{
      context.commit('SET_ALL_POST_DATA', data);
      util.wait(10).then(resolve);
    });
  },

  // currentPostDataにpostオブジェクトをセット
  setCurrentPost(context, data) {
    return new Promise((resolve, reject)=>{
      context.commit('SET_CURRENT_POST_DATA', data);
      util.wait(10).then(resolve);
    });
  },

  clearCurrentPost(context) {
    return new Promise((resolve, reject)=>{
      context.commit('SET_CURRENT_POST_DATA', {});
      util.wait(10).then(resolve);
    });
  },

  changeLoadedPostItem(context, arg) {
    return new Promise((resolve, reject)=>{
      if (arg === 'increment') {
        context.commit('INCREMENT_LOADED_POST_ITEM');
      }
      else if (arg === 'reset') {
        context.commit('RESET_LOADED_POST_ITEM');
      }

      util.wait(10).then(resolve);
    });
  },

  // 記事一覧を取得
  getAllPosts(context, options) {
    return new Promise((resolve, reject)=>{
      const getUrl = context.state.siteUrl + '/wp-json/wp/v2/posts';

      const _queryOptions = {
        _embed: null
      };
      if (context.state.isUserLoggedIn) _queryOptions.status = 'any';

      const queryOptions = Object.assign(_queryOptions, options);

      superagent
        .get(getUrl)
        .query(queryOptions)
        .set('X-WP-Nonce', context.state.nonce)
        .timeout({
          response: 10000,
          deadline: 60000
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          else {
            console.log(res.body);
            // res.bodyが空(これ以上記事ない)ときはrejectを返す
            if (res.body.length === 0) {
              reject();
            }
            else {
              resolve(res.body);
            }
          }
        });
    });
  },

  // スクロールでさらに記事一覧を取得
  infiniteScroll(context, options) {
    console.log('fire infiniteScroll');
    const documentHeight = document.body.clientHeight;

    // スクロールが7割位になったら次のポストロード
    if (scrollManager.scrollBottom > documentHeight * 0.7) {
      if (context.state.infiniteScrollLock) return;

      context.commit('CHANGE_INFINITE_SCROLL_LOCK', true);

      // logoをローディング中にする
      context.dispatch('logoLoading', {boolean:true, wait:0});

      // getAllPostsする（optionsはそのまま渡す）
      context.dispatch('getAllPosts', options)
        .then((result)=>{
          // 現在のallPostDataとresultを結合する
          const newData = context.state.allPostData.concat(result);
          console.log('infiniteScroll', newData);
          // 結合した配列をallPostDataにセット
          return context.dispatch('setAllPost', newData);
        })
        .then(()=>{
          context.commit('CHANGE_INFINITE_SCROLL_LOCK', false);
        })
        .catch((err)=>{
          // エラーか、これ以上投稿ないとき
          console.log('error or nomore posts', err);
          context.commit('CHANGE_INFINITE_SCROLL_LOCK', true);

          // logoのローディング終了
          context.dispatch('logoLoading', {boolean:false, wait:300});
        });
    }
  },

  // 記事一覧を作成
  // getAllPosts→setAllPost→infiniteScroll
  createIndex(context, options) {
    return new Promise((resolve, reject)=>{
      // infiniteScrollをリセット
      scrollManager.remove('index.infiniteScroll');
      context.commit('CHANGE_INFINITE_SCROLL_LOCK', false);

      // getAllPostsする→setAllPostする→infiniteScroll開始
      context.dispatch('getAllPosts', options)
        .then((result)=>{
          context.dispatch('setAllPost', result);
        })
        .then(()=>{
          // infiniteScroll
          scrollManager.add('index.infiniteScroll', ()=>{
            // getAllPostsのoptionに、offsetの値をmergeして、infiniteScroll actionを実行
            const infiniteScrollOptions = Object.assign(options, {offset:context.state.allPostData.length});
            context.dispatch('infiniteScroll', infiniteScrollOptions);
          });

          resolve();
        });
    });
  },

  // 単一の投稿を取得
  getPost(context, id) {
    return new Promise((resolve, reject)=>{
      const getUrl = context.state.siteUrl + '/wp-json/wp/v2/posts/' + id;
      const queryOptions = {
        _embed: null
      };

      superagent
        .get(getUrl)
        .query(queryOptions)
        .set('X-WP-Nonce', context.state.nonce)
        .timeout({
          response: 10000,
          deadline: 60000
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          else {
            console.log(res.body);
            resolve(res.body);
          }
        });
    });
  },

  // 投稿のリビジョンを取得
  getPostRevisions(context, id) {
    return new Promise((resolve, reject)=>{
      const getUrl = context.state.siteUrl + '/wp-json/wp/v2/posts/' + id + '/revisions';

      superagent
        .get(getUrl)
        .set('X-WP-Nonce', context.state.nonce)
        .timeout({
          response: 10000,
          deadline: 60000
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          else {
            console.log(res.body[0]);
            resolve(res.body[0]);
          }
        });
    });
  },

  // 固定ページを取得
  getPage(context, slug) {
    return new Promise((resolve, reject)=>{
      const getUrl = context.state.siteUrl + '/wp-json/wp/v2/pages';
      const queryOptions = {
        _embed: null,
        slug: slug
      };

      superagent
        .get(getUrl)
        .query(queryOptions)
        .set('X-WP-Nonce', context.state.nonce)
        .timeout({
          response: 10000,
          deadline: 60000
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          else if (res.body.length === 0) {
            reject();
          }
          else {
            console.log(res);
            resolve(res.body[0]);
          }
        });
    });
  },

  // カテゴリidからカテゴリの名前を取得
  // resolveの引数にカテゴリ情報を入れて、thenに渡す
  getCategoryName(context, id) {
    return new Promise((resolve, reject)=>{
      const getUrl = context.state.siteUrl + '/wp-json/wp/v2/categories/' + id;

      superagent
        .get(getUrl)
        .timeout({
          response: 10000,
          deadline: 60000
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          else {
            resolve(res.body);
          }
        });
    });
  },

  // すべてのカテゴリの名前を取得
  getAllCategoryName(context, categories) {
    return new Promise((resolve, reject)=>{
      const _categories = [];

      categories.forEach((categoryId, index)=>{
        context.dispatch('getCategoryName', categoryId)
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
  filterByCategory(context, options) {
    return new Promise((resolve, reject)=>{
      // logoのローディング開始
      context.dispatch('logoLoading', {boolean:true, wait:0});

      // createIndexのオプションを作成
      // categoryIdが'reset'なら全記事取得
      let indexOptions = {
        per_page: context.state.perPage,
        offset: 0,
        categories: options.categoryId
      };

      if (options.categoryId === 'reset') {
        indexOptions = {
          per_page: context.state.perPage,
          offset: 0
        };
      }

      // カテゴリの名前をセット
      if (options.categoryName) {
        context.commit('SET_FILTERED_CATEGORY', options.categoryName);
      }

      // カテゴリで絞り込み
      context.dispatch('createIndex', indexOptions)
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
            context.commit('CHANGE_IS_FILTERED', false);
          }
          else {
            context.commit('CHANGE_IS_FILTERED', true);
          }

          // logoのローディング終了
          context.dispatch('logoLoading', {boolean:false, wait:300});

          resolve();
        });
    });
  },

  // logoのloading
  logoLoading(context, options) {
    return new Promise((resolve, reject)=>{
      util.wait(options.wait)
        .then(()=>{
          context.commit('CHANGE_IS_LOGO_LOADING', options.boolean);
          console.log('isLogoLoading', context.state.isLogoLoading);
          resolve();
        });
    });
  }
};

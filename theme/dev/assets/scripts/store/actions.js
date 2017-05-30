import superagent from 'superagent';
import {router} from '../app';

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

      setTimeout(resolve, 10);
    });
  },

  changePerPage(context, count) {
    return new Promise((resolve, reject)=>{
      context.commit('SET_PER_PAGE', count);
      setTimeout(resolve, 10);
    });
  },

  // 記事一覧を取得
  getAllPosts(context, options) {
    return new Promise((resolve, reject)=>{
      const getUrl = context.state.siteUrl + '/wp-json/wp/v2/posts';
      const queryOptions = Object.assign({_embed: null}, options);

      superagent
        .get(getUrl)
        .query(queryOptions)
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
    const documentHeight = $(document).height();

    // スクロールが7割位になったら次のポストロード
    if (options.scrollManager.scrollBottom > documentHeight * 0.7) {
      if (context.state.infiniteScrollLock) return;

      context.commit('CHANGE_INFINITE_SCROLL_LOCK', true);

      context.dispatch('getAllPosts', {per_page:context.state.perPage, offset:context.state.allPostData.length})
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
          context.commit('CHANGE_INFINITE_SCROLL_LOCK', true);
        });
    }
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
        .timeout({
          response: 10000,
          deadline: 60000
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log(res.body);
            resolve(res.body);
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
        .timeout({
          response: 10000,
          deadline: 60000
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log(res.body[0]);
            resolve(res.body[0]);
          }
        });
    });
  },

  // タグidからタグの名前を取得
  // resolveの引数にタグ情報を入れて、thenに渡す
  getTagName(context, id) {
    return new Promise((resolve, reject)=>{
      const getUrl = context.state.siteUrl + '/wp-json/wp/v2/tags/' + id;

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
            console.log(res.body);
            resolve(res.body);
          }
        });
    });
  },

  setAllPost(context, data) {
    return new Promise((resolve, reject)=>{
      context.commit('SET_ALL_POST_DATA', data);
      setTimeout(resolve, 10);
    });
  },

  // currentPostDataにpostオブジェクトをセット
  setCurrentPost(context, data) {
    return new Promise((resolve, reject)=>{
      context.commit('SET_CURRENT_POST_DATA', data);
      setTimeout(resolve, 10);
    });
  },

  clearCurrentPost(context) {
    return new Promise((resolve, reject)=>{
      context.commit('SET_CURRENT_POST_DATA', {});
      setTimeout(resolve, 10);
    });
  },

  backByEsc(context, from) {
    $(document).on('keyup.backByEsc', (e)=>{
      if (e.keyCode === 27) {
        router.push(from.path);
        $(document).off('.backByEsc');
      }
    });
  }
};

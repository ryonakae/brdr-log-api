<template>
  <div :class="$style.page" ref="page">
    <ul v-if="hasPosts">
      <li v-for="post in posts" :key="post.id" :class="$style.item" @mouseenter="setCurrentPost(post)" @mouseleave="clearCurrentPost" @touchstart="setCurrentPost(post)" @touchend="clearCurrentPost">
        <post-item-component :post="post"></post-item-component>
      </li>
    </ul>
  </div>
</template>

<script>
const $ = require('jquery');
import PostItemComponent from '../components/PostItem.vue';
import {scrollManager} from '../app';
import {util} from '../app';

export default {
  components: {
    PostItemComponent
  },

  data() {
    return {
      $logo: null
    };
  },

  computed: {
    siteUrl() {
      return this.$store.state.siteUrl;
    },

    posts() {
      return this.$store.state.allPostData;
    },

    hasPosts() {
      return this.posts.length > 0 ? true : false;
    },

    perPage() {
      return this.$store.state.perPage;
    },

    loadedPostItem() {
      return this.$store.state.loadedPostItem;
    },

    isWebfontLoaded() {
      return this.$store.state.isWebfontLoaded;
    }
  },

  watch: {
    loadedPostItem() {
      this.onLoad();
    }
  },

  methods: {
    setCurrentPost(post) {
      if (this.$route.path === '/') {
        this.$store.dispatch('setCurrentPost', post);
      }
    },

    clearCurrentPost() {
      if (this.$route.path === '/') {
        this.$store.dispatch('clearCurrentPost');
      }
    },

    onLoad() {
      // loadedCountが記事数と同じになったらlogoのローディング終了
      if (this.posts.length === this.loadedPostItem) {
        console.log('all postitem loaded');
        this.$store.dispatch('logoLoading', {state:'end', wait:350});
      }
    },

    init() {
      // allPostDataがある(一度indexを表示した時)ときは、通信せずにallPostDataをそのまま使う
      // allPostDataがない時だけgetAllPostsする
      if (!this.hasPosts) {
        this.$store.dispatch('getAllPosts', {per_page:this.perPage, offset:0})
          .then((result)=>{
            this.$store.dispatch('setAllPost', result);
          })
          .then(()=>{
            scrollManager.add('index.infiniteScroll', ()=>{
              this.$store.dispatch('infiniteScroll', {scrollManager: scrollManager});
            });
          });
      }
      else {
        console.log('allPostData already exsist');
      }
    }
  },

  created() {
    // ページタイトルを変更
    this.$store.dispatch('changeTitle', '');

    // currentPostDataを空にする
    this.clearCurrentPost();

    // loadedPostItemをリセット
    this.$store.dispatch('changeloadedPostItem', 'reset');
  },

  mounted() {
    // webfontのロードが終わってない→isWebfontLoadedを監視して、読み込み後init関数実行
    if (!this.isWebfontLoaded) {
      this.$watch('isWebfontLoaded', ()=>{
        this.init();
      });
    }
    // webfontのローディングが終わってる(他のページから遷移した時とか)→そのままinit関数実行
    else {
      this.init();
    }
  },

  beforeRouteLeave(to, from, next) {
    scrollManager.remove('index.infiniteScroll');
    next();
  }
};
</script>

<style lang='scss' module>
@import "~bourbon";
@import "~styles/config";
@import "~styles/mixin";

.page {
  max-width: $width_index;
  margin: 150px auto 150px;
}

.item {
  margin-top: 75px;

  &:first-child {
    margin-top: 0;
  }
}
</style>

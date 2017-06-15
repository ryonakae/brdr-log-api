<template>
  <div :class="$style.page" ref="page">
    <ul v-if="hasPosts">
      <li v-for="post in posts" :key="post.id" :class="$style.item">
        <post-item-component :post="post" @click="setCurrentPost(post)"></post-item-component>
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

    loadedContentCount() {
      return this.$store.state.loadedContentCount;
    }
  },

  watch: {
    loadedContentCount(count) {
      // loadedCountが記事数と同じになったらlogoのローディング終了
      if (this.posts.length === count) {
        console.log('all postitem loaded');

        util.wait(550).then(()=>{
          $('#header').find('.logo').addClass('ready');
        });
      }
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
    }
  },

  created() {
    // currentPostDataを空にする
    this.clearCurrentPost();

    // loadedContentCountをリセット
    this.$store.dispatch('changeLoadedContentCount', 'reset');
  },

  mounted() {
    // ページタイトルを変更
    this.$store.dispatch('changeTitle', '');

    // allPostDataがある(一度indexを表示した時)ときは、通信せずにallPostDataをそのまま使う
    // allPostDataがない時だけgetAllPostsする
    console.log(this.posts.length, this.hasPosts);
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

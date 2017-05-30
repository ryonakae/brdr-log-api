<template>
  <div>
    <ul>
      <li v-if="hasPosts" v-for="post in posts" :key="post.id">
        <router-link :to="'/post/'+post.id" tag="h1" v-html="post.title.rendered"></router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import {scrollManager} from '../app';

export default {
  components: {},

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
  },

  methods: {},

  created() {},

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
</style>

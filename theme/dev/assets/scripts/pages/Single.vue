<template>
  <article v-if="hasPost">
    <h1 v-html="post.title.rendered"></h1>
    <div v-if="hasContent" v-html="post.content.rendered"></div>
    <div>
      <div>{{post.date | moment}}</div>
      <ul v-if="hasTags">
        <li v-for="tag in tags" :key="tag.id">{{tag.name}}</li>
      </ul>
    </div>
  </article>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      tags: []
    };
  },

  computed: {
    post() {
      return this.$store.state.currentPostData;
    },

    hasPost() {
      return Object.keys(this.post).length > 0 ? true : false;
    },

    hasContent() {
      return this.post.content.rendered !== '' ? true : false;
    },

    hasTags() {
      return this.post.tags.length >= 1 ? true : false;
    }
  },

  methods: {
    init() {
      this.$store.dispatch('changeTitle', this.post.title.rendered);

      // タグがある場合はgetTagName()してからテキストを表示
      if (this.hasTags) {
        this.getTagName(this.post.tags)
          .then(()=>{
            console.log('getTagName done');
          });
      }
    },

    getTagName(tags) {
      return new Promise((resolve, reject)=>{
        tags.forEach((tagId, index)=>{
          this.$store.dispatch('getTagName', tagId)
          .then((result)=>{
            // 管理画面で追加した順番にタグを配列に追加
            this.tags.splice(index, 0, result);

            // ループの最後
            if (tags.length === index+1) {
              resolve();
            }
          });
        });
      });
    }
  },

  filters: {
    moment(date) {
      return moment(date).format('YYYY');
    }
  },

  beforeRouteEnter(to, from, next) {
    next((vm)=>{
    });
  },

  mounted() {
    // currentPostDataがある(indexから遷移した時)
    // 通信せずにcurrentPostDataをそのまま使う
    if (this.hasPost) {
      this.init();
    }
    // currentPostDataがない場合(url直接叩いたとき)
    // →getPost()実行してcurrentPostDataにデータを入れる
    else {
      this.$store.dispatch('getPost', this.$route.params.id)
      .then((result)=>{
        return this.$store.dispatch('setCurrentPost', result);
      })
      .then(()=>{
        return this.init();
      });
    }
  }
};
</script>

<style lang='scss' module>
@import "~bourbon";
@import "~styles/config";
@import "~styles/mixin";
@import "~styles/extend";
</style>

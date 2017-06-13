<template>
  <article v-if="hasPost" :class="$style.article">
    <div :class="$style.header">
      <h1 :class="$style.title" v-html="post.title.rendered"></h1>

      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
        <ul v-if="hasTags" :class="$style.tags">
          <li v-for="tag in tags" :key="tag.id" :class="$style.tag">{{tag.name}}</li>
        </ul>
      </div>
    </div>

    <div v-if="hasEyecatch" :class="$style.eyecatch">
      <img :src="eyecatch">
    </div>

    <div v-if="hasContent" :class="$style.content" v-html="post.content.rendered" ref="content"></div>
  </article>
</template>

<script>
import moment from 'moment';
const $ = require('jquery');

export default {
  data() {
    return {
      tags: [],
      $content: null
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
    },

    hasEyecatch() {
      return this.post.featured_media > 0 ? true : false;
    },

    eyecatch() {
      return this.post._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url;
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

      // 本文の画像の親要素にaddClass
      this.$content = $(this.$refs.content);
      console.log($(this.$refs.content).find('img'));

      this.$content.find('img').each((i, elem)=>{
        $(elem).parent().addClass('img');
      });
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
      return moment(date).format('YYYY.M.D');
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

.article {
  max-width: $width_page;
  margin: 200px auto 150px;
}

.header {
  max-width: $width_content;
  margin: 0 auto 70px;
}

.title {
  font-size: $fontSize_h1;
}

.info {
  margin-top: 25px;
  font-size: $fontSize_small;
}

.date {
  display: inline-block;
}

.tags {
  display: inline-block;
  margin-left: 24px;
}

.tag {
  display: inline-block;
  margin-left: 1em;

  &:first-child{
    margin-left: 0;
  }
}

.eyecatch {
  border: 1px solid $color_key;
  margin-bottom: 2em;

  img {
    width: 100%;
    height: auto;
    vertical-align: top;
  }
}

.content {
  max-width: $width_content;
  margin: 0 auto;
  @extend %content;
}
</style>

<template>
  <article v-if="hasPost">
    <header :class="$style.header">
      <h1 :class="$style.title" v-html="post.title.rendered"></h1>

      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
        <ul v-if="hasTags" :class="$style.tags">
          <li v-for="tag in tags" :key="tag.id" :class="$style.tag">{{tag.name}}</li>
        </ul>

        <ul :class="$style.share">
          <li :class="[$style.icon, $style.twitter]">
            <a href="#" target="_blank">
              <svg :viewBox="icon.twitter.viewBox">
                <use :xlink:href="'#'+icon.twitter.id"></use>
              </svg>
            </a>
          </li>

          <li :class="[$style.icon, $style.facebook]">
            <a href="#" target="_blank">
              <svg :viewBox="icon.facebook.viewBox">
                <use :xlink:href="'#'+icon.facebook.id"></use>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </header>

    <div v-if="hasEyecatch" :class="$style.eyecatch">
      <img :src="eyecatch">
    </div>

    <div v-if="hasContent" :class="$style.content" v-html="post.content.rendered" ref="content"></div>

    <footer :class="$style.footer">
      <ul :class="$style.share">
        <li :class="[$style.icon, $style.twitter]">
          <a href="#" target="_blank">
            <svg :viewBox="icon.twitter.viewBox">
              <use :xlink:href="'#'+icon.twitter.id"></use>
            </svg>
          </a>
        </li>

        <li :class="[$style.icon, $style.facebook]">
          <a href="#" target="_blank">
            <svg :viewBox="icon.facebook.viewBox">
              <use :xlink:href="'#'+icon.facebook.id"></use>
            </svg>
          </a>
        </li>
      </ul>

      <small :class="$style.copyright">&copy;BORDER</small>

      <router-link :to="'/'" tag="div" :class="$style.backTop">
        <span>←</span>
        <span>Index</span>
      </router-link>
    </footer>
  </article>
</template>

<script>
import moment from 'moment';
const $ = require('jquery');

import iconTwitter from 'images/icon-twitter.svg';
import iconFacebook from 'images/icon-facebook.svg';

export default {
  data() {
    return {
      tags: [],
      $content: null,
      icon: {
        twitter: iconTwitter,
        facebook: iconFacebook
      }
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
      return this.post._embedded['wp:featuredmedia'][0].media_details.sizes.theme_thumbnail.source_url;
    }
  },

  methods: {
    init() {
      this.$store.dispatch('changeTitle', this.post.title.rendered);

      // タグがある場合はタグ取得
      if (this.hasTags) {
        this.$store.dispatch('getAllTagName', this.post.tags)
          .then((result)=>{
            return this.tags = result;
          });
      }

      // 本文の画像の親要素にaddClass
      this.$content = $(this.$refs.content);
      console.log($(this.$refs.content).find('img'));

      this.$content.find('img').each((i, elem)=>{
        $(elem).parent().addClass('img');
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

.page {
  max-width: $width_single;
  margin: 150px auto $margin_page;
}

.share {
  line-height: 1;

  .icon {
    display: inline-block;
    vertical-align: middle;
    margin-left: 16px;

    &:first-child {
      margin-left: 0;
    }

    svg {
      fill: $color_key;
    }

    &.twitter {
      svg {
        width: 14px;
        height: 11px;
      }
    }

    &.facebook {
      svg {
        width: 8px;
        height: 14px;
      }
    }
  }
}

.header {
  max-width: $width_content;
  margin: 150px auto 70px;

  .title {
    font-size: $fontSize_h1;
  }

  .info {
    @extend %info;
    margin-top: 25px;
    @include clearfix();

    .share {
      float: right;
      margin-top: 1px;
    }
  }
}

.eyecatch {
  max-width: $width_single;
  border: 1px solid $color_key;
  margin: 0 auto 3em;

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

.footer {
  margin: 100px $margin_page $margin_page;
  line-height: 1;
  @include clearfix();
  text-align: center;

  .share {
    display: inline-block;
  }

  .copyright {
    display: block;
    float: right;
    color: $textColor_lightGray;
    font-size: $fontSize_xSmall;
    line-height: 1;
    margin-top: 4px;
  }

  .backTop {
    position: fixed;
    bottom: $margin_page + 3px;
    left: $margin_page;
    font-size: $fontSize_small;
    line-height: 1;
  }
}
</style>

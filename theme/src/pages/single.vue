<template>
  <article v-if="hasPost" ref="article">
    <header :class="$style.header">
      <h1 :class="$style.title" v-html="post.title.rendered"></h1>

      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
        <ul v-if="hasTags" :class="$style.tags">
          <li v-for="tag in tags" :key="tag.id" :class="$style.tag" @click="filterByTag(tag.id, tag.name)">{{tag.name}}</li>
        </ul>

        <share-component :permalink="post.link" :title="post.title.rendered" :class="$style.share"></share-component>
      </div>
    </header>

    <div v-if="hasEyecatch" :class="$style.eyecatch">
      <img :src="eyecatch">
    </div>

    <div v-if="hasContent" :class="$style.content" v-html="post.content.rendered" ref="content"></div>

    <footer :class="$style.footer">
      <share-component :permalink="post.link" :title="post.title.rendered" :class="$style.share"></share-component>

      <small :class="$style.copyright">
        <a href="https://twitter.com/ryo_dg" target="_blank">&copy;Ryo Nakae</a>
      </small>

      <router-link :to="'/'" tag="div" :class="$style.backIndex">
        <span :class="$style.arrow">←</span>
        <span>Index</span>
      </router-link>
    </footer>
  </article>
</template>

<script>
import moment from 'moment';
import imagesLoaded from 'imagesloaded';
import ShareComponent from '../components/Share.vue';
import '../library/twitter_widgets';
import '../library/prettify';

export default {
  components: {
    ShareComponent
  },

  data() {
    return {
      tags: [],
      $content: null,
      $article: null,
      imgLoad: null,
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
      if (Object.keys(this.post._embedded['wp:featuredmedia'][0].media_details.sizes).length > 0) {
        return this.post._embedded['wp:featuredmedia'][0].media_details.sizes.theme_thumbnail.source_url;
      }
      else {
        return this.post._embedded['wp:featuredmedia'][0].source_url;
      }
    },

    isWebfontLoaded() {
      return this.$store.state.isWebfontLoaded;
    }
  },

  methods: {
    filterByTag(tagId, tagName) {
      this.$store.dispatch('filterByTag', {tagId:tagId, tagName:tagName, transition:true});
    },

    onWebfontLoad() {
      // currentPostDataがある(indexから遷移した時)
      // 通信せずにcurrentPostDataをそのまま使う
      if (this.hasPost) {
        this.init();
      }
      // currentPostDataがない場合(url直接叩いたとき)
      // →getPost()実行してcurrentPostDataにデータを入れる
      else {
        // 通常時
        if (!wpApiSettings.is_preview) {
          this.$store.dispatch('getPost', this.$route.params.id)
            .then((result)=>{
              return this.$store.dispatch('setCurrentPost', result);
            })
            .then(()=>{
              return this.init();
            });
        }
        // プレビューの時は、リビジョンを取得して、contentだけリビジョンのものに置き換える
        else {
          Promise.all([
            this.$store.dispatch('getPost', this.$route.params.id),
            this.$store.dispatch('getPostRevisions', this.$route.params.id)
          ])
            .then((results)=>{
              const _result = results[0];
              _result.content = results[1].content;
              console.log(_result);
              return this.$store.dispatch('setCurrentPost', _result);
            })
            .then(()=>{
              return this.init();
            });
        }
      }
    },

    init() {
      // ページタイトルを変更
      this.$store.dispatch('changeTitle', this.post.title.rendered);

      // タグがある場合はタグ取得
      if (this.hasTags) {
        this.$store.dispatch('getAllTagName', this.post.tags)
          .then((result)=>{
            return this.tags = result;
          });
      }

      this.$content = this.$refs.content;

      // 本文の画像の親要素にaddClass
      const $images = this.$content.getElementsByTagName('img');
      if ($images.length > 0) {
        for (let i = 0; i < $images.length; i++) {
          $images[i].parentNode.classList.add('img');
        }
      }

      // Twitterの埋め込みツイートがあったら関数実行
      const $tweet = this.$content.getElementsByClassName('twitter-tweet');
      if ($tweet.length > 0) twttr.widgets.load(document.body);

      // コードスニペットがあったらprettify実行
      const $code = this.$content.getElementsByTagName('pre');
      if ($code.length > 0) {
        for (let i = 0; i < $code.length; i++) {
          $code[i].classList.add('prettyprint');
        }
        prettyPrint();
      }

      // iframeをdivで囲う
      const $iframes = this.$content.getElementsByTagName('iframe');
      if ($iframes.length > 0) {
        for (let i = 0; i < $iframes.length; i++) {
          $iframes[i].outerHTML = '<div class="iframe">' + $iframes[i].outerHTML + '</div>';
        }
      }

      // ページ内の画像全部ロードしたらlogoのローディング終了
      this.$article = this.$refs.article;
      this.imgLoad = imagesLoaded(this.$article, {background: true});
      // progress
      this.imgLoad.on('progress', (instance, image)=>{
        image.img.classList.add('ready');
      });
      // done
      this.imgLoad.on('done', (instance)=>{
        this.$store.dispatch('logoLoading', {boolean:false, wait:300});
      });
    }
  },

  filters: {
    moment(date) {
      return moment(date).format('YYYY.M.D');
    }
  },

  created() {
    // logoのローディング開始
    this.$store.dispatch('logoLoading', {boolean:true, wait:0});
  },

  mounted() {
    // webfontのロードが終わってない→isWebfontLoadedを監視して、読み込み後onWebfontLoad関数実行
    if (!this.isWebfontLoaded) {
      this.$watch('isWebfontLoaded', ()=>{
        this.onWebfontLoad();
      });
    }
    // webfontのローディングが終わってる(他のページから遷移した時とか)→そのままonWebfontLoad関数実行
    else {
      this.onWebfontLoad();
    }
  }
};
</script>

<style module>
@import "properties";
@import "propertySets";
@import "media";

.header {
  max-width: var(--width_content);
  margin: var(--margin_top) auto 70px;

  @media (--mq_sp) {
    margin: var(--margin_top_sp) var(--margin_page_sp) 45px;
  }

  & .title {
    font-size: var(--fontSize_h1);

    @media (--mq_sp) {
      font-size: var(--fontSize_h1_sp);
    }
  }

  & .info {
    margin-top: 25px;
    @apply --info;
    @apply --clearfix;

    & .share {
      float: right;
      margin-top: 1px;
    }

    @media (--mq_sp) {
      margin-top: 15px;
    }
  }
}

.eyecatch {
  display: table;
  border: 1px solid var(--color_key);
  max-width: var(--width_single);
  margin: 0 auto 3em;
  text-align: center;

  & img {
    max-width: 100%;
    height: auto;
    vertical-align: top;
    transition: all var(--duration_quick) var(--easing);
    opacity: 0;

    &:global(.ready) {
      opacity: 1;
    }
  }
}

.content {
  max-width: var(--width_content);
  margin: 0 auto;
  @apply --content;

  @media (--mq_sp) {
    margin: 0 var(--margin_page_sp);
  }
}

.footer {
  margin: var(--margin_bottom) var(--margin_page) var(--margin_page);
  line-height: 1;
  @apply --clearfix;
  position: relative;

  @media (--mq_sp) {
    margin: var(--margin_bottom_sp) var(--margin_page_sp) var(--margin_page_sp);
  }

  & .share {
    position: absolute;
    top: -3px;
    left: 50%;
    transform: translateX(-50%);
  }

  & .copyright {
    display: block;
    float: right;
    font-size: var(--fontSize_xSmall);
    line-height: 1;
    margin-bottom: 1px;
  }

  & .backIndex {
    cursor: pointer;
    position: fixed;
    bottom: var(--margin_page);
    left: var(--margin_page);
    font-size: var(--fontSize_small);
    line-height: 1;
    transition: all var(--duration_quick) var(--easing);
    @apply --link;

    & span {
      display: inline-block;
    }

    & .arrow {
      transition: all var(--duration_quick) var(--easing);
    }

    @nest :global(body.pc) &:hover {
      & .arrow {
        transform: translateX(-2px);
      }
    }

    @media (--mq_sp) {
      bottom: var(--margin_page_sp);
      left: var(--margin_page_sp);
    }
  }
}
</style>

<style>
@import "prettify";
</style>

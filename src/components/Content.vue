<template>
  <div v-if="hasContent" class="content" v-html="data.content.rendered" ref="content"></div>
</template>

<script>
import imagesLoaded from 'imagesloaded'
import { utils } from '@/index'
import '@/library/twitter_widgets'
import '@/library/prettify'

export default {
  props: ['data'],

  data() {
    return {
      isImagesLoaded: false
    }
  },

  computed: {
    hasContent() {
      return this.data.content.rendered !== ''
    },

    isFontLoaded() {
      return this.$store.state.isFontLoaded
    }
  },

  watch: {
    isImagesLoaded() {
      this.checkLoad()
    },

    isFontLoaded() {
      this.checkLoad()
    }
  },

  methods: {
    init() {
      // Twitterの埋め込みツイートがあったら関数実行
      const $tweet = document.getElementsByClassName('twitter-tweet')
      if ($tweet.length > 0) window.twttr.widgets.load(document.body)

      // コードスニペットがあったらprettify実行
      const $code = document.getElementsByTagName('pre')
      console.log($code)
      if ($code.length > 0) {
        for (let i = 0; i < $code.length; i++) {
          $code[i].classList.add('prettyprint')
        }
        window.prettyPrint()
      }

      // iframeをdivで囲う
      const $iframes = document.getElementsByTagName('iframe')
      if ($iframes.length > 0) {
        for (let i = 0; i < $iframes.length; i++) {
          $iframes[i].outerHTML =
            '<div class="iframe">' + $iframes[i].outerHTML + '</div>'
        }
      }

      // ページ内の画像ロードした時の処理
      const imgLoad = imagesLoaded(this.$refs.content, { background: true })

      // progress
      imgLoad.on('progress', (instance, image) => {
        image.img.classList.add('ready')
      })

      // 100ms後にまだ画像が全部読み込まれていない場合、logoのローディングを開始する
      // 全部の画像を読み込み終わったらローディング終了
      // すでに読み込まれている場合は即座にlogoのローディング終了
      utils.wait(100, true).then(() => {
        if (!imgLoad.isComplete) {
          console.log('images are NOT loaded')
          this.$store.commit('changeIsLoading', true)

          imgLoad.on('always', () => {
            console.log('all images are loaded')
            this.isImagesLoaded = true
          })
        } else {
          console.log('images are ALREADY loaded')
          this.isImagesLoaded = true
        }
      })
    },

    checkLoad() {
      // webフォントがロードされて、全ての画像が読み込み済みの時の処理
      if (this.isFontLoaded && this.isImagesLoaded) {
        console.log('all webfont and images loaded')
        this.$store.commit('changeIsLoading', false)
      }
    }
  },

  mounted() {
    this.init()
  }
}
</script>

<style>
@import 'config.css';

.content {
  line-height: var(--lineHeight_default);

  & a {
    @apply --link;

    text-decoration: underline;
  }

  & strong {
    font-weight: bold;
  }

  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    margin-bottom: 1em;
    line-height: var(--lineHeight_title);

    @media (--mq_sp) {
      margin-bottom: 0.7em;
    }
  }

  & h1 {
    font-size: var(--fontSize_h1);
    margin-top: 2.5em;
  }

  & h2 {
    font-size: var(--fontSize_h2);
    margin-top: 2.3em;
  }

  & h3 {
    font-size: var(--fontSize_h3);
    margin-top: 2.1em;
  }

  & h4 {
    font-size: var(--fontSize_h4);
    margin-top: 1.9em;
  }

  & h5 {
    font-size: var(--fontSize_h5);
    margin-top: 1.7em;
  }

  & h6 {
    font-size: var(--fontSize_h6);
    margin-top: 1.7em;
  }

  @media (--mq_sp) {
    & h1 {
      font-size: var(--fontSize_h1_sp);
      margin-top: 2.1em;
    }

    & h2 {
      font-size: var(--fontSize_h2_sp);
      margin-top: 1.9em;
    }

    & h3 {
      font-size: var(--fontSize_h3_sp);
      margin-top: 1.7em;
    }

    & h4 {
      font-size: var(--fontSize_h4_sp);
      margin-top: 1.5em;
    }

    & h5 {
      font-size: var(--fontSize_h5_sp);
      margin-top: 1.3em;
    }

    & h6 {
      font-size: var(--fontSize_h6_sp);
      margin-top: 1.3em;
    }
  }

  & p,
  & ul,
  & ol {
    margin: 1.5em 0;

    @media (--mq_sp) {
      margin: 1.3em 0;
    }
  }

  & ul,
  & ol {
    padding-left: 1.5em;

    & ul,
    & ol {
      margin: 0;
    }

    & ul {
      list-style-type: circle;
    }
  }

  & .img {
    display: table;
    margin: 2.1em auto;
    background-color: var(--color_bgSub);

    &:first-child {
      margin-top: 0;
    }

    @media (--mq_sp) {
      margin: 1.7em auto;
    }

    & img {
      line-height: 0;
      max-width: 100%;
      height: auto;
      vertical-align: top;
      visibility: hidden;

      &.ready {
        visibility: visible;
      }
    }

    & small {
      display: block;
      text-align: center;
      margin-top: 1.2em;
      line-height: var(--lineHeight_caption);
      font-size: var(--fontSize_small);
      color: var(--color_sub);
    }
  }

  & blockquote,
  & pre {
    margin: 2.1em 0;

    @media (--mq_sp) {
      margin: 1.7em 0;
    }
  }

  & blockquote {
    border-left: 1px solid var(--color_key);
    padding-left: 1.5em;
    color: var(--color_sub);
    font-style: italic;
  }

  & code {
    background-color: var(--color_bgSub);
    font-family: var(--fontFamily_code);
    letter-spacing: initial;
  }

  & pre {
    background-color: var(--color_bgSub);
    padding: 1em 1.25em;
    background-clip: padding-box;
    word-wrap: normal;
    overflow-x: auto;

    & code {
      line-height: var(--lineHeight_code);
      display: block;
      white-space: pre;
      margin: 0;
      padding: 0;
      background: none;
    }
  }

  & hr {
    width: 10%;
    height: 1px;
    background-color: var(--color_key);
    border: none;
    margin: 3.5em 0;

    @media (--mq_sp) {
      margin: 3em 0;
    }
  }

  & .iframe {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;

    & iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  & .twitter-tweet,
  & .instagram-media {
    margin: 2.1em auto !important;

    @media (--mq_sp) {
      margin: 1.7em 0 !important;
    }
  }
}
</style>

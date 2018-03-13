<template>
  <div v-if="hasContent" class="content" v-html="data.content.rendered" ref="content"></div>
</template>

<script>
import imagesLoaded from 'imagesloaded'
import { utils } from '@/index'
import '@/libraries/twitter_widgets'
import '@/libraries/prettify'

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

      // ページ内の画像をロードしたら、画像の親要素にaddClass
      const imgLoad = imagesLoaded(this.$refs.content, { background: true })
      imgLoad.on('progress', (instance, image) => {
        image.img.parentNode.classList.add('ready')
      })

      // 100ms後にまだ画像が全部読み込まれていない場合、logoのローディングを開始する
      // 全部の画像を読み込み終わったらローディング終了
      // すでに読み込まれている場合は即座にlogoのローディング終了
      ;(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))

        if (!imgLoad.isComplete) {
          console.log('[Content.vue - init] images are NOT loaded')
          this.$store.commit('changeIsLoading', true)
          await new Promise(resolve => imgLoad.on('always', resolve))
          this.isImagesLoaded = true
          console.log('[Content.vue - init] all images are loaded')
        } else {
          console.log('[Content.vue - init] images are ALREADY loaded')
          this.isImagesLoaded = true
        }
      })()
    },

    checkLoad() {
      // webフォントがロードされて、全ての画像が読み込み済みの時の処理
      if (this.isFontLoaded && this.isImagesLoaded) {
        console.log('[Content.vue - checkLoad] all webfont/images loaded')
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
@import 'prettify.css';
</style>

<style>
@import 'config.css';

.content {
  line-height: var(--lineHeight_content);
  text-align: justify;

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
    margin: 1.5em 0 0.5em;
    line-height: var(--lineHeight_title);
    text-align: left;
  }

  & h1 {
    font-size: var(--fontSize_h1);
  }

  & h2 {
    font-size: var(--fontSize_h2);
  }

  & h3 {
    font-size: var(--fontSize_h3);
  }

  & h4 {
    font-size: var(--fontSize_h4);
  }

  & h5 {
    font-size: var(--fontSize_h5);
  }

  & h6 {
    font-size: var(--fontSize_h6);
  }

  & p,
  & ul,
  & ol {
    margin: 1.2em 0;
  }

  & ul,
  & ol {
    padding-left: 1.3em;

    & ul,
    & ol {
      margin: 0.3em 0;
    }
  }

  & .img {
    position: relative;
    display: table;
    margin: 1.5em auto;
    background-color: var(--color_bgSub);

    &:first-child {
      margin-top: 0;
    }

    & img {
      line-height: 0;
      max-width: 100%;
      height: auto;
      vertical-align: top;
      opacity: 0;
    }

    &.ready {
      background: none;

      & img {
        opacity: 1;
      }
    }

    & small {
      display: block;
      text-align: center;
      margin-top: 1em;
      line-height: var(--lineHeight_caption);
      font-size: var(--fontSize_small);
      color: var(--color_sub);
    }
  }

  & blockquote,
  & pre {
    margin: 1.5em 0;
  }

  & blockquote {
    border-left: 1px solid var(--color_key);
    padding-left: 1.3em;
    color: var(--color_sub);
    font-style: italic;
  }

  & code {
    background-color: var(--color_bgSub);
    font-family: var(--fontFamily_code);
    letter-spacing: initial;
    word-break: break-all;
  }

  & pre {
    text-align: left;
    font-size: var(--fontSize_code);
    background-color: var(--color_bgSub);
    padding: 1em 1.3em;
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
    width: 5%;
    height: 1px;
    background-color: var(--color_key);
    border: none;
    margin: 2.5em 0;
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
    margin: 1.5em auto !important;
  }
}
</style>

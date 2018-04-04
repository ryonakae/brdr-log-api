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
          console.log('[Content - init] images are NOT loaded')
          this.$store.commit('changeIsLoading', true)
          await new Promise(resolve => imgLoad.on('always', resolve))
          this.isImagesLoaded = true
          console.log('[Content - init] all images are loaded')
        } else {
          console.log('[Content - init] images are ALREADY loaded')
          this.isImagesLoaded = true
        }
      })()
    },

    checkLoad() {
      // webフォントがロードされて、全ての画像が読み込み済みの時の処理
      if (this.isFontLoaded && this.isImagesLoaded) {
        console.log('[Content - checkLoad] all webfont/images loaded')
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

<style scoped>
@import 'config.css';

.content {
  line-height: var(--lineHeight_content);
  text-align: justify;

  & > :global(*) {
    @apply --content;
  }

  & :global(a) {
    @apply --link;

    text-decoration: underline;
  }

  & :global(strong) {
    font-weight: bold;
  }

  & :global(h1),
  & :global(h2),
  & :global(h3),
  & :global(h4),
  & :global(h5),
  & :global(h6) {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    line-height: var(--lineHeight_title);
    text-align: left;
  }

  & :global(h1) {
    font-size: var(--fontSize_h1);
  }

  & :global(h2) {
    font-size: var(--fontSize_h2);
  }

  & :global(h3) {
    font-size: var(--fontSize_h3);
  }

  & :global(h4) {
    font-size: var(--fontSize_h4);
  }

  & :global(h5) {
    font-size: var(--fontSize_h5);
  }

  & :global(h6) {
    font-size: var(--fontSize_h6);
  }

  & :global(p),
  & :global(ul),
  & :global(ol) {
    margin-top: 1.2em;
    margin-bottom: 1.2em;
  }

  & :global(ul),
  & :global(ol) {
    padding-left: 1.3em;

    & :global(ul),
    & :global(ol) {
      margin-top: 0.3em;
      margin-bottom: 0.3em;
    }
  }

  & :global(.img) {
    position: relative;
    display: table;
    max-width: 100%;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    background-color: var(--color_bgSub);

    &:first-child {
      margin-top: 0;
    }

    &:global(.small) {
      @apply --content;
    }

    &:global(.ready) {
      background: none;

      & :global(img) {
        opacity: 1;
      }
    }

    @media (--mq_sp) {
      margin-left: 0;
      margin-right: 0;
    }

    & :global(img) {
      line-height: 0;
      max-width: 100%;
      height: auto;
      vertical-align: top;
      opacity: 0;
    }

    & :global(small) {
      display: block;
      text-align: center;
      margin-top: 1em;
      line-height: var(--lineHeight_caption);
      font-size: var(--fontSize_small);
      color: var(--color_sub);
    }
  }

  & :global(blockquote),
  & :global(pre) {
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }

  & :global(blockquote) {
    border-left: 1px solid var(--color_key);
    padding-left: 1.3em;
    color: var(--color_sub);
    font-style: italic;
  }

  & :global(code) {
    background-color: var(--color_bgSub);
    font-family: var(--fontFamily_code);
    letter-spacing: initial;
    word-break: break-all;
  }

  & :global(pre) {
    max-width: 100%;
    padding: 1em 1.3em;
    text-align: left;
    font-size: var(--fontSize_code);
    background-color: var(--color_bgSub);
    background-clip: padding-box;
    word-wrap: normal;
    overflow-x: auto;

    & :global(code) {
      line-height: var(--lineHeight_code);
      display: block;
      white-space: pre;
      margin: 0;
      padding: 0;
      background: none;
    }

    @media (--mq_sp) {
      margin-left: 0;
      margin-right: 0;
      padding-left: var(--margin_page_sp);
      padding-right: var(--margin_page_sp);
    }
  }

  & :global(hr) {
    width: 5%;
    height: 1px;
    background-color: var(--color_key);
    border: none;
    margin-top: 2.5em;
    margin-bottom: 2.5em;
  }

  & :global(.iframe) {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;

    & :global(iframe) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  & :global(.twitter-tweet),
  & :global(.instagram-media) {
    margin-top: 1.5em !important;
    margin-bottom: 1.5em !important;
  }
}
</style>

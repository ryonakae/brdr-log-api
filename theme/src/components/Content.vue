<template>
  <div ref="content">
    <div v-if="hasEyecatch" :class="$style.eyecatch">
      <img :src="eyecatch">
    </div>

    <div v-if="hasContent" :class="$style.content" v-html="data.content.rendered"></div>
  </div>
</template>

<script>
import imagesLoaded from 'imagesloaded'
import {util} from '@/index'
import '@/library/twitter_widgets'
import '@/library/prettify'

export default {
  props: ['data'],

  computed: {
    hasEyecatch () {
      return this.data.featured_media > 0
    },

    eyecatch () {
      if (Object.keys(this.data._embedded['wp:featuredmedia'][0].media_details.sizes).length > 0) {
        return this.data._embedded['wp:featuredmedia'][0].media_details.sizes.theme_thumbnail.source_url
      } else {
        return this.data._embedded['wp:featuredmedia'][0].source_url
      }
    },

    hasContent () {
      return this.data.content.rendered !== ''
    }
  },

  mounted () {
    // 本文の画像の親要素にaddClass
    const $images = document.getElementsByTagName('img')
    if ($images.length > 0) {
      for (let i = 0; i < $images.length; i++) {
        $images[i].parentNode.classList.add('img')
      }
    }

    // Twitterの埋め込みツイートがあったら関数実行
    const $tweet = document.getElementsByClassName('twitter-tweet')
    if ($tweet.length > 0) window.twttr.widgets.load(document.body)

    // コードスニペットがあったらprettify実行
    const $code = document.getElementsByTagName('pre')
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
        $iframes[i].outerHTML = '<div class="iframe">' + $iframes[i].outerHTML + '</div>'
      }
    }

    // ページ内の画像ロードした時の処理
    const imgLoad = imagesLoaded(this.$refs.content, {background: true})

    // progress
    imgLoad.on('progress', (instance, image) => {
      image.img.classList.add('ready')
    })

    // 100ms後にまだ画像が全部読み込まれていない場合、logoのローディングを開始する
    // 全部の画像を読み込み終わったらローディング終了
    // すでに読み込まれている場合は即座にlogoのローディング終了
    util.wait(100).then(() => {
      if (!imgLoad.isComplete) {
        console.log('images are NOT loaded')
        this.$store.dispatch('logoLoading', {boolean: true, wait: 0})

        imgLoad.on('always', () => {
          console.log('all images are loaded')
          this.$store.dispatch('logoLoading', {boolean: false, wait: 300})
        })
      } else {
        console.log('images are ALREADY loaded')
        this.$store.dispatch('logoLoading', {boolean: false, wait: 0})
      }
    })
  }
}
</script>

<style module>
@import "properties.css";
@import "property-sets.css";
@import "media.css";

.eyecatch {
  display: table;
  border: 1px solid var(--color_key);
  max-width: var(--width_single);
  margin: 0 auto 3em;
  text-align: center;

  & img {
    width: var(--width_single);
    max-width: 100%;
    height: auto;
    vertical-align: top;
    transition: all var(--duration_quick) var(--easing);
    opacity: 0;

    &:global(.ready) {
      opacity: 1;
    }
  }

  @media (--mq_tablet) {
    border-right: none;
    border-left: none;
  }
}

.content {
  max-width: var(--width_content);
  margin: 0 auto;

  @media (--mq_sp) {
    margin: 0 var(--margin_page_sp);
  }

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

  & ul {
    list-style-type: disc;
    padding-left: 1.5em;
  }

  & ol {
    list-style-type: decimal;
    padding-left: 1.5em;
  }

  & ul,
  & ol {
    & ul,
    & ol {
      margin: 0;
    }

    & ul {
      list-style-type: circle;
    }
  }

  & :global(.img) {
    display: table;
    margin: 2.1em auto;
    overflow: hidden;

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
      transition: all var(--duration_quick) var(--easing);
      opacity: 0;
      background-color: var(--bgColor_default);
      border: 1px solid var(--color_key);

      &:global(.ready) {
        opacity: 1;
      }
    }

    & small {
      display: block;
      text-align: center;
      margin-top: 1.2em;
      line-height: var(--lineHeight_caption);
      font-size: var(--fontSize_small);

      @media (--mq_sp) {
        font-size: var(--fontSize_small_sp);
      }
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
    color: var(--textColor_gray);
    font-style: italic;
  }

  & code {
    vertical-align: top;
    margin: 0;
    padding: 0 0.35em;
    font-size: var(--fontSize_code);
    letter-spacing: var(--letterSpacing_code);
    background-color: var(--bgColor_gray);

    @media (--mq_sp) {
      font-size: var(--fontSize_code_sp);
    }
  }

  & pre {
    border: 1px solid var(--color_key);
    padding: 1em 1.25em;
    background-clip: padding-box;
    word-wrap: normal;
    overflow-x: auto;

    & code {
      display: block;
      white-space: pre;
      margin: 0;
      padding: 0;
      border: none;
      line-height: var(--lineHeight_code);
      background: none;
    }
  }

  & hr {
    width: 12%;
    height: 1px;
    background-color: var(--color_key);
    border: none;
    margin: 3.5em 0;

    @media (--mq_sp) {
      margin: 3em 0;
    }
  }

  & :global(.iframe) {
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

  & :global(.twitter-tweet),
  & :global(.instagram-media) {
    margin: 2.1em auto !important;

    @media (--mq_sp) {
      margin: 1.7em 0 !important;
    }
  }
}
</style>

<template>
  <article v-if="hasPost" ref="article">
    <header :class="$style.header">
      <h1 :class="$style.title" v-html="postTitle"></h1>

      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
        <ul v-if="hasCategories" :class="$style.categories">
          <li v-for="category in categories" :key="category.id" :class="$style.category" @click="filterByCategory(category.id, category.name)">{{category.name}}</li>
        </ul>

        <share-component :permalink="post.link" :title="postTitle" :class="$style.share"></share-component>
      </div>
    </header>

    <div v-if="hasEyecatch" :class="$style.eyecatch">
      <img :src="eyecatch">
    </div>

    <div v-if="hasContent" :class="$style.content" v-html="post.content.rendered"></div>

    <footer :class="$style.footer">
      <share-component :permalink="post.link" :title="postTitle" :class="$style.share"></share-component>

      <small :class="$style.copyright">
        <a href="https://twitter.com/ryo_dg" target="_blank">&copy;Ryo Nakae</a>
      </small>

      <router-link :to="'/'" tag="div" :class="$style.backIndex">
        <span :class="$style.arrow">&lt;-</span>
        <span>Index</span>
      </router-link>
    </footer>
  </article>

  <div v-else ref="notFound" :class="[$style.notFound, $style.hidden]">
    <not-found-component></not-found-component>
  </div>
</template>

<script>
import moment from 'moment'
import imagesLoaded from 'imagesloaded'
import ShareComponent from '../components/Share.vue'
import NotFoundComponent from '../components/NotFound.vue'
import '../library/twitter_widgets'
import '../library/prettify'

export default {
  components: {
    ShareComponent,
    NotFoundComponent
  },

  data () {
    return {
      categories: [],
      $article: null,
      imgLoad: null
    }
  },

  computed: {
    post () {
      return this.$store.state.currentPostData
    },

    hasPost () {
      return Object.keys(this.post).length > 0
    },

    hasContent () {
      return this.post.content.rendered !== ''
    },

    hasCategories () {
      return this.post.categories.length >= 1
    },

    hasEyecatch () {
      return this.post.featured_media > 0
    },

    eyecatch () {
      if (Object.keys(this.post._embedded['wp:featuredmedia'][0].media_details.sizes).length > 0) {
        return this.post._embedded['wp:featuredmedia'][0].media_details.sizes.theme_thumbnail.source_url
      } else {
        return this.post._embedded['wp:featuredmedia'][0].source_url
      }
    },

    isWebfontLoaded () {
      return this.$store.state.isWebfontLoaded
    },

    isPreview () {
      return this.$store.state.isPreview
    },

    postTitle () {
      let title

      if (this.post.status === 'draft') {
        title = 'Draft: ' + this.post.title.rendered
      } else {
        title = this.post.title.rendered
      }

      return title
    }
  },

  methods: {
    filterByCategory (categoryId, categoryName) {
      this.$store.dispatch('filterByCategory', {categoryId: categoryId, categoryName: categoryName, transition: true})
    },

    onWebfontLoad () {
      // currentPostDataがある(indexから遷移した時)
      // 通信せずにcurrentPostDataをそのまま使う
      if (this.hasPost) {
        this.init()
      } else {
        // currentPostDataがない場合(url直接叩いたとき)
        // →getPost()実行してcurrentPostDataにデータを入れる
        // エラー返ってきたらnotFoundを表示
        // 通常時
        if (!this.isPreview) {
          this.$store.dispatch('getPost', this.$route.params.id)
            .then((result) => {
              this.$store.dispatch('setCurrentPost', result)
            })
            .then(() => {
              this.init()
            })
            .catch(this.onNotFound)
        } else {
          // プレビューの時は、リビジョンを取得して、contentだけリビジョンのものに置き換える
          Promise.all([
            this.$store.dispatch('getPost', this.$route.params.id),
            this.$store.dispatch('getPostRevisions', this.$route.params.id)
          ])
            .then((results) => {
              const _result = results[0]
              _result.content = results[1].content
              console.log(_result)
              this.$store.dispatch('setCurrentPost', _result)
            })
            .then(() => {
              this.init()
            })
            .catch(this.onNotFound)
        }
      }
    },

    init () {
      // ページタイトルを変更
      this.$store.dispatch('changeTitle', this.post.title.rendered)

      // カテゴリがある場合はカテゴリ取得
      if (this.hasCategories) {
        this.$store.dispatch('getAllCategoryName', this.post.categories)
          .then((result) => {
            this.categories = result
          })
      }

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

      // ページ内の画像全部ロードしたらlogoのローディング終了
      this.$article = this.$refs.article
      this.imgLoad = imagesLoaded(this.$article, {background: true})
      // progress
      this.imgLoad.on('progress', (instance, image) => {
        image.img.classList.add('ready')
      })
      // done
      this.imgLoad.on('done', (instance) => {
        this.$store.dispatch('logoLoading', {boolean: false, wait: 300})
      })
    },

    // 404の時
    onNotFound () {
      this.$store.dispatch('changeTitle', 'Page Not Found')
      this.$store.dispatch('logoLoading', {boolean: false, wait: 300})

      const $notFound = this.$refs.notFound
      $notFound.classList.remove(this.$style.hidden)
    }
  },

  filters: {
    moment (date) {
      return moment(date).format('YYYY.M.D')
    }
  },

  created () {
    // logoのローディング開始
    this.$store.dispatch('logoLoading', {boolean: true, wait: 0})
  },

  mounted () {
    // webfontのロードが終わってない→isWebfontLoadedを監視して、読み込み後onWebfontLoad関数実行
    // webfontのローディングが終わってる(他のページから遷移した時とか)→そのままonWebfontLoad関数実行
    if (!this.isWebfontLoaded) {
      this.$watch('isWebfontLoaded', () => {
        this.onWebfontLoad()
      })
    } else {
      this.onWebfontLoad()
    }
  }
}
</script>

<style module>
@import "properties.css";
@import "propertySets.css";
@import "media.css";

.header {
  @apply --header;
}

.eyecatch {
  @apply --eyecatch;
}

.content {
  @apply --content;
}

.footer {
  @apply --footer;
}

.notFound {
  &.hidden {
    display: none;
  }
}
</style>

<style>
@import "prettify";
</style>

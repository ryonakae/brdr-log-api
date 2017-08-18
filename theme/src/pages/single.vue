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

    <content-component :data="post"></content-component>
  </article>

  <div v-else ref="notFound" :class="[$style.notFound, $style.hidden]">
    <not-found-component></not-found-component>
  </div>
</template>

<script>
import moment from 'moment'
import ShareComponent from '../components/Share.vue'
import ContentComponent from '../components/Content.vue'
import NotFoundComponent from '../components/NotFound.vue'

export default {
  components: {
    ShareComponent,
    ContentComponent,
    NotFoundComponent
  },

  data () {
    return {
      categories: [],
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

    hasCategories () {
      return this.post.categories.length >= 1
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
          .then(this.init)
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
          .then(this.init)
          .catch(this.onNotFound)
      }
    }
  }
}
</script>

<style module>
@import "properties.css";
@import "property-sets.css";
@import "media.css";

.header {
  @apply --header;
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

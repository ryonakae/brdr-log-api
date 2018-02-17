<template>
  <div>
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

    <not-found-component v-if="isNotFound"></not-found-component>
  </div>
</template>

<script>
import moment from 'moment'
import ShareComponent from '@/components/Share.vue'
import ContentComponent from '@/components/Content.vue'
import NotFoundComponent from '@/components/NotFound.vue'

export default {
  components: {
    ShareComponent,
    ContentComponent,
    NotFoundComponent
  },

  data() {
    return {
      categories: [],
      imgLoad: null
    }
  },

  computed: {
    post() {
      return this.$store.state.currentPostData
    },

    hasPost() {
      return Object.keys(this.post).length > 0
    },

    hasCategories() {
      return this.post.categories.length >= 1
    },

    postTitle() {
      let title

      if (this.post.status === 'draft') {
        title = 'Draft: ' + this.post.title.rendered
      } else {
        title = this.post.title.rendered
      }

      return title
    },

    isPreview() {
      return this.$store.state.isPreview
    },

    isNotFound() {
      return this.$store.state.isNotFound
    }
  },

  filters: {
    moment(date) {
      return moment(date).format('YYYY.M.D')
    }
  },

  methods: {
    filterByCategory(categoryId, categoryName) {
      this.$store.dispatch('filterByCategory', {
        categoryId: categoryId,
        categoryName: categoryName,
        transition: true
      })
    },

    init() {
      // ページタイトルを変更
      this.$store.dispatch('changeTitle', this.post.title.rendered)

      // カテゴリがある場合はカテゴリ取得
      if (this.hasCategories) {
        this.$store
          .dispatch('getAllCategoryName', this.post.categories)
          .then(result => {
            this.categories = result
          })
      }
    }
  },

  mounted() {
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
        this.$store
          .dispatch('getPost', this.$route.params.id)
          .then(result => {
            this.$store.dispatch('setCurrentPost', result)
          })
          .then(() => {
            this.init()
          })
          .catch(err => {
            console.error(err)
            this.$store.dispatch('onNotFound')
          })
      } else {
        // プレビュー時
        // リビジョンを取得して、contentだけリビジョンのものに置き換える
        Promise.all([
          this.$store.dispatch('getPost', this.$route.params.id),
          this.$store.dispatch('getPostRevisions', this.$route.params.id)
        ])
          .then(results => {
            // results[0]がgetPostの結果、results[1]がgetPostRevisionsの結果
            const result = Object.assign(results[0], results[1])
            console.log(result)
            this.$store.dispatch('setCurrentPost', result)
          })
          .then(() => {
            this.init()
          })
          .catch(err => {
            console.error(err)
            this.$store.dispatch('onNotFound')
          })
      }
    }
  }
}
</script>

<style module>
@import 'properties.css';
@import 'property-sets.css';
@import 'media.css';

.header {
  @apply --header;
}
</style>

<style>
@import 'prettify';
</style>

<template>
  <div>
    <article v-if="hasPost" ref="article">
      <header class="header">
        <h1 class="title" v-html="postTitle"></h1>
        <div class="info">
          <div class="date">{{post.date | moment}}</div>
          <ul v-if="hasCategories" class="categories">
            <li v-for="category in categories" :key="category.id" class="category" @click="filterByCategory(category.id, category.name)">{{category.name}}</li>
          </ul>
        </div>
      </header>

      <content-component :data="post"></content-component>
    </article>

    <not-found-component v-if="isNotFound"></not-found-component>
  </div>
</template>

<script>
import moment from 'moment'
import ContentComponent from '@/components/Content.vue'
import NotFoundComponent from '@/components/NotFound.vue'

export default {
  components: {
    ContentComponent,
    NotFoundComponent
  },

  data() {
    return {
      post: {},
      categories: [],
      imgLoad: null
    }
  },

  computed: {
    client() {
      return this.$store.state.client
    },
    postId() {
      return this.$route.params.id
    },
    hasPost() {
      return Object.keys(this.post).length > 0
    },
    hasCategories() {
      return this.post.categories.length >= 1
    },
    postTitle() {
      let title = this.post.title.rendered

      if (this.post.status === 'draft') {
        title = 'Draft: ' + this.post.title.rendered
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
    },

    getPost(id) {
      return new Promise((resolve, reject) => {
        this.client
          .get('/posts/' + id, { params: { _embed: '' } })
          .then(res => {
            console.log('[single.vue - getPost]', res.data)
            resolve(res.data)
          })
          .catch(err => {
            console.error('[single.vue - getPost]', err)
            reject(err)
          })
      })
    },

    getPostRevisions(id) {
      return new Promise((resolve, reject) => {
        this.client
          .get('/posts/' + id + '/revisions')
          .then(res => {
            console.log('[single.vue - getPostRevisions]', res.data)
            resolve(res.data)
          })
          .catch(err => {
            console.error('[single.vue - getPostRevisions]', err)
            reject(err)
          })
      })
    },

    filterByCategory(categoryId, categoryName) {
      this.$store.dispatch('filterByCategory', {
        categoryId: categoryId,
        categoryName: categoryName,
        transition: true
      })
    }
  },

  mounted() {
    // getPost/getPostRevisionsを実行
    // エラー返ってきたらnotFoundを表示
    if (!this.isPreview) {
      this.getPost(this.postId)
        .then(res => {
          this.post = res
          this.init()
        })
        .catch(err => {
          console.error(err)
          this.$store.dispatch('onNotFound')
        })
    } else {
      Promise.all([
        this.getPost(this.postId),
        this.getPostRevisions(this.postId)
      ])
        .then(res => {
          const _res = Object.assign(res[0], res[1])
          this.post = _res
          this.init()
        })
        .catch(err => {
          console.error(err)
          this.$store.dispatch('onNotFound')
        })
    }
  }
}
</script>

<style scoped>
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

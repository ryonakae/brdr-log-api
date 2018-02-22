<template>
  <div>
    <article v-if="hasPost" ref="article">
      <header class="header">
        <h1 class="title" v-html="postTitle"></h1>
        <div class="info">
          <div class="date">{{post.date | moment}}</div>
          <ul v-if="hasCategories" class="categories">
            <li v-for="category in categories" :key="category.id" class="category" @click="filter(category.id, category.name)">{{category.name}}</li>
          </ul>
        </div>
      </header>

      <content-component :data="post"></content-component>

      <footer class="footer">
        <share-component v-if="hasPost" :permalink="post.link" :title="post.title.rendered" class="share"></share-component>
        <router-link :to="'/'" class="back">Index</router-link>
      </footer>
    </article>

    <not-found-component v-if="isNotFound"></not-found-component>
  </div>
</template>

<script>
import moment from 'moment'
import ContentComponent from '@/components/Content.vue'
import ShareComponent from '@/components/Share.vue'
import NotFoundComponent from '@/components/NotFound.vue'

export default {
  components: {
    ContentComponent,
    ShareComponent,
    NotFoundComponent
  },

  data() {
    return {
      post: {},
      categories: [],
      imgLoad: null,
      isNotFound: false
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
      return window.wpSettings.is_preview
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

    filter(categoryId, categoryName) {
      this.$store.dispatch('filter', {
        categoryId: categoryId,
        categoryName: categoryName,
        transition: true
      })
    },

    onNotFound() {
      this.isNotFound = true
      this.$store.dispatch('changeTitle', 'Page Not Found')
      this.$store.dispatch('loading', { status: 'end', wait: 300 })
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
        .catch(() => {
          this.onNotFound()
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
        .catch(() => {
          this.onNotFound()
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

.footer {
  margin-bottom: var(--margin_page);
  font-size: var(--fontSize_small);

  & a {
    @apply --link;
  }

  @media (--mq_sp) {
    margin-bottom: var(--margin_page_sp);
  }
}

.share {
  display: inline-block;
}

.back {
  display: inline-block;
  margin-left: 1.5em;
}
</style>

<style>
@import 'prettify';
</style>

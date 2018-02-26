<template>
  <div>
    <article v-if="hasPost" ref="article">
      <eyecatch-component class="eyecatch"></eyecatch-component>

      <header class="header">
        <h1 class="title" v-html="postTitle"></h1>
        <div class="info">
          <div class="date">{{post.date | moment}}</div>
          <ul v-if="hasCategories" class="categories">
            <li v-for="category in categories" :key="category.id" class="category" @click="filter(category.id, category.name)">{{category.name}}</li>
          </ul>
        </div>
      </header>

      <content-component class="content" :data="post"></content-component>

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
import EyecatchComponent from '@/components/Eyecatch.vue'
import ContentComponent from '@/components/Content.vue'
import ShareComponent from '@/components/Share.vue'
import NotFoundComponent from '@/components/NotFound.vue'

export default {
  components: {
    EyecatchComponent,
    ContentComponent,
    ShareComponent,
    NotFoundComponent
  },

  data() {
    return {
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
    post() {
      return this.$store.state.currentPost
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
      this.$store.commit('setPageTitle', this.post.title.rendered)

      if (this.hasCategories) {
        this.$store
          .dispatch('getAllCategoryName', this.post.categories)
          .then(result => {
            this.categories = result
          })
      }
    },

    async getPost(id) {
      try {
        const res = await this.client.get('/posts/' + id, {
          params: { _embed: '' }
        })
        console.log('[single.vue - getPost]', res.data)
        return res.data
      } catch (err) {
        throw new Error('[single.vue - getPost]', err)
      }
    },

    async getPostRevisions(id) {
      try {
        const res = await this.client.get('/posts/' + id + '/revisions')
        console.log('[single.vue - getPostRevisions]', res.data)
        return res.data
      } catch (err) {
        throw new Error('[single.vue - getPostRevisions]', err)
      }
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
      this.$store.commit('setPageTitle', 'Page Not Found')
      this.$store.commit('changeIsLoading', false)
    }
  },

  async mounted() {
    try {
      if (!this.isPreview) {
        const res = await this.getPost(this.postId)
        this.$store.commit('setCurrentPost', res)
        this.init()
      } else {
        const res = await Promise.all([
          this.getPost(this.postId),
          this.getPostRevisions(this.postId)
        ])
        const _res = Object.assign(res[0], res[1])
        this.$store.commit('setCurrentPost', _res)
        this.init()
      }
    } catch (err) {
      console.error('[single.vue - mounted]', err)
      this.onNotFound()
    }
  }
}
</script>

<style scoped>
@import 'config.css';

.header,
.content,
.footer {
  @apply --content;
}

.header {
  margin-top: var(--margin_top);

  @media (--mq_sp) {
    margin-top: var(--margin_top_sp);
  }
}

.title {
  @apply --title;
}

.info {
  @apply --info;
}

.content {
  margin-top: var(--margin_page);

  @media (--mq_sp) {
    margin-top: var(--margin_page_sp);
  }
}

.footer {
  margin-top: calc(var(--margin_page) * 2);
  margin-bottom: var(--margin_page);
  font-size: var(--fontSize_small);

  & a {
    @apply --link;
  }

  @media (--mq_sp) {
    margin-top: calc(var(--margin_page_sp) * 2);
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

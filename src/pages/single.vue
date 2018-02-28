<template>
  <div>
    <article v-if="hasPost">
      <div class="top" :style="{height: topHeight}">
        <eyecatch-component class="eyecatch" :post="post" ref="eyecatch"></eyecatch-component>

        <header class="header" :style="titleStyle" ref="title">
          <h1 class="title" v-html="postTitle"></h1>
          <div class="info">
            <div class="date">{{post.date | moment}}</div>
            <ul v-if="hasCategories" class="categories">
              <li
                v-for="category in categories"
                :key="category.id"
                class="category"
                @click.stop="filter(category.id, category.name)"
              >
                <span>{{category.name}}</span>
              </li>
            </ul>
          </div>
        </header>
      </div>

      <content-component class="content" :class="{hidden: !isContentActive}" :data="post"></content-component>

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
import imagesLoaded from 'imagesloaded'
import EyecatchComponent from '@/components/Eyecatch.vue'
import ContentComponent from '@/components/Content.vue'
import ShareComponent from '@/components/Share.vue'
import NotFoundComponent from '@/components/NotFound.vue'
import { resizeManager } from '@/index'

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
      topHeight: 0,
      isContentActive: false,
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

    hasEyecatch() {
      return this.post.featured_media > 0
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

    titleOffset() {
      return this.$store.state.titleOffset > 0
        ? this.$store.state.titleOffset
        : ''
    },

    titleStyle() {
      let style

      if (this.hasEyecatch) {
        style = {
          position: 'absolute',
          top: this.titleOffset + 'px',
          marginTop: 0
        }
      } else {
        style = {
          marginTop: this.titleOffset + 'px'
        }
      }

      return style
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
      console.log('[single.vue - init]')
      this.setTopHeight()
      this.$store.commit('setPageTitle', this.post.title.rendered)

      if (this.hasCategories) {
        this.$store
          .dispatch('getAllCategoryName', this.post.categories)
          .then(result => {
            this.categories = result
          })
      }

      resizeManager.add('single.setTopHeight', this.setTopHeight.bind(this))
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

    async setPost(data, delay) {
      this.$store.commit('setCurrentPost', data)
      await new Promise(resolve => setTimeout(resolve, delay))
    },

    setTopHeight() {
      if (this.hasEyecatch) {
        const eyecatch = this.$refs.eyecatch.$el
        const imgLoad = imagesLoaded(eyecatch, { background: true })

        imgLoad.on('always', () => {
          const eyecatchHeight = this.$refs.eyecatch.$el.clientHeight
          const titleOffset = this.$refs.title.offsetTop
          const titleHeight = this.$refs.title.clientHeight

          if (eyecatchHeight >= titleOffset + titleHeight) {
            this.topHeight = eyecatchHeight + 'px'
          } else {
            this.topHeight = titleOffset + titleHeight + 'px'
          }

          this.isContentActive = true
        })
      } else {
        this.topHeight = 'auto'
        this.isContentActive = true
      }
    },

    filter(categoryId, categoryName) {
      this.$store.dispatch('filter', {
        categoryId: categoryId,
        categoryName: categoryName
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
      if (this.hasPost) {
        this.init()
        const res = await this.getPost(this.postId)
        // await this.setPost(res, 1)
      } else {
        let res
        if (!this.isPreview) {
          res = await this.getPost(this.postId)
        } else {
          const _res = await Promise.all([
            this.getPost(this.postId),
            this.getPostRevisions(this.postId)
          ])
          res = Object.assign(res[0], res[1])
        }
        await this.setPost(res, 1)
        this.init()
      }
    } catch (err) {
      console.error('[single.vue - mounted]', err)
      this.onNotFound()
    }
  },

  beforeRouteLeave(to, from, next) {
    resizeManager.remove('single.setTopHeight')
    next()
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
  background-color: var(--color_bg);
  top: var(--margin_top);
  margin-top: var(--margin_top);

  @media (--mq_sp) {
    top: var(--margin_top_sp);
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

  &.hidden {
    visibility: hidden;
  }

  @media (--mq_sp) {
    margin-top: var(--margin_page_sp);
  }
}

.footer {
  margin-top: calc(var(--margin_page) * 2);
  margin-bottom: var(--margin_page);
  font-size: var(--fontSize_small);
  font-weight: bold;

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

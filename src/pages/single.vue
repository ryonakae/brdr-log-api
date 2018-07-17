<template>
  <div>
    <article v-if="hasPost">
      <div class="top" :style="{height: topHeight}">
        <eyecatch-component class="eyecatch" :post="post" ref="eyecatch"></eyecatch-component>

        <header class="header" :style="titleStyle" ref="title">
          <div class="inner">
            <h1 class="title" v-html="postTitle"></h1>
            <div class="info">
              <div class="date">{{post.date | moment}}</div>
              <ul class="categories">
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
          </div>
        </header>
      </div>

      <content-component class="body" :class="{hidden: !isContentActive}" :data="post"></content-component>

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
import EyecatchComponent from '@/components/Eyecatch'
import ContentComponent from '@/components/Content'
import ShareComponent from '@/components/Share'
import NotFoundComponent from '@/components/NotFound'
import { resizer, viewportUnitsBuggyfill } from '@/index'

export default {
  components: {
    EyecatchComponent,
    ContentComponent,
    ShareComponent,
    NotFoundComponent
  },

  data () {
    return {
      categories: [],
      topHeight: 0,
      isContentActive: false,
      isNotFound: false
    }
  },

  computed: {
    client () {
      return this.$store.state.client
    },

    postId () {
      return this.$route.params.id
    },

    post () {
      return this.$store.state.currentPost
    },

    hasPost () {
      return Object.keys(this.post).length > 0
    },

    hasEyecatch () {
      return this.post.featured_media > 0
    },

    hasCategoriyNames () {
      return this.post.hasOwnProperty('_categories')
    },

    postTitle () {
      let title = this.post.title.rendered
      if (this.post.status === 'draft') {
        title = 'Draft: ' + this.post.title.rendered
      }
      return title
    },

    titleOffset () {
      return this.$store.state.titleOffset > 0
        ? this.$store.state.titleOffset
        : ''
    },

    titleStyle () {
      let style

      if (this.hasEyecatch) {
        style = {
          position: 'absolute',
          top: this.titleOffset + 'px',
          left: 0,
          right: 0,
          marginTop: 0
        }
      } else {
        style = {
          marginTop: this.titleOffset + 'px'
        }
      }

      return style
    },

    isPreview () {
      return window.wpSettings.is_preview
    }
  },

  filters: {
    moment (date) {
      return moment(date).format('YYYY.M.D')
    }
  },

  methods: {
    init () {
      console.log('[single - init]')

      // アイキャッチがある場合、viewportUnitsBuggyfillをrefreshする
      if (this.hasEyecatch) viewportUnitsBuggyfill.refresh()

      this.$store.commit('setPageTitle', this.post.title.rendered)
      this.getCategory()
      resizer.add('single.setTopHeight', this.setTopHeight.bind(this))
    },

    async getPost (id) {
      try {
        const res = await this.client.get('/posts/' + id, {
          params: { _embed: '' }
        })
        console.log('[single - getPost]', res.data)
        return res.data
      } catch (err) {
        throw new Error('[single - getPost]', err)
      }
    },

    async getPostRevisions (id) {
      try {
        const res = await this.client.get('/posts/' + id + '/revisions')
        console.log('[single - getPostRevisions]', res.data)
        return res.data
      } catch (err) {
        throw new Error('[single - getPostRevisions]', err)
      }
    },

    async getCategory () {
      console.log('[single - getCategory]')
      // indexから遷移した時、this.post._categoryにカテゴリの情報がすでに入っているので、それを使う
      if (this.hasCategoriyNames) {
        this.categories = this.post._categories
      } else {
        const res = await this.$store.dispatch(
          'getAllCategoryName',
          this.post.categories
        )
        this.categories = res
      }
    },

    async setTopHeight () {
      if (this.hasEyecatch) {
        console.log('[single - setTopHeight] has eyecatch')
        const imgLoad = imagesLoaded(this.$refs.eyecatch.$el, {
          background: true
        })
        await new Promise(resolve => imgLoad.on('always', resolve))
        const eyecatchHeight = this.$refs.eyecatch.$el.clientHeight
        const titleOffset = this.$refs.title.offsetTop
        const titleHeight = this.$refs.title.clientHeight
        if (eyecatchHeight >= titleOffset + titleHeight) {
          this.topHeight = eyecatchHeight + 'px'
        } else {
          this.topHeight = titleOffset + titleHeight + 'px'
        }
        this.isContentActive = true
      } else {
        console.log('[single - setTopHeight] no eyecatch')
        this.topHeight = 'auto'
        this.isContentActive = true
      }
    },

    filter (categoryId, categoryName) {
      this.$store.dispatch('filter', {
        categoryId: categoryId,
        categoryName: categoryName
      })
    },

    onNotFound () {
      this.isNotFound = true
      this.$store.commit('setPageTitle', 'Page Not Found')
      this.$store.commit('changeIsLoading', false)
    }
  },

  async mounted () {
    if (this.hasPost) return this.init()

    try {
      let res
      if (!this.isPreview) {
        res = await this.getPost(this.postId)
      } else {
        const _res = await Promise.all([
          this.getPost(this.postId),
          this.getPostRevisions(this.postId)
        ])
        res = Object.assign(_res[0], _res[1])
      }
      this.$store.commit('setCurrentPost', { data: res })

      await new Promise(resolve => setTimeout(resolve, 10))
      this.init()
    } catch (err) {
      console.error('[single - mounted]', err)
      this.onNotFound()
    }
  },

  beforeRouteLeave (to, from, next) {
    resizer.remove('single.setTopHeight')
    next()
  }
}
</script>

<style scoped>
@import 'config.css';

.header {
  max-width: calc(var(--width_content) + var(--margin_title) * 2);
  top: var(--margin_top);
  margin-top: var(--margin_top);
  margin-left: auto;
  margin-right: auto;

  @media (--mq_sp) {
    top: var(--margin_top_sp);
    margin-top: var(--margin_top_sp);
  }

  & .inner {
    @apply --header;
    background-color: var(--color_bg);
    display: inline-block;
  }
}

.title {
  @apply --title;
}

.info {
  @apply --info;
}

.body {
  margin-top: calc(var(--margin_page) * 1.5);

  @media (--mq_sp) {
    margin-top: calc(var(--margin_page_sp) * 1.5);
  }

  &.hidden {
    visibility: hidden;
  }
}

.footer {
  margin-top: calc(var(--margin_page) * 2);
  margin-bottom: var(--margin_page);
  margin-left: var(--margin_page);
  font-size: var(--fontSize_small);

  & a {
    @apply --link;
  }

  @media (--mq_sp) {
    margin-top: calc(var(--margin_page_sp) * 2);
    margin-bottom: var(--margin_page_sp);
    margin-left: var(--margin_page_sp);
  }
}

.share,
.back {
  display: inline-block;
}

.back {
  margin-left: 1.5em;
}
</style>

<template>
  <div v-if="hasPosts" class="page" ref="page">
    <post-item-component class="post" v-for="post in posts" :key="post.id" :post="post"></post-item-component>
  </div>
</template>

<script>
import PostItemComponent from '@/components/PostItem.vue'
import { scrollManager } from '@/index'

export default {
  components: {
    PostItemComponent
  },

  data() {
    return {
      isScrolling: false
    }
  },

  computed: {
    client() {
      return this.$store.state.client
    },
    posts() {
      return this.$store.state.allPosts
    },
    hasPosts() {
      return this.posts.length > 0
    },
    perPage() {
      return this.$store.state.perPage
    },
    loadedPost() {
      return this.$store.state.loadedPost
    },
    isFontLoaded() {
      return this.$store.state.isFontLoaded
    },
    params() {
      return {
        _embed: '',
        per_page: this.perPage,
        offset: this.posts.length,
        status: window.wpSettings.is_logged_in ? 'any' : 'publish'
      }
    }
  },

  watch: {
    loadedPost() {
      this.checkLoad()
    },
    isFontLoaded() {
      this.checkLoad()
    }
  },

  methods: {
    async getPosts(params) {
      console.log('[index.vue - getPosts]', params)

      try {
        const res = await this.client.get('/posts', { params: params })
        this.$store.commit('setAllPosts', this.posts.concat(res.data))
        console.log('[index.vue - getPosts]', this.posts)
        return res.data
      } catch (err) {
        console.error('[index.vue - getPosts]', err)
      }
    },

    async getMorePosts(params) {
      try {
        const _params = Object.assign(params, { offset: this.posts.length })
        const res = await this.getPosts(_params)
        console.log('[index.vue - onScroll]', res)
        this.isScrolling = false
        if (res.length === 0) scrollManager.remove('index.onScroll')
      } catch (err) {
        console.error('[index.vue - onScroll]', err)
      } finally {
        this.checkLoad()
      }
    },

    async onScroll() {
      const documentHeight = document.body.clientHeight
      console.log(
        '[index.vue - onScroll]',
        'scrollBottom:',
        scrollManager.scrollBottom,
        'documentHeight:',
        documentHeight
      )

      if (scrollManager.scrollBottom > documentHeight * 0.7) {
        if (this.isScrolling) return
        this.isScrolling = true
        this.$store.commit('changeIsLoading', true)
        this.getMorePosts(this.params)
      }
    },

    checkLoad() {
      console.log(
        '[index.vue - checkLoad] start check',
        this.isFontLoaded,
        this.posts.length,
        this.loadedPost
      )

      // webフォントがロードされて、loadedCountが記事数と同じになった時の処理
      if (this.isFontLoaded && this.posts.length === this.loadedPost) {
        console.log('[index.vue - checkLoad] all webfont and postitem loaded')
        this.$store.commit('changeIsLoading', false)
      }
    }
  },

  mounted() {
    console.log('[index.vue - mounted] route', this.$route)
    this.$store.commit('changeIsLoading', true)
    this.$store.commit('setCurrentPost', {})
    this.$store.commit('setPageTitle', '')
    this.getPosts(this.params)
    scrollManager.add('index.onScroll', () => {
      this.onScroll()
    })
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      // プレビュー時、かつ /?p=[id]&preview=true というクエリがある場合は、singleに遷移する
      // 遷移時にp(id)を渡す
      const query = vm.$route.query
      if (window.wpSettings.is_preview && Object.keys(query).length > 0) {
        if (Object.keys(query.p).length > 0 && query.preview) {
          vm.$router.replace({ path: '/post/' + query.p })
        }
      }
    })
  },

  beforeRouteLeave(to, from, next) {
    this.$store.commit('resetLoadedPost')
    scrollManager.remove('index.onScroll')
    next()
  }
}
</script>

<style scoped>
@import 'config.css';

.page {
  @apply --content;
  margin-top: var(--margin_top);
  margin-bottom: calc(var(--margin_bottom) + var(--margin_page) + 1em);

  @media (--mq_sp) {
    margin-top: var(--margin_top_sp);
    margin-bottom: calc(var(--margin_bottom_sp) + var(--margin_page_sp) + 1em);
  }
}

.post {
  margin-top: 3em;

  &:first-child {
    margin-top: 0;
  }
}
</style>

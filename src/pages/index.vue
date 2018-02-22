<template>
  <div v-if="hasPosts" class="index" ref="page">
    <div
      class="post"
      v-for="post in posts"
      :key="post.id"
      @mouseenter="preloadPost(post)"
      @touchstart="preloadPost(post)"
    >
      <post-item-component :post="post"></post-item-component>
    </div>
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
      posts: [],
      isScrolling: false
    }
  },

  computed: {
    client() {
      return this.$store.state.client
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
    isUserLoggedIn() {
      return window.wpSettings.is_logged_in
    },
    isPreview() {
      return window.wpSettings.is_preview
    },
    isFontLoaded() {
      return this.$store.state.isFontLoaded
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
    async getPosts() {
      let params = {
        _embed: '',
        per_page: this.perPage,
        offset: this.posts.length,
        status: this.isUserLoggedIn ? 'any' : 'publish'
      }
      if (this.$route.name === 'category') {
        params = Object.assign(params, { categories: this.$route.params.id })
      }

      try {
        const res = await this.client.get('/posts', { params: params })
        this.posts = this.posts.concat(res.data)
        console.log('[index.vue - getPosts]', this.posts, params)
        return res.data
      } catch (err) {
        console.error('[index.vue - getPosts]', err)
      }
    },

    async getMorePosts() {
      try {
        const res = await this.getPosts()
        console.log('[index.vue - onScroll]', res)
        this.isScrolling = res.length < 1
      } catch (err) {
        console.error('[index.vue - onScroll]', err)
        this.isScrolling = true
      } finally {
        this.checkLoad()
      }
    },

    onScroll() {
      const documentHeight = document.body.clientHeight

      if (scrollManager.scrollBottom > documentHeight * 0.7) {
        if (this.isScrolling) return

        this.isScrolling = true
        this.$store.dispatch('loading', { status: 'start', wait: 0 })
        this.getMorePosts()
      }
    },

    preloadPost(post) {
      console.log('[index.vue - preloadPost]')
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
        this.$store.dispatch('loading', { status: 'end', wait: 300 })
      }
    }
  },

  mounted() {
    console.log('[index.vue - mounted] route', this.$route)

    // loadedPostをリセット
    this.$store.dispatch('changeloadedPost', 'reset')

    // ローディング開始
    this.$store.dispatch('loading', { status: 'start', wait: 0 })

    // ページタイトルを変更
    this.$store.dispatch('changeTitle', '')

    // 記事一覧を取得
    this.getPosts()

    // scrollManagerにonScroll関数を追加
    scrollManager.add('index.onScroll', () => {
      this.onScroll()
    })
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      // プレビュー時、かつ /?p=[id]&preview=true というクエリがある場合は、singleに遷移する
      // 遷移時にp(id)を渡す
      const query = vm.$route.query

      if (vm.isPreview && Object.keys(query).length > 0) {
        if (Object.keys(query.p).length > 0 && query.preview) {
          vm.$router.replace({ path: '/post/' + query.p })
        }
      }
    })
  },

  beforeRouteLeave(to, from, next) {
    scrollManager.remove('index.onScroll')
    next()
  }
}
</script>

<style scoped>
@import 'properties.css';
@import 'media.css';

.index {
  max-width: var(--width_content);
  padding-top: var(--margin_top);
  margin: 0 var(--margin_page)
    calc(var(--margin_bottom) + var(--margin_page) + 1em);

  @media (--mq_sp) {
    padding-top: var(--margin_top_sp);
    margin: 0 var(--margin_page_sp);
  }
}

.post {
  margin-top: 3em;

  &:first-child {
    margin-top: 0;
  }
}
</style>

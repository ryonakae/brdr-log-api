<template>
  <div v-if="hasPosts" class="index" ref="page">
    <div class="post" v-for="post in posts" :key="post.id" @mouseenter="preloadPost(post)" @touchstart="preloadPost(post)">
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
    loadedPostCount() {
      return this.$store.state.loadedPostCount
    },
    isUserLoggedIn() {
      return this.$store.state.isUserLoggedIn
    },
    isPreview() {
      return this.$store.state.isPreview
    },
    isWebfontLoaded() {
      return this.$store.state.isWebfontLoaded
    }
  },

  watch: {
    loadedPostCount() {
      this.checkLoad()
    },

    isWebfontLoaded() {
      this.checkLoad()
    }
  },

  methods: {
    getPosts(params) {
      return new Promise((resolve, reject) => {
        const _params = Object.assign(params, {
          _embed: '',
          status: this.isUserLoggedIn ? 'any' : 'publish'
        })

        this.client
          .get('/posts', { params: _params })
          .then(res => {
            console.log('[index.vue - getPosts]', res.data)
            resolve(res.data)
          })
          .catch(err => {
            console.error('[index.vue - getPosts]', err)
            reject(err)
          })
      })
    },

    onScroll(params) {
      const documentHeight = document.body.clientHeight

      if (scrollManager.scrollBottom > documentHeight * 0.7) {
        if (this.isScrolling) return

        this.isScrolling = true
        this.$store.dispatch('loading', { status: 'start', wait: 0 })

        // offsetかけてgetPosts
        const _params = Object.assign(params, { offset: this.posts.length })
        this.getPosts(_params)
          .then(res => {
            this.posts = this.posts.concat(res)
            console.log('[index.vue - onScroll]', this.posts)
            this.isScrolling = res.length < 1
          })
          .catch(err => {
            console.error('[index.vue - onScroll]', err)
            this.isScrolling = true
          })
      }
    },

    preloadPost(post) {
      console.log('[index.vue - preloadPost]')
    },

    checkLoad() {
      // webフォントがロードされて、loadedCountが記事数と同じになった時の処理
      if (this.isWebfontLoaded && this.posts.length === this.loadedPostCount) {
        console.log('all webfont and postitem loaded')
        this.$store.dispatch('loading', { status: 'end', wait: 300 })
      }
    }
  },

  mounted() {
    // loadedPostCountをリセット
    this.$store.dispatch('changeLoadedPostCount', 'reset')

    // ローディング開始
    this.$store.dispatch('loading', { status: 'start', wait: 0 })

    // ページタイトルを変更
    this.$store.dispatch('changeTitle', '')

    // 記事一覧を取得
    this.getPosts({
      per_page: this.perPage,
      offset: 0
    }).then(res => {
      this.posts = res
    })

    // scrollManagerにonScroll関数を追加
    scrollManager.add('index.onScroll', () => {
      this.onScroll({ per_page: this.perPage })
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

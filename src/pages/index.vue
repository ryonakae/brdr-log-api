<template>
  <div v-if="hasPosts" class="index" ref="page">
    <div v-for="post in posts" :key="post.id" class="post" @mouseenter="setCurrentPost(post)" @mouseleave="clearCurrentPost" @touchstart="setCurrentPost(post)" @touchend="clearCurrentPost">
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

  computed: {
    posts() {
      return this.$store.state.allPostData
    },

    hasPosts() {
      return this.posts.length > 0
    },

    perPage() {
      return this.$store.state.perPage
    },

    isPreview() {
      return this.$store.state.isPreview
    },

    isWebfontLoaded() {
      return this.$store.state.isWebfontLoaded
    }
  },

  watch: {
    isWebfontLoaded() {
      this.checkLoad()
    }
  },

  methods: {
    setCurrentPost(post) {
      if (this.$route.path === '/') {
        this.$store.dispatch('setCurrentPost', post)
      }
    },

    clearCurrentPost() {
      if (this.$route.path === '/') {
        this.$store.dispatch('clearCurrentPost')
      }
    },

    checkLoad() {
      // webフォントがロードされた時の処理
      if (this.isWebfontLoaded) {
        console.log('all webfont loaded')
        this.$store.dispatch('loading', { status: 'end', wait: 300 })
      }
    },

    init() {
      this.$store.dispatch('loading', { status: 'start', wait: 0 }).then(() => {
        this.$store.dispatch('createIndex', {
          per_page: this.perPage,
          offset: 0
        })
      })
    }
  },

  mounted() {
    // ページタイトルを変更
    this.$store.dispatch('changeTitle', '')

    // currentPostDataを空にする
    this.clearCurrentPost()

    // loadedPostCountをリセット
    this.$store.dispatch('changeLoadedPostCount', 'reset')

    this.init()
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
    scrollManager.remove('index.infiniteScroll')
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

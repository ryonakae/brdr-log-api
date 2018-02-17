<template>
  <div :class="$style.page" ref="page">
    <ul v-if="hasPosts">
      <li v-for="post in posts" :key="post.id" :class="[$style.post, {[$style.eyecatch]: checkHasEyecatch(post)}]" @mouseenter="setCurrentPost(post)" @mouseleave="clearCurrentPost" @touchstart="setCurrentPost(post)" @touchend="clearCurrentPost">
        <post-item-component :post="post"></post-item-component>
      </li>
    </ul>
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

    loadedPostCount() {
      return this.$store.state.loadedPostCount
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
      // webフォントがロードされて、loadedCountが記事数と同じになった時の処理
      if (this.isWebfontLoaded && this.posts.length === this.loadedPostCount) {
        console.log('all webfont and postitem loaded')
        this.$store.dispatch('loading', { status: 'end', wait: 300 })
      }
    },

    init() {
      // allPostDataがある(一度indexを表示した時)ときは、通信せずにallPostDataをそのまま使う
      if (this.hasPosts) {
        console.log('allPostData already exsist')
        this.$store.dispatch('loading', { status: 'end', wait: 0 })
      } else {
        this.$store
          .dispatch('loading', { status: 'start', wait: 0 })
          .then(() => {
            this.$store.dispatch('createIndex', {
              per_page: this.perPage,
              offset: 0
            })
          })
      }
    },

    checkHasEyecatch(post) {
      return post.featured_media > 0
    }
  },

  created() {
    // ページタイトルを変更
    this.$store.dispatch('changeTitle', '')

    // currentPostDataを空にする
    this.clearCurrentPost()

    // loadedPostCountをリセット
    this.$store.dispatch('changeLoadedPostCount', 'reset')
  },

  mounted() {
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

<style module>
@import 'properties.css';
@import 'media.css';

.page {
  max-width: var(--width_index);
  padding-top: var(--margin_top);
  margin: 0 auto;

  @media (--mq_sp) {
    padding-top: var(--margin_top_sp);
  }
}

.post {
  margin-top: 75px;

  &:first-child {
    margin-top: 0;
  }

  @media (--mq_sp) {
    margin-top: 45px;
  }
}

@media (--mq_sp) {
  .post.eyecatch + .post.eyecatch {
    margin-top: -1px;
  }
}
</style>

<template>
  <div :class="$style.page" ref="page">
    <ul v-if="hasPosts">
      <li v-for="post in posts" :key="post.id" :class="$style.post" @mouseenter="setCurrentPost(post)" @mouseleave="clearCurrentPost" @touchstart="setCurrentPost(post)" @touchend="clearCurrentPost">
        <post-item-component :post="post"></post-item-component>
      </li>
    </ul>
  </div>
</template>

<script>
import PostItemComponent from '@/components/PostItem.vue'
import {scrollManager} from '@/index'

export default {
  components: {
    PostItemComponent
  },

  computed: {
    siteUrl () {
      return this.$store.state.siteUrl
    },

    posts () {
      return this.$store.state.allPostData
    },

    hasPosts () {
      return this.posts.length > 0
    },

    perPage () {
      return this.$store.state.perPage
    },

    loadedPostItem () {
      return this.$store.state.loadedPostItem
    },

    isPreview () {
      return this.$store.state.isPreview
    }
  },

  watch: {
    // loadedPostItemの数が変わるたびにcheckOnLoad関数を実行する
    loadedPostItem () {
      this.checkOnLoad()
    }
  },

  methods: {
    setCurrentPost (post) {
      if (this.$route.path === '/') {
        this.$store.dispatch('setCurrentPost', post)
      }
    },

    clearCurrentPost () {
      if (this.$route.path === '/') {
        this.$store.dispatch('clearCurrentPost')
      }
    },

    checkOnLoad () {
      // loadedCountが記事数と同じになったらlogoのローディング終了
      if (this.posts.length === this.loadedPostItem) {
        console.log('all postitem loaded')
        this.$store.dispatch('logoLoading', {boolean: false, wait: 300})

        // isLoadedFirstをtrueにする
        if (!this.$store.state.isLoadedFirst) this.$store.dispatch('changeIsLoadedFirst', true)
      }
    },

    init () {
      // allPostDataがある(一度indexを表示した時)ときは、通信せずにallPostDataをそのまま使う
      // allPostDataがない時だけgetAllPostsする
      if (!this.hasPosts) {
        this.$store.dispatch('createIndex', {per_page: this.perPage, offset: 0})
      } else {
        console.log('allPostData already exsist')
        // 既に全記事がロードされているので、loadedPostItemは変化しない→watchが動かない
        // なので、手動でcheckOnLoad関数を実行する
        this.checkOnLoad()
      }
    }
  },

  created () {
    // ページタイトルを変更
    this.$store.dispatch('changeTitle', '')

    // currentPostDataを空にする
    this.clearCurrentPost()

    // loadedPostItemをリセット
    this.$store.dispatch('changeLoadedPostItem', 'reset')

    // logoのローディング開始
    this.$store.dispatch('logoLoading', {boolean: true, wait: 0})
  },

  mounted () {
    this.init()
  },

  beforeRouteEnter (to, from, next) {
    next((vm) => {
      // プレビュー時、かつ /?p=[id]&preview=true というクエリがある場合は、singleに遷移する
      // 遷移時にp(id)を渡す
      const query = vm.$route.query

      if (vm.isPreview && Object.keys(query).length > 0) {
        if (Object.keys(query.p).length > 0 && query.preview) {
          vm.$router.replace({path: '/post/' + query.p})
        }
      }
    })
  },

  beforeRouteLeave (to, from, next) {
    scrollManager.remove('index.infiniteScroll')
    next()
  }
}
</script>

<style module>
@import "properties.css";
@import "media.css";

.page {
  max-width: var(--width_index);
  padding: var(--margin_top) 0 var(--margin_bottom);
  margin: 0 auto;

  @media (--mq_sp) {
    padding: var(--margin_top_sp) 0 var(--margin_bottom_sp);
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
</style>

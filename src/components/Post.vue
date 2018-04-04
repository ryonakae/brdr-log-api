<template>
  <div
    class="post"
    :class="{active: isLoaded, highlight: isEnter}"
    @click.once.stop="setTitleOffset"
  >
    <router-link :to="'/post/'+post.id" tag="div">
      <div
        @mouseenter.stop="onEnter"
        @mouseleave.stop="onLeave"
        @touchstart.stop="onEnter"
        @touchend.stop="onLeave"
      >
        <eyecatch-component class="eyecatch" :post="post" ref="eyecatch"></eyecatch-component>
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
    </router-link>
  </div>
</template>

<script>
import moment from 'moment'
import imagesLoaded from 'imagesloaded'
import EyecatchComponent from '@/components/Eyecatch'
import { viewportUnitsBuggyfill } from '@/index'
import { utils } from '@/index'

export default {
  components: {
    EyecatchComponent
  },

  props: ['post'],

  data() {
    return {
      categories: [],
      isLoaded: false,
      isEnter: false
    }
  },

  computed: {
    leaveDelay() {
      return utils.getDevice() === 'mobile' ? 150 : 0
    },

    hasEyecatch() {
      return this.post.featured_media > 0
    },

    postTitle() {
      let title

      if (this.post.status === 'draft') {
        title = 'Draft: ' + this.post.title.rendered
      } else {
        title = this.post.title.rendered
      }

      return title
    }
  },

  filters: {
    moment(date) {
      return moment(date).format('YYYY.M.D')
    }
  },

  methods: {
    async init() {
      const res = await this.$store.dispatch(
        'getAllCategoryName',
        this.post.categories
      )
      this.categories = res
      this.$store.commit('incrementLoadedPost')
      this.isLoaded = true
    },

    onEnter() {
      console.log('[PostItem - onEnter] start', this.$route.path)
      // singleでclickイベントが発火してしまう対策
      if (this.$route.path !== '/') return

      // アイキャッチがある場合、viewportUnitsBuggyfillをrefreshする
      if (this.hasEyecatch) viewportUnitsBuggyfill.refresh()

      // currentPostにgetCategoryで取得したカテゴリー情報を格納する
      // singleに遷移した時にカテゴリーを再度取得するのを避けるため
      this.$store.commit('setCurrentPost', {
        data: this.post,
        categories: this.categories
      })

      // serviceWorkerが有効な場合、preloadImagesを実行
      if ('serviceWorker' in navigator) this.preloadImages()

      this.isEnter = true
      console.log('[PostItem - onEnter] done', this.$store.state.currentPost)
    },

    async onLeave() {
      // singleに遷移する時にアイキャッチが一瞬消えてしまいチラついて見えるので、
      // currentPostをクリアするのを少しだけ遅らせる（SPだけ）
      // すでにsingleに遷移している場合はクリアしない
      await new Promise(resolve => setTimeout(resolve, this.leaveDelay))
      console.log(this.leaveDelay)

      console.log('[PostItem - onLeave] start', this.$route.path)
      if (this.$route.path !== '/') return

      this.$store.commit('setCurrentPost', { data: {} })
      this.isEnter = false
      console.log('[PostItem - onLeave] done', this.$store.state.currentPost)
    },

    async preloadImages() {
      // httpsの画像だけ配列に追加する
      const regexp = /https:\/\/.*\/.*\.(jpg|jpeg|gif|png)/g
      const imgArray = this.post.content.rendered.match(regexp)

      // 配列に画像が1つ以上入っている場合、serviceWorkerのキャッシュに画像を追加
      if (!Array.isArray(imgArray)) return

      try {
        console.log('[PostItem - preloadImages]', imgArray)
        const cache = await window.caches.open('brdr-log-images')
        await cache.addAll(imgArray)
        console.log('[PostItem - preloadImages] Cache success')
      } catch (err) {
        console.log('[PostItem - preloadImages]', err)
      }
    },

    setTitleOffset(e) {
      const offset = e.currentTarget.offsetTop - window.pageYOffset
      this.$store.commit('setTitleOffset', offset)
    },

    filter(categoryId, categoryName) {
      this.$store.dispatch('filter', {
        categoryId: categoryId,
        categoryName: categoryName
      })
    }
  },

  async mounted() {
    try {
      if (this.hasEyecatch) {
        const imgLoad = imagesLoaded(this.$refs.eyecatch.$el, {
          background: true
        })
        await new Promise(resolve => imgLoad.on('always', resolve))
      }
      return
    } catch (err) {
      console.log(err)
    } finally {
      this.init()
    }
  }
}
</script>

<style scoped>
@import 'config.css';

.post {
  @apply --header;

  margin-left: -var(--margin_title);
  margin-right: -var(--margin_title);
  position: relative;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  display: inline-block;
  cursor: pointer;
  color: var(--color_sub);
  pointer-events: none;

  &.active {
    color: inherit;
    pointer-events: auto;
  }

  &.highlight {
    background-color: var(--color_bg);
  }
}

.eyecatch {
  display: none;
}

.title {
  @apply --title;
}

.info {
  @apply --info;
}
</style>

<template>
  <div
    class="post"
    :class="{active: isPostItemLoaded}"
    @click="setTitleOffset"
    @mouseenter="setCurrentPost"
    @mouseleave="clearCurrentPost"
    @touchstart="setCurrentPost"
    @touchend="clearCurrentPost"
  >
    <router-link :to="'/post/'+post.id" tag="div">
      <eyecatch-component class="eyecatch" :post="post" ref="eyecatch"></eyecatch-component>
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
    </router-link>
  </div>
</template>

<script>
import moment from 'moment'
import imagesLoaded from 'imagesloaded'
import { scrollManager } from '@/index'
import EyecatchComponent from '@/components/Eyecatch.vue'

export default {
  components: {
    EyecatchComponent
  },

  props: ['post'],

  data() {
    return {
      categories: [],
      isPostItemLoaded: false
    }
  },

  computed: {
    hasCategories() {
      return this.post.categories.length >= 1
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

  methods: {
    init() {
      this.$store.commit('incrementLoadedPost')
      this.isPostItemLoaded = true

      if (this.hasCategories) {
        this.$store
          .dispatch('getAllCategoryName', this.post.categories)
          .then(result => {
            this.categories = result
          })
      }
    },

    filter(categoryId, categoryName) {
      this.$store.dispatch('filter', {
        categoryId: categoryId,
        categoryName: categoryName,
        transition: false
      })
    },

    setCurrentPost() {
      console.log('[PostItem.vue - setCurrentPost]', this.post)
      this.$store.commit('setCurrentPost', this.post)
      // serviceWorkerが有効な場合、preloadImagesを実行
      if ('serviceWorker' in navigator) this.preloadImages()
    },

    clearCurrentPost() {
      console.log('[PostItem.vue - clearCurrentPost]')
      this.$store.commit('setCurrentPost', {})
    },

    async preloadImages() {
      // httpsの画像だけ配列に追加する
      const regexp = /https:\/\/.*\/.*\.(jpg|jpeg|gif|png)/g
      const imgArray = this.post.content.rendered.match(regexp)

      // 配列に画像が1つ以上入っている場合、serviceWorkerのキャッシュに画像を追加
      if (!Array.isArray(imgArray)) return

      try {
        console.log('[PostItem.vue - preloadImages]', imgArray)
        const cache = await window.caches.open('brdr-log-images')
        await cache.addAll(imgArray)
        console.log('[PostItem.vue - preloadImages] Cache success')
      } catch (err) {
        console.log('[PostItem.vue - preloadImages]', err)
      }
    },

    setTitleOffset(e) {
      const offset = e.currentTarget.offsetTop - window.pageYOffset
      this.$store.commit('setTitleOffset', offset)
    }
  },

  filters: {
    moment(date) {
      return moment(date).format('YYYY.M.D')
    }
  },

  mounted() {
    if (this.hasEyecatch) {
      const imgLoad = imagesLoaded(this.$refs.eyecatch.$el, {
        background: true
      })
      console.log('[PostItem.vue - mounted]', imgLoad)
      imgLoad.on('always', this.init)
    } else {
      this.init()
    }
  }
}
</script>

<style scoped>
@import 'config.css';

.post {
  display: inline-block;
  cursor: pointer;
  color: var(--color_sub);
  pointer-events: none;

  &.active {
    color: inherit;
    pointer-events: auto;
  }

  @nest :global(body.pc) &:hover {
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

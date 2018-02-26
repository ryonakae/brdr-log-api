<template>
  <div
    class="post"
    :class="{active: isPostItemLoaded}"
    @mouseenter="setCurrentPost"
    @mouseleave="clearCurrentPost"
    @touchstart="setCurrentPost"
    @touchend="clearCurrentPost"
  >
    <router-link :to="'/post/'+post.id" tag="div">
      <img v-if="hasEyecatch" class="eyecatch" :src="eyecatch" ref="eyecatch">
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

export default {
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

    eyecatch() {
      let eyecatch

      if (
        Object.keys(
          this.post._embedded['wp:featuredmedia'][0].media_details.sizes
        ).length > 0
      ) {
        eyecatch = this.post._embedded['wp:featuredmedia'][0].media_details
          .sizes.theme_eyecatch.source_url
      } else {
        eyecatch = this.post._embedded['wp:featuredmedia'][0].source_url
      }

      return eyecatch
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
      this.preloadPost()
    },

    clearCurrentPost() {
      console.log('[PostItem.vue - clearCurrentPost]')
      this.$store.commit('setCurrentPost', {})
    },

    preloadPost() {
      const imgArray = this.post.content.rendered.match(
        /(https?):\/\/.*\/.*\.(jpg|jpeg|gif|png)/g
      )
      if (Array.isArray(imgArray)) {
        console.log('[PostItem.vue - preloadPost]', imgArray)
      }
    }
  },

  filters: {
    moment(date) {
      return moment(date).format('YYYY.M.D')
    }
  },

  mounted() {
    if (this.hasEyecatch) {
      const imgLoad = imagesLoaded(this.$refs.eyecatch)
      console.log('[PostItem.vue - mounted]', imgLoad)
      return imgLoad.on('always', this.init)
    }

    this.init()
  }
}
</script>

<style scoped>
@import 'config.css';

.post {
  cursor: pointer;
  color: var(--color_sub);
  pointer-events: none;

  &.active {
    color: inherit;
    pointer-events: auto;
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

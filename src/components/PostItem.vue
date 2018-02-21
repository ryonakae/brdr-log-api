<template>
  <router-link class="post" :class="{active: isPostItemLoaded}" :to="'/post/'+post.id" tag="div">
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
          {{category.name}}
        </li>
      </ul>
    </div>
  </router-link>
</template>

<script>
import moment from 'moment'

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
    },

    isFontLoaded() {
      return this.$store.state.isFontLoaded
    }
  },

  methods: {
    init() {
      // PostItemがロードされたらloadedPostを1up
      this.$store.dispatch('changeloadedPost', 'increment')
      this.isPostItemLoaded = true
    },

    filter(categoryId, categoryName) {
      this.$store.dispatch('filter', {
        categoryId: categoryId,
        categoryName: categoryName,
        transition: false
      })
    }
  },

  filters: {
    moment(date) {
      return moment(date).format('YYYY.M.D')
    }
  },

  mounted() {
    this.init()

    // カテゴリがある場合はカテゴリ取得
    if (this.hasCategories) {
      this.$store
        .dispatch('getAllCategoryName', this.post.categories)
        .then(result => {
          this.categories = result
        })
    }
  }
}
</script>

<style scoped>
@import 'properties.css';
@import 'property-sets.css';
@import 'media.css';

.post {
  cursor: pointer;
}

.title {
  margin: 0;
  font-size: var(--fontSize_h1);

  @media (--mq_sp) {
    font-size: var(--fontSize_h1_sp);
  }
}

.info {
  @apply --info;

  margin-top: 1.7em;
}
</style>

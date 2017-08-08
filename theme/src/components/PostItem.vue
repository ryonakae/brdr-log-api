<template>
  <!-- アイキャッチがある -->
  <router-link v-if="hasEyecatch" :to="'/post/'+post.id" tag="div" :class="[$style.post, $style.eyecatch]" ref="post">
    <div :class="$style.bg">
      <div :class="$style.image" :style="{backgroundImage:'url('+eyecatch+')'}" ref="image"></div>
      <div :class="$style.overlay" ref="overlay"></div>
    </div>

    <div :class="$style.text">
      <h1 :class="$style.title" v-html="postTitle"></h1>
      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
        <ul v-if="hasCategories" :class="$style.categories">
          <li v-for="category in categories" :key="category.id" :class="$style.category" @click.stop="filterByCategory(category.id, category.name)">{{category.name}}</li>
        </ul>
      </div>
    </div>
  </router-link>

  <!-- アイキャッチがない -->
  <router-link v-else :to="'/post/'+post.id" tag="div" :class="[$style.post, $style.noeyecatch]">
    <div :class="$style.text">
      <h1 :class="$style.title" v-html="postTitle"></h1>
      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
        <ul v-if="hasCategories" :class="$style.categories">
          <li v-for="category in categories" :key="category.id" :class="$style.category" @click.stop="filterByCategory(category.id, category.name)">{{category.name}}</li>
        </ul>
      </div>
    </div>
  </router-link>
</template>

<script>
import {util} from '../'
import moment from 'moment'
import imagesLoaded from 'imagesloaded'

export default {
  props: ['post'],

  data () {
    return {
      categories: []
    }
  },

  computed: {
    hasCategories () {
      return this.post.categories.length >= 1
    },

    hasEyecatch () {
      return this.post.featured_media > 0
    },

    eyecatch () {
      let eyecatch

      if (Object.keys(this.post._embedded['wp:featuredmedia'][0].media_details.sizes).length > 0) {
        eyecatch = this.post._embedded['wp:featuredmedia'][0].media_details.sizes.theme_thumbnail.source_url
      } else {
        eyecatch = this.post._embedded['wp:featuredmedia'][0].source_url
      }

      return eyecatch
    },

    postTitle () {
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
    onLoad () {
      // PostItemがロードされたらloadedPostItemを1up
      this.$store.dispatch('changeLoadedPostItem', 'increment')
    },

    filterByCategory (categoryId, categoryName) {
      this.$store.dispatch('filterByCategory', {categoryId: categoryId, categoryName: categoryName, transition: false})
    }
  },

  filters: {
    moment (date) {
      return moment(date).format('YYYY.M.D')
    }
  },

  mounted () {
    // カテゴリがある場合はカテゴリ取得
    if (this.hasCategories) {
      this.$store.dispatch('getAllCategoryName', this.post.categories)
        .then((result) => {
          this.categories = result
        })
    }

    // アイキャッチがある時
    if (this.hasEyecatch) {
      const $post = this.$refs.post.$el
      const $image = this.$refs.image
      const $overlay = this.$refs.overlay

      imagesLoaded($post, {background: true}, () => {
        util.wait(10).then(() => {
          $image.classList.add(this.$style.ready)
          $overlay.classList.add(this.$style.ready)
          this.onLoad()
        })
      })
    } else {
      // アイキャッチがないとき
      util.wait(10).then(() => {
        this.onLoad()
      })
    }
  }
}
</script>

<style module>
@import "properties";
@import "propertySets";
@import "media";

.post {
  position: relative;
  cursor: pointer;

  & .text {
    max-width: var(--width_content);
    margin: 0 auto;

    @media (--mq_sp) {
      margin: 0 var(--margin_page_sp);
    }
  }

  & .title {
    font-size: var(--fontSize_h1);
    transition: all var(--duration_quick) var(--easing);

    @media (--mq_sp) {
      font-size: var(--fontSize_h1_sp);
    }
  }

  & .info {
    @apply --info;

    margin-top: 25px;

    @media (--mq_sp) {
      margin-top: 15px;
    }
  }
}

.post.noeyecatch {
  @nest :global(body.pc) & {
    &:hover {
      & .title {
        opacity: 0.7;
      }
    }
  }
}

.post.eyecatch {
  padding: 0;

  & .bg {
    border: 1px solid var(--color_key);
    background-color: var(--color_key);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  & .image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    z-index: 0;
    transition: all var(--duration_image) var(--easing);
    opacity: 0;

    &.ready {
      opacity: 1;
    }
  }

  & .overlay {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color_key);
    opacity: 0;
    mix-blend-mode: multiply;
    transition: all var(--duration_quick) var(--easing);

    &.ready {
      opacity: 0.35;
    }
  }

  & .text {
    padding: 90px 0 45px;
    position: relative;
    z-index: 2;
    color: var(--textColor_inverse);

    @media (--mq_sp) {
      padding: 60px 0 25px;
    }
  }

  @nest :global(body.pc) &:hover {
    & .overlay {
      opacity: 0.75;
    }

    & .image {
      transform: scale(1.03);
    }
  }
}
</style>

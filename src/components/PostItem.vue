<template>
  <!-- アイキャッチがある -->
  <router-link v-if="hasEyecatch" :to="'/post/'+post.id" tag="div" :class="[$style.post, $style.eyecatch]">
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
import moment from 'moment'
import imagesLoaded from 'imagesloaded'

export default {
  props: ['post'],

  data () {
    return {
      categories: [],
      isPostItemLoaded: false
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
    },

    isWebfontLoaded () {
      return this.$store.state.isWebfontLoaded
    }
  },

  watch: {
    isPostItemLoaded () {
      this.checkLoad()
    },

    isWebfontLoaded () {
      this.checkLoad()
    }
  },

  methods: {
    init () {
      // PostItemがロードされたらloadedPostCountを1up
      this.$store.dispatch('changeLoadedPostCount', 'increment')
      this.isPostItemLoaded = true
    },

    filterByCategory (categoryId, categoryName) {
      this.$store.dispatch('filterByCategory', {categoryId: categoryId, categoryName: categoryName, transition: false})
    },

    checkLoad () {
      // アイキャッチがあり、webfont読み込み済みで、アイキャッチの読み込みが完了した場合
      // アイキャッチをフェードインする
      if (this.hasEyecatch && this.isWebfontLoaded && this.isPostItemLoaded) {
        this.$refs.image.classList.add(this.$style.ready)
        this.$refs.overlay.classList.add(this.$style.ready)
      }
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
      // imagesLoaded
      const imgLoad = imagesLoaded(this.$refs.image, {background: true})
      console.log(imgLoad)
      imgLoad.on('always', this.init)
    } else {
      // アイキャッチがないとき
      this.init()
    }
  }
}
</script>

<style module>
@import "properties.css";
@import "property-sets.css";
@import "media.css";

.post {
  position: relative;
  cursor: pointer;
}

.text {
  max-width: var(--width_content);
  margin: 0 auto;

  @media (--mq_sp) {
    margin: 0 var(--margin_page_sp);
  }
}

.title {
  font-size: var(--fontSize_h1);
  transition: all var(--duration_quick) var(--easing);

  @media (--mq_sp) {
    font-size: var(--fontSize_h1_sp);
  }
}

.info {
  @apply --info;

  margin-top: 25px;

  @media (--mq_sp) {
    margin-top: 15px;
  }
}

.bg {
  border: 1px solid var(--color_key);
  background-color: var(--color_key);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;

  @media (--mq_tablet) {
    border-right: none;
    border-left: none;
  }
}

.image {
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

.overlay {
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
    opacity: 0.25;
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
      opacity: 0.5;
    }

    & .image {
      transform: scale(1.03);
    }
  }
}
</style>

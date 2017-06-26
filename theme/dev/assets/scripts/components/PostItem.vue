<template>
  <!-- アイキャッチがある -->
  <router-link v-if="hasEyecatch" :to="'/post/'+post.id" tag="div" :class="[$style.post, $style.eyecatch]" ref="post">
    <div :class="$style.bg">
      <div :class="$style.image" :style="{backgroundImage:'url('+eyecatch+')'}" ref="image"></div>
      <div :class="$style.overlay" ref="overlay"></div>
    </div>

    <div :class="$style.text">
      <h1 :class="$style.title" v-html="post.title.rendered"></h1>
      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
        <ul v-if="hasTags" :class="$style.tags">
          <li v-for="tag in tags" :key="tag.id" :class="$style.tag">{{tag.name}}</li>
        </ul>
      </div>
    </div>
  </router-link>

  <!-- アイキャッチがない -->
  <router-link v-else :to="'/post/'+post.id" tag="div" :class="[$style.post, $style.noeyecatch]">
    <div :class="$style.text">
      <h1 :class="$style.title" v-html="post.title.rendered"></h1>
      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
        <ul v-if="hasTags" :class="$style.tags">
          <li v-for="tag in tags" :key="tag.id" :class="$style.tag">{{tag.name}}</li>
        </ul>
      </div>
    </div>
  </router-link>
</template>

<script>
import {util} from '../app';
import moment from 'moment';
import imagesLoaded from 'imagesloaded';

export default {
  props: ['post'],

  data() {
    return {
      tags: []
    };
  },

  computed: {
    hasTags() {
      return this.post.tags.length >= 1 ? true : false;
    },

    hasEyecatch() {
      return this.post.featured_media > 0 ? true : false;
    },

    eyecatch() {
      let eyecatch;

      if (Object.keys(this.post._embedded['wp:featuredmedia'][0].media_details.sizes).length > 0) {
        eyecatch = this.post._embedded['wp:featuredmedia'][0].media_details.sizes.theme_thumbnail.source_url;
      }
      else {
        eyecatch = this.post._embedded['wp:featuredmedia'][0].source_url;
      }

      return eyecatch;
    }
  },

  methods: {
    onLoad() {
      // PostItemがロードされたらloadedPostItemを1up
      this.$store.dispatch('changeloadedPostItem', 'increment');
    }
  },

  filters: {
    moment(date) {
      return moment(date).format('YYYY.M.D');
    }
  },

  mounted() {
    // タグがある場合はタグ取得
    if (this.hasTags) {
      this.$store.dispatch('getAllTagName', this.post.tags)
        .then((result)=>{
          this.tags = result;
        });
    }

    // アイキャッチがある時
    if (this.hasEyecatch) {
      const $post = this.$refs.post.$el;
      const $image = this.$refs.image;
      const $overlay = this.$refs.overlay;

      imagesLoaded($post, {background: true}, ()=>{
        util.wait(10).then(()=>{
          $image.classList.add(this.$style.ready);
          $overlay.classList.add(this.$style.ready);
          this.onLoad();
        });
      });
    }
    // アイキャッチがないとき
    else {
      util.wait(10).then(()=>{
        this.onLoad();
      });
    }
  }
};
</script>

<style lang='scss' module>
@import "~bourbon";
@import "~styles/config";
@import "~styles/mixin";
@import "~styles/extend";

.post {
  position: relative;
  padding-left: (($width_index - $width_content) / 2);
  padding-right: (($width_index - $width_content) / 2);
  cursor: pointer;

  .text {
    transition: all $duration_quick $easing;
  }

  .title {
    font-size: $fontSize_h1;
  }

  .info {
    @extend %info;
    margin-top: 25px;
  }
}

.post.noeyecatch {
  :global(body.pc) & {
    &:hover {
      .text {
        opacity: 0.7;
      }
    }
  }
}

.post.eyecatch {
  padding: 0;

  .bg {
    border: 1px solid $color_key;
    background-color: $color_key;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    z-index: 0;
    transition: all $duration_image $easing;
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
    background-color: $color_key;
    opacity: 0;
    mix-blend-mode: multiply;
    transition: all $duration_quick $easing;

    &.ready {
      opacity: 0.35;
    }
  }

  .text {
    padding: 90px (($width_index - $width_content) / 2) 45px;
    position: relative;
    z-index: 2;
    color: $textColor_inverse;
  }

  :global(body.pc) & {
    &:hover {
      .overlay {
        opacity: 0.75;
      }

      .image {
        transform: scale(1.05);
      }
    }
  }
}
</style>

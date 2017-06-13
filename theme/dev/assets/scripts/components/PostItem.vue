<template>
  <!-- アイキャッチがある -->
  <router-link v-if="hasEyecatch" :to="'/post/'+post.id" tag="div" :class="[$style.post, $style.eyecatch]" ref="post">
    <div :class="$style.bg">
      <div :class="$style.image" :style="{backgroundImage:'url('+eyecatch+')'}" ref="image"></div>
      <div :class="$style.overlay" ref="overlay"></div>
    </div>

    <div :class="$style.text" ref="text">
      <h1 :class="$style.title" v-html="post.title.rendered"></h1>
      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
      </div>
    </div>
  </router-link>

  <!-- アイキャッチがない -->
  <router-link v-else :to="'/post/'+post.id" tag="div" :class="[$style.post, $style.noeyecatch]" ref="post">
    <div :class="$style.text" ref="text">
      <h1 :class="$style.title" v-html="post.title.rendered"></h1>
      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
      </div>
    </div>
  </router-link>
</template>

<script>
import {util} from '../app';
import moment from 'moment';
const $ = require('jquery');
const imagesLoaded = require('imagesloaded');
imagesLoaded.makeJQueryPlugin($);

export default {
  props: ['post'],

  data() {
    return {
      $post: null,
      $image: null,
      $overlay: null,
      $text: null
    };
  },

  computed: {
    hasEyecatch() {
      return this.post.featured_media > 0 ? true : false;
    },

    eyecatch() {
      return this.post._embedded['wp:featuredmedia'][0].media_details.sizes.theme_thumbnail.source_url;
    }
  },

  methods: {},

  filters: {
    moment(date) {
      return moment(date).format('YYYY.M.D');
    }
  },

  mounted() {
    this.$post = $(this.$refs.post.$el);
    this.$text = $(this.$refs.text);

    util.wait(100)
      .then(()=>{
        // アイキャッチがある時
        if (this.hasEyecatch) {
          this.$image = $(this.$refs.image);
          this.$overlay = $(this.$refs.overlay);

          this.$post.imagesLoaded({background: true}, ()=>{
            this.$image.addClass(this.$style.ready);
            this.$overlay.addClass(this.$style.ready);
            this.$text.addClass(this.$style.ready);
          });
        }
        // ないとき
        else {
          this.$text.addClass(this.$style.ready);
        }
      });
  }
};
</script>

<style lang='scss' module>
@import "~bourbon";
@import "~styles/config";
@import "~styles/mixin";

.post {
  position: relative;
  padding-left: 150px;
  padding-right: 150px;
  cursor: pointer;

  .text {
    transition: all $duration_quick $easing;
    opacity: 0;

    &.ready {
      opacity: 1;
    }
  }

  .title {
    font-size: $fontSize_h1;
  }

  .info {
    margin-top: 25px;
    font-size: $fontSize_small;
  }
}

.post.noeyecatch {
  &:hover {
    .text {
      opacity: 0.7;
    }
  }
}

.post.eyecatch {
  padding: 0;

  .bg {
    background-color: $bgColor_gray;
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
    transition: all $duration_quick $easing;
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
      opacity: 0.5;
    }
  }

  .text {
    padding: 90px 150px 45px;
    position: relative;
    z-index: 2;
    color: $textColor_inverse;
  }

  &:hover {
    .overlay {
      opacity: 0.75;
    }

    .image {
      transform: scale(1.05);
    }
  }
}
</style>

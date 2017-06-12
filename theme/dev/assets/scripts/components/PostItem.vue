<template>
  <!-- アイキャッチがある -->
  <router-link v-if="hasEyecatch" :to="'/post/'+post.id" tag="div" :class="[$style.post, $style.eyecatch]">
    <div :class="$style.bg">
      <div :class="$style.image" :style="{backgroundImage:'url('+eyecatch+')'}"></div>
      <div :class="$style.overlay"></div>
    </div>

    <div :class="$style.text">
      <h1 :class="$style.title" v-html="post.title.rendered"></h1>
      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
      </div>
    </div>
  </router-link>

  <!-- アイキャッチがない -->
  <router-link v-else :to="'/post/'+post.id" tag="div" :class="$style.post">
    <div :class="$style.text">
      <h1 :class="$style.title" v-html="post.title.rendered"></h1>
      <div :class="$style.info">
        <div :class="$style.date">{{post.date | moment}}</div>
      </div>
    </div>
  </router-link>
</template>

<script>
import moment from 'moment';

export default {
  props: ['post'],

  computed: {
    hasEyecatch() {
      return this.post.featured_media > 0 ? true : false;
    },

    eyecatch() {
      return this.post._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url;
    }
  },

  methods: {},

  filters: {
    moment(date) {
      return moment(date).format('YYYY.M.D');
    }
  },
};
</script>

<style lang='scss' module>
@import "~bourbon";
@import "~styles/config";
@import "~styles/mixin";

.post {
  position: relative;
  padding: 75px 150px;
  cursor: pointer;

  &:hover {
    .text {
      opacity: 0.8;
    }

    .title {
      transform: translateY(2px);
    }
  }
}

.post.eyecatch {
  padding: 0;

  .bg {
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
  }

  .overlay {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color_key;
    opacity: 0.5;
    mix-blend-mode: multiply;
    transition: all $duration_quick $easing;
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
      transform: scale(1.1);
    }

    .text {
      opacity: 1;
    }
  }
}

.text {
  transition: all $duration_quick $easing;
}

.title {
  font-size: $fontSize_h1;
  transition: all $duration_quick $easing;
}

.info {
  margin-top: 25px;
  font-size: $fontSize_small;
}
</style>

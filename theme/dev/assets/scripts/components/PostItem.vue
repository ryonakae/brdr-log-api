<template>
  <!-- アイキャッチがある -->
  <router-link v-if="hasEyecatch" :to="'/post/'+post.id" class="post eyecatch">
    <div class="bg">
      <div class="image" :style="{backgroundImage:'url('+eyecatch+')'}"></div>
    </div>

    <div class="text">
      <h1 v-html="post.title.rendered"></h1>
      <div class="info">
        <div class="date">{{post.date | moment}}</div>
      </div>
    </div>
  </router-link>

  <!-- アイキャッチがない -->
  <router-link v-else :to="'/post/'+post.id" class="post">
    <h1 v-html="post.title.rendered"></h1>
    <div class="info">
      <div class="date">{{post.date | moment}}</div>
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
</style>

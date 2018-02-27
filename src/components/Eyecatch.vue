<template>
  <div v-if="hasEyecatch" class="eyecatch" :style="{backgroundImage:'url('+eyecatch+')'}"></div>
</template>

<script>
export default {
  props: ['post'],

  computed: {
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
    }
  }
}
</script>

<style scoped>
@import 'config.css';

.eyecatch {
  pointer-events: none;
  touch-action: none;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: calc(100vh - var(--margin_bottom) - 1em);
  background-size: cover;
  background-position: 50% 50%;

  @media (--mq_sp) {
    height: calc(100vh - var(--margin_bottom_sp) - 1em);
  }
}
</style>

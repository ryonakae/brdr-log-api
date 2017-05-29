<template>
  <header :class="$style.header">
    <router-link :to="'/'" tag="h1" :class="$style.title">{{siteTitle}}</router-link>

    <ul :class="$style.navi">
      <router-link :to="'/about'" tag="li" :class="$style.naviItem">About</router-link>
    </ul>
  </header>
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {
    siteTitle() {
      return this.$store.state.siteTitle;
    },
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' module>
@import "~bourbon";
@import "~styles/config";
@import "~styles/mixin";
</style>

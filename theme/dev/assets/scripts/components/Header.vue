<template>
  <header>
    <router-link :to="'/'" tag="h1" :class="$style.title">
      <svg :viewBox="logo.viewBox">
        <use :xlink:href="'#'+logo.id"></use>
      </svg>
    </router-link>

    <ul>
      <router-link :to="'/about'" tag="li">About</router-link>
    </ul>
  </header>
</template>

<script>
import logo from 'images/logo.svg';
console.log(logo);

export default {
  data() {
    return {
      logo: logo
    };
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

.title {
  svg {
    width: 22px;
    height: 30px;
  }
}
</style>

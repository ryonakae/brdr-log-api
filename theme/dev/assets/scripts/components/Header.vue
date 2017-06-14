<template>
  <header :class="$style.header">
    <router-link :to="'/'" tag="h1" :class="$style.title">
      <svg :viewBox="logo.viewBox">
        <use :xlink:href="'#'+logo.id"></use>
      </svg>
    </router-link>

    <ul :class="$style.navi">
      <li :class="$style.link">
        <a href="//brdr.jp" target="_blank">BRDR</a>
      </li>
    </ul>
  </header>
</template>

<script>
import logo from 'images/logo.svg';

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

.header {
  @include clearfix();
  position: fixed;
  z-index: 100;
  top: 40px;
  width: 100%;
  padding: 0 $margin_page;
  pointer-events: none;
}

.title {
  float: left;
  pointer-events: auto;

  svg {
    width: 22px;
    height: 30px;
    fill: $color_key;
  }
}

.navi {
  float: right;
  margin-top: 6px;
}

.link {
  margin-left: 30px;
  pointer-events: auto;
  font-size: $fontSize_small;

  &:first-child {
    margin-left: 0;
  }
}
</style>

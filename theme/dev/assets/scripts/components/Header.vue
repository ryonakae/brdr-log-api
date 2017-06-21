<template>
  <header :class="$style.header">
    <router-link :to="'/'" tag="h1" :class="$style.logo" class="logo" id="headerLogo">
      <div :class="$style.inner">
        <div :class="$style.loading"></div>
        <div :class="$style.default"></div>
      </div>
    </router-link>

    <ul :class="$style.navi">
      <li @click="clearFilter">Clear</li>
      <li @click="filterByTag(4)">Tags</li>
      <li>
        <a href="//brdr.jp" target="_blank">BRDR</a>
      </li>
    </ul>
  </header>
</template>

<script>
import {scrollManager} from '../app';
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

    perPage() {
      return this.$store.state.perPage;
    },
  },

  methods: {
    // タグで絞り込み
    // tagのオプションを追加してgetAllPostsする (index以外にいたらindexに遷移)
    filterByTag(tagId) {
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
      window.scrollTo(0,0);
      this.$store.dispatch('createIndex', {per_page:this.perPage, offset:0, tags:tagId});
    },

    clearFilter() {
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
      window.scrollTo(0,0);
      this.$store.dispatch('createIndex', {per_page:this.perPage, offset:0});
    }
  },

  mounted() {}
};
</script>

<style lang='scss' module>
@import "~bourbon";
@import "~styles/config";
@import "~styles/mixin";

@keyframes loading {
  0%   { transform: translateX(20%); }
  100% { transform: translateX(-100%); }
}

.header {
  @include clearfix();
  position: fixed;
  z-index: 100;
  top: 40px;
  width: 100%;
  padding: 0 $margin_page;
  pointer-events: none;
}

.logo {
  float: left;
  pointer-events: auto;
  cursor: pointer;
  width: 22px;
  height: 30px;

  .inner {
    width: 100%;
    height: 100%;
    clip-path: url(#logo_clippingPath);
    position: relative;
    overflow: hidden;
    background-color: #6da3f2;
  }

  .loading,
  .default {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .loading {
    width: 500%;
    animation-name: loading;
    animation-duration: 1.2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: normal;
    background: linear-gradient(
      105deg,
      #6da3f2 0%,
      #6da3f2 5%,
      #af9bde 13%,
      #fa7895 26%,
      #ffa284 39%,
      #efb46e 52%,
      #efd69b 65%,
      #aed3b0 78%,
      #8ec9ce 91%,
      #6da3f2 95%,
      #6da3f2 100%
    );
  }

  .default {
    background-color: $color_key;
    transition: all $duration_quick $ease-out-quad;
    opacity: 0;
  }

  &:global(.ready) {
    .loading {
      animation-name: none;
    }

    .default {
      opacity: 1;
    }
  }
}

.navi {
  float: right;
  margin-top: 6px;
  @include clearfix();

  li {
    float: left;
    margin-left: 30px;
    pointer-events: auto;
    font-size: $fontSize_small;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>

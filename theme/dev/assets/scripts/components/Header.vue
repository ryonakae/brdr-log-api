<template>
  <header :class="$style.header">
    <router-link :to="'/'" tag="h1" :class="[$style.logo, {[$style.ready]: !isLogoLoading}]">
      <div :class="$style.inner">
        <div :class="$style.loading"></div>
        <div :class="$style.default"></div>
      </div>
    </router-link>

    <div v-if="isFiltered" :class="$style.clear" @click="clearFilter">Clear</div>

    <ul :class="$style.navi">
      <li :class="$style.tags">
        <span @click="toggleTags">Tags</span>
        <ul :class="{[$style.active]: isTagsActive}">
          <li v-for="tag in tags" :key="tag.id" @click="filterByTag(tag.id)">
            <span>{{tag.name}}</span>
          </li>
        </ul>
      </li>
      <li>
        <a href="//brdr.jp" target="_blank">BRDR</a>
      </li>
    </ul>
  </header>
</template>

<script>
import superagent from 'superagent';
import {scrollManager} from '../app';
import logo from 'images/logo.svg';

export default {
  data() {
    return {
      logo: logo,
      tags: [],
      isTagsActive: false,
      isFiltered: false
    };
  },

  computed: {
    siteTitle() {
      return this.$store.state.siteTitle;
    },

    perPage() {
      return this.$store.state.perPage;
    },

    isLogoLoading() {
      return this.$store.state.isLogoLoading;
    }
  },

  methods: {
    // タグで絞り込み
    // tagのオプションを追加してgetAllPostsする (index以外にいたらindexに遷移)
    filterByTag(tagId) {
      // タグ一覧を閉じる
      this.isTagsActive = false;

      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
      window.scrollTo(0,0);
      this.$store.dispatch('createIndex', {per_page:this.perPage, offset:0, tags:tagId});

      // clearを表示
      this.isFiltered = true;
    },

    clearFilter() {
      // タグ一覧を閉じる
      this.isTagsActive = false;

      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
      window.scrollTo(0,0);
      this.$store.dispatch('createIndex', {per_page:this.perPage, offset:0});

      // clearを隠す
      this.isFiltered = false;
    },

    getAllTag() {
      return new Promise((resolve, reject)=>{
        const getUrl = this.$store.state.siteUrl + '/wp-json/wp/v2/tags';

        superagent
          .get(getUrl)
          .timeout({
            response: 10000,
            deadline: 60000
          })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            else {
              console.log(res.body);
              resolve(res.body);
            }
          });
      });
    },

    toggleTags() {
      if (this.isTagsActive) {
        this.isTagsActive = false;
      }
      else {
        this.isTagsActive = true;
      }
    }
  },

  mounted() {
    this.getAllTag()
      .then((result)=>{
        return new Promise((resolve, reject)=>{
          this.tags = result;
          resolve();
        });
      });
  }
};
</script>

<style lang='scss' module>
@import "~bourbon";
@import "~styles/config";
@import "~styles/mixin";
@import "~styles/extend";

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
  text-align: center;
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

  &.ready {
    .loading {
      animation-name: none;
    }

    .default {
      opacity: 1;
    }
  }
}

.clear {
  display: inline-block;
  font-size: $fontSize_small;
  pointer-events: auto;
  @extend %link;

  :global(body.pc) &:hover {
    opacity: 0.7;
  }
}

.navi {
  text-align: left;
  float: right;
  margin-top: 6px;
  @include clearfix();

  span {
    @extend %link;

    :global(body.pc) &:hover {
      opacity: 0.7;
    }
  }

  > li {
    float: left;
    margin-left: 30px;
    pointer-events: auto;
    font-size: $fontSize_small;

    &:first-child {
      margin-left: 0;
    }
  }

  .tags {
    position: relative;

    ul {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 15px;
      display: none;

      &.active {
        display: block;
      }
    }

    li {
      margin-top: 5px;

      &:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>

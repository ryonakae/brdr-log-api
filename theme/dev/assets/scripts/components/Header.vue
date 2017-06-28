<template>
  <header :class="$style.header">
    <router-link :to="'/'" tag="h1" :class="[$style.logo, {[$style.ready]: !isLogoLoading}]">
      <div :class="$style.inner">
        <div :class="$style.loading"></div>
        <div :class="$style.default"></div>
      </div>
    </router-link>

    <div v-if="isFiltered" :class="$style.clear" @click="clearFilter">
      <svg :viewBox="icon.clear.viewBox">
        <use :xlink:href="'#'+icon.clear.id"></use>
      </svg>
      <span>{{filteredTag}}</span>
    </div>

    <ul :class="$style.navi">
      <li :class="$style.tags">
        <span @click="toggleTags">Tags</span>
        <ul :class="{[$style.active]: isTagsActive}">
          <li v-for="tag in tags" :key="tag.id" @click="filterByTag(tag.id, tag.name)">
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
import logo from 'images/logo.svg';
import iconClear from 'images/icon-clear.svg';

export default {
  data() {
    return {
      icon: {
        clear: iconClear
      },
      tags: [],
      isTagsActive: false
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
    },

    isFiltered() {
      return this.$store.state.isFiltered;
    },

    filteredTag() {
      return this.$store.state.filteredTag;
    }
  },

  methods: {
    filterByTag(tagId, tagName) {
      this.$store.dispatch('filterByTag', {tagId:tagId, tagName:tagName, transition:true});

      // タグ一覧を閉じる
      this.isTagsActive = false;
    },

    clearFilter() {
      this.$store.dispatch('filterByTag', {tagId:'reset', transition:true});

      // タグ一覧を閉じる
      this.isTagsActive = false;
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
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  font-size: $fontSize_small;
  pointer-events: auto;
  @extend %link;

  svg {
    display: inline;
    fill: $color_key;
    width: 10px;
    height: 10px;
    vertical-align: text-top;
    margin-right: 5px;
  }
}

.navi {
  text-align: left;
  float: right;
  margin-top: 6px;
  @include clearfix();

  span {
    @extend %link;
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
      min-width: 100px;

      &.active {
        display: block;
      }
    }

    li {
      margin-top: 4px;

      &:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>

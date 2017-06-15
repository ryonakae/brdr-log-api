<template>
  <div id="app">
    <header-component></header-component>
    <router-view></router-view>
  </div>
</template>

<script>
const $ = require('jquery');
import HeaderComponent from './components/Header.vue';
import {util} from './app';
import {resizeManager} from './app';
import {scrollManager} from './app';
const webFont = require('webfontloader');

export default {
  components: {
    HeaderComponent
  },

  computed: {
    perPageMobile() {
      return this.$store.state.perPageMobile;
    }
  },

  created() {
    // ページタイトルを変更
    this.$store.dispatch('changeTitle', '');

    // デバイスによってbodyにaddClass
    if (util.getDevice() === 'pc') {
      $('body').addClass('is-pc');
    }
    else if (util.getDevice() === 'tablet') {
      $('body').addClass('is-tablet');
    }
    else if (util.getDevice() === 'mobile') {
      $('body').addClass('is-mobile');
    }

    // mobileのときだけperPageを少なくする
    if (util.getDevice() === 'mobile') {
      this.$store.dispatch('changePerPage', this.perPageMobile);
    }

    webFont.load({
      classes: false,
      custom: {
        families: ['Neue Frutiger', 'Noto Sans Japanese', 'Source Code Pro']
      },
      active: ()=>{
        console.log('all webfont loaded');
        util.wait(50).then(()=>{
          $('body').addClass('ready');
        });
      }
    });
  }
};
</script>

<style lang='scss'>
@import "~styles/base";
</style>

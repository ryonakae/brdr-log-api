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
      $('body').addClass('pc');
    }
    else if (util.getDevice() === 'tablet') {
      $('body').addClass('tablet');
    }
    else if (util.getDevice() === 'mobile') {
      $('body').addClass('mobile');
    }

    // mobileのときだけperPageを少なくする
    if (util.getDevice() === 'mobile') {
      this.$store.dispatch('changePerPage', this.perPageMobile);
    }

    // logoのローディング開始
    this.$store.dispatch('logoLoading', {state:'start', wait:0});

    // webfontの読み込み検知
    webFont.load({
      classes: false,
      custom: {
        families: ['Neue Frutiger', 'Noto Sans Japanese', 'Source Code Pro']
      },
      active: ()=>{
        console.log('all webfont loaded');
        util.wait(50).then(()=>{
          this.$store.commit('CHANGE_IS_WEBFONT_LOADED', true);
        });
      }
    });
  }
};
</script>

<style lang='scss'>
@import "~styles/base";
</style>

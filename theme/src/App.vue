<template>
  <div id="app">
    <header-component></header-component>
    <router-view></router-view>
    <footer-component></footer-component>
  </div>
</template>

<script>
import HeaderComponent from './components/Header.vue'
import FooterComponent from './components/Footer.vue'
import {util} from './'
import webFont from 'webfontloader'

export default {
  components: {
    HeaderComponent,
    FooterComponent
  },

  computed: {
    perPageMobile () {
      return this.$store.state.perPageMobile
    }
  },

  created () {
    // ページタイトルを変更
    this.$store.dispatch('changeTitle', '')

    // デバイスによってbodyにaddClass
    document.body.classList.add(util.getDevice())

    // mobileのときだけperPageを少なくする
    if (util.getDevice() === 'mobile') {
      this.$store.dispatch('changePerPage', this.perPageMobile)
    }

    // webfont(Noto Sans Japanese)のロードが終わったらbodyにaddClass
    webFont.load({
      classes: false,
      timeout: 10000,
      custom: {
        families: ['Noto Sans Japanese']
      },
      active: () => {
        console.log('all webfont loaded')
        document.body.classList.add('webfontLoaded')
      }
    })

    // axiosのクライアントをセットアップ
    this.$store.dispatch('initClient')

    // logoのローディング開始
    this.$store.dispatch('logoLoading', {boolean: true, wait: 0})
  }
}
</script>

<style>
@import "reset-css";
@import "font-face.css";
@import "properties.css";
@import "property-sets.css";
@import "media.css";
@import "base.css";

body.webfontLoaded {
  font-family: var(--fontFamily_loaded);
}
</style>

<template>
  <div id="app">
    <header>
      <logo-component></logo-component>
      <header-component :class="{[$style.hidden]: !isWebfontLoaded}"></header-component>
    </header>
    <router-view :class="{[$style.hidden]: !isWebfontLoaded}"></router-view>
    <footer-component :class="{[$style.hidden]: !isWebfontLoaded}"></footer-component>
  </div>
</template>

<script>
import LogoComponent from '@/components/Logo.vue'
import HeaderComponent from '@/components/Header.vue'
import FooterComponent from '@/components/Footer.vue'
import { utils } from '@/index'
import webFont from 'webfontloader'

export default {
  components: {
    LogoComponent,
    HeaderComponent,
    FooterComponent
  },

  computed: {
    perPageMobile() {
      return this.$store.state.perPageMobile
    },

    isWebfontLoaded() {
      return this.$store.state.isWebfontLoaded
    }
  },

  created() {
    // ページタイトルを変更
    this.$store.dispatch('changeTitle', '')

    // デバイスによってbodyにaddClass
    document.body.classList.add(utils.getDevice())

    // mobileのときだけperPageを少なくする
    if (utils.getDevice() === 'mobile')
      this.$store.commit('SET_PER_PAGE', this.perPageMobile)

    // webfontのロードが終わったらbodyにaddClass
    webFont.load({
      classes: false,
      timeout: 5000,
      custom: {
        families: [
          'Neue Frutiger:n4,n7',
          'Noto Sans Japanese:n4,n7',
          'Source Code Pro:n4'
        ]
      },
      active: () => {
        console.log('all webfont loaded')
        document.body.classList.add('webfontLoaded')
        this.$store.commit('CHANGE_IS_WEBFONT_LOADED', true)
      }
    })

    // axiosのクライアントをセットアップ
    this.$store.dispatch('initClient')
  }
}
</script>

<style>
@import 'reset-css';
@import 'font-face.css';
@import 'properties.css';
@import 'property-sets.css';
@import 'media.css';
@import 'base.css';

body.webfontLoaded {
  font-family: var(--fontFamily_loaded);
}
</style>

<style module>
.hidden {
  visibility: hidden;
}
</style>

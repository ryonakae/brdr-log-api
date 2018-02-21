<template>
  <div :class="{webfontLoaded: isFontLoaded}">
    <header>
      <logo-component></logo-component>
      <navi-component :class="{hidden: !isFontLoaded}"></navi-component>
    </header>
    <router-view :class="{hidden: !isFontLoaded}"></router-view>
    <footer-component :class="{hidden: !isFontLoaded}"></footer-component>
  </div>
</template>

<script>
import LogoComponent from '@/components/Logo.vue'
import NaviComponent from '@/components/Navi.vue'
import FooterComponent from '@/components/Footer.vue'
import { utils } from '@/index'
import webFont from 'webfontloader'

export default {
  components: {
    LogoComponent,
    NaviComponent,
    FooterComponent
  },

  computed: {
    perPageMobile() {
      return this.$store.state.perPageMobile
    },

    isFontLoaded() {
      return this.$store.state.isFontLoaded
    }
  },

  created() {
    // デバイスによってbodyにaddClass
    document.body.classList.add(utils.getDevice())

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
        this.$store.commit('CHANGE_IS_WEBFONT_LOADED', true)
      }
    })

    // axiosのクライアントをセットアップ
    this.$store.dispatch('initClient')
  }
}
</script>

<style>
/* @import 'sanitize.css'; */
@import 'font-face.css';
@import 'properties.css';
@import 'property-sets.css';
@import 'media.css';
@import 'base.css';
</style>

<style scoped>
@import 'properties.css';

.webfontLoaded {
  font-family: var(--fontFamily_loaded);
}

.hidden {
  visibility: hidden;
}
</style>

<template>
  <div>
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
    isFontLoaded() {
      return this.$store.state.isFontLoaded
    }
  },

  created() {
    document.body.classList.add(utils.getDevice())
    this.$store.commit('initClient')

    webFont.load({
      classes: false,
      timeout: 10000,
      custom: {
        families: [
          'Yaku Han JP:n4,n7',
          'Neue Frutiger:n4,n7',
          'Noto Sans Japanese:n4,n7',
          'Source Code Pro:n4'
        ]
      },
      fontloading: (familyName, fvd) => {
        console.log('[App.vue - webFont.load] fontloading -', familyName, fvd)
      },
      fontactive: (familyName, fvd) => {
        console.log('[App.vue - webFont.load] fontactive -', familyName, fvd)
      },
      active: () => {
        console.log('[App.vue - webFont.load] active - all webfonts are loaded')
        this.$store.commit('changeIsFontLoaded', true)
      },
      inactive: () => {
        console.log(
          '[App.vue - webFont.load] inactive - the browser does not support OR if none of the fonts could be loaded'
        )
        this.$store.commit('changeIsFontLoaded', true)
      }
    })
  }
}
</script>

<style>
@import 'sanitize.css';
@import 'font-face.css';
@import 'config.css';
@import 'base.css';
</style>

<style scoped>
.hidden {
  visibility: hidden;
}
</style>

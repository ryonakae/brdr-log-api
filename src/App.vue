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

  methods: {
    loadWebfont() {
      return new Promise((resolve, reject) => {
        webFont.load({
          classes: false,
          timeout: 10000,
          custom: {
            families: [
              'YakuHanJPs:n4',
              'YakuHanJP:n4,n7',
              'Neue Frutiger:n4,n7'
            ]
          },
          fontloading: (familyName, fvd) => {
            console.log(
              '[App.vue - loadWebfont] fontloading -',
              familyName,
              fvd
            )
          },
          fontactive: (familyName, fvd) => {
            console.log('[App.vue - loadWebfont] fontactive -', familyName, fvd)
          },
          active: () => {
            console.log(
              '[App.vue - loadWebfont] active - all webfonts are loaded'
            )
            return resolve()
          },
          inactive: () => {
            console.log(
              '[App.vue - loadWebfont] inactive - the browser does not support OR if none of the fonts could be loaded'
            )
            return reject()
          }
        })
      })
    }
  },

  async created() {
    document.body.classList.add(utils.getDevice())
    this.$store.commit('initClient')

    try {
      await this.loadWebfont()
    } catch (err) {
      console.log('[App.vue - created]', err)
    } finally {
      console.log('[App.vue - created] created done')
      this.$store.commit('changeIsFontLoaded', true)
    }
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

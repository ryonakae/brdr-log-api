<template>
  <div id="app">
    <header-component></header-component>
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderComponent from './components/Header.vue'
import {util} from './'

export default {
  components: {
    HeaderComponent
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

    // logoのローディング開始
    this.$store.dispatch('logoLoading', {boolean: true, wait: 0})

    // axiosのクライアントをセットアップ
    this.$store.dispatch('initClient')
  }
}
</script>

<style>
@import "reset-css";
@import "properties.css";
@import "propertySets.css";
@import "media.css";
@import "base.css";
</style>

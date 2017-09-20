<template>
  <not-found-component></not-found-component>
</template>

<script>
import NotFoundComponent from '@/components/NotFound.vue'

export default {
  components: {
    NotFoundComponent
  },

  data () {
    return {
      title: 'Page Not Found'
    }
  },

  mounted () {
    this.$store.dispatch('changeTitle', this.title)
    this.$store.dispatch('logoLoading', {boolean: false, wait: 300})
  }
}
</script>

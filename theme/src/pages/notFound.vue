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
      title: 'aaaa Page Not Found'
    }
  },

  mounted () {
    this.$store.dispatch('changeTitle', this.title)
    this.$store.dispatch('loading', {status: 'end', wait: 300})
  }
}
</script>

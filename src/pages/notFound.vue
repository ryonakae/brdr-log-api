<template>
  <not-found-component></not-found-component>
</template>

<script>
import NotFoundComponent from '@/components/NotFound.vue'

export default {
  components: {
    NotFoundComponent
  },

  mounted() {
    this.$store.dispatch('changeTitle', 'Page Not Found')
    this.$store.dispatch('loading', { status: 'end', wait: 300 })
  }
}
</script>

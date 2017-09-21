<template>
  <article v-if="hasPage" ref="page">
    <header :class="$style.header">
      <h1 :class="$style.title" v-html="page.title.rendered"></h1>
    </header>

    <content-component :data="page"></content-component>
  </article>

  <not-found-component v-else></not-found-component>
</template>

<script>
import NotFoundComponent from '@/components/NotFound.vue'
import ContentComponent from '@/components/Content.vue'

export default {
  components: {
    NotFoundComponent,
    ContentComponent
  },

  data () {
    return {
      page: {}
    }
  },

  computed: {
    hasPage () {
      return Object.keys(this.page).length > 0
    }
  },

  methods: {
    init () {
      this.$store.dispatch('changeTitle', this.page.title.rendered.toUpperCase())
    },

    // 404
    onNotFound () {
      this.$store.dispatch('changeTitle', 'Page Not Found')
      this.$store.dispatch('loading', {status: 'end', wait: 300})
    }
  },

  mounted () {
    this.$store.dispatch('getPage', this.$route.params.slug)
      .then((result) => {
        return new Promise((resolve, reject) => {
          this.page = result
          resolve()
        })
      })
      .then(this.init)
      .catch(this.onNotFound)
  }
}
</script>

<style module>
@import "properties.css";
@import "property-sets.css";
@import "media.css";

.header {
  @apply --header;
}
</style>

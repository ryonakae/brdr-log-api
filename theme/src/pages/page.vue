<template>
  <article v-if="hasPage" ref="page">
    <header :class="$style.header">
      <h1 :class="$style.title" v-html="page.title.rendered"></h1>
    </header>

    <div v-if="hasEyecatch" :class="$style.eyecatch">
      <img :src="eyecatch">
    </div>

    <div v-if="hasContent" :class="$style.content" v-html="page.content.rendered"></div>

    <footer :class="$style.footer">
      <router-link :to="'/'" tag="div" :class="$style.backIndex">
        <span :class="$style.arrow">&lt;-</span>
        <span>Index</span>
      </router-link>
    </footer>
  </article>

  <div v-else ref="notFound" :class="[$style.notFound, $style.hidden]">
    <not-found-component></not-found-component>
  </div>
</template>

<script>
import NotFoundComponent from '../components/NotFound.vue'

export default {
  components: {
    NotFoundComponent
  },

  data () {
    return {
      page: {}
    }
  },

  computed: {
    hasPage () {
      return Object.keys(this.page).length > 0
    },

    hasContent () {
      return this.page.content.rendered !== ''
    },

    hasEyecatch () {
      return this.page.featured_media > 0
    }
  },

  methods: {
    onLoad (result) {
      this.$store.dispatch('changeTitle', result.title.rendered.toUpperCase())
      this.page = result
      this.$store.dispatch('logoLoading', {boolean: false, wait: 300})
    },

    // 404
    onNotFound () {
      this.$store.dispatch('changeTitle', 'Page Not Found')
      const $notFound = this.$refs.notFound
      $notFound.classList.remove(this.$style.hidden)
      this.$store.dispatch('logoLoading', {boolean: false, wait: 300})
    }
  },

  mounted () {
    this.$store.dispatch('getPage', this.$route.params.slug)
      .then(this.onLoad)
      .catch(this.onNotFound)
  }
}
</script>

<style module>
@import "properties";
@import "propertySets";
@import "media";

.header {
  @apply --header;
}

.eyecatch {
  @apply --eyecatch;
}

.content {
  @apply --content;
}

.footer {
  @apply --footer;
}

.notFound {
  &.hidden {
    display: none;
  }
}
</style>

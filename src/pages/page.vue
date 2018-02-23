<template>
  <div>
    <article v-if="hasPage" ref="page">
      <header>
        <h1 class="title" v-html="page.title.rendered"></h1>
      </header>

      <content-component :data="page"></content-component>
    </article>

    <not-found-component v-if="isNotFound"></not-found-component>
  </div>
</template>

<script>
import NotFoundComponent from '@/components/NotFound.vue'
import ContentComponent from '@/components/Content.vue'

export default {
  components: {
    NotFoundComponent,
    ContentComponent
  },

  data() {
    return {
      page: {},
      isNotFound: false
    }
  },

  computed: {
    client() {
      return this.$store.state.client
    },
    hasPage() {
      return Object.keys(this.page).length > 0
    }
  },

  methods: {
    async getPage(slug) {
      try {
        const res = await this.client.get('/pages', {
          params: {
            _embed: '',
            slug: slug
          }
        })
        if (res.data.length === 0) throw 'no res.data'
        console.log('[page.vue - getPage]', res)
        return res.data[0]
      } catch (err) {
        throw new Error('[page.vue - getPage]', err)
      }
    },

    onNotFound() {
      this.isNotFound = true
      this.$store.commit('setPageTitle', 'Page Not Found')
      this.$store.commit('changeIsLoading', false)
    }
  },

  async mounted() {
    try {
      const res = await this.getPage(this.$route.params.slug)
      if (res) {
        this.page = res
        this.$store.commit('setPageTitle', this.page.title.rendered)
      }
    } catch (err) {
      console.error('[page.vue - mounted]', err)
      this.onNotFound()
    }
  }
}
</script>

<style scoped>
@import 'config.css';

.title {
  margin: 0;
  font-size: var(--fontSize_h1);
  line-height: var(--lineHeight_title);
}
</style>

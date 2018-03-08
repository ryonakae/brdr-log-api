<template>
  <div>
    <article v-if="hasPage" ref="page">
      <header class="header" :class="{hidden: !isTypekitLoaded}">
        <h1 class="title" v-html="page.title.rendered"></h1>
      </header>

      <content-component :data="page" :class="{hidden: !isTypekitLoaded}"></content-component>
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
      isNotFound: false,
      isTypekitLoaded: false
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

    async loadTypekit() {
      await this.$store.dispatch('loadTypekit')
      this.isTypekitLoaded = true
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
        this.loadTypekit()
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

.header,
.content {
  @apply --content;

  &.hidden {
    visibility: hidden;
  }
}

.header {
  margin-top: var(--margin_top);

  @media (--mq_sp) {
    margin-top: var(--margin_top_sp);
  }
}

.title {
  @apply --title;
}

.content {
  margin-top: calc(var(--margin_page) * 1.5);
  margin-bottom: calc(var(--margin_page) * 2);

  @media (--mq_sp) {
    margin-top: calc(var(--margin_page_sp) * 1.5);
    margin-bottom: calc(var(--margin_page_sp) * 2);
  }
}
</style>

<template>
  <footer class="footer">
    <div class="content" v-if="!isIndex">
      <share-component v-if="hasPost" :permalink="post.link" :title="post.title.rendered" class="share"></share-component>
      <router-link :to="'/'" class="back">Index</router-link>
    </div>

    <a class="copyright" href="https://twitter.com/ryo_dg" target="_blank">&copy;Ryo Nakae</a>
  </footer>
</template>

<script>
import ShareComponent from '@/components/Share.vue'

export default {
  components: {
    ShareComponent
  },

  computed: {
    isIndex() {
      return this.$route.path === '/'
    },

    post() {
      return this.$store.state.currentPostData
    },

    hasPost() {
      return Object.keys(this.post).length > 0
    }
  }
}
</script>

<style scoped>
@import 'properties.css';
@import 'property-sets.css';
@import 'media.css';

.footer {
  margin-bottom: var(--margin_page);
  font-size: var(--fontSize_small);

  & a {
    @apply --link;
  }

  @media (--mq_sp) {
    margin-bottom: var(--margin_page_sp);
  }
}

.content {
  margin-left: var(--margin_page);
}

.share {
  display: inline-block;
}

.back {
  display: inline-block;
  margin-left: 1.5em;
}

.copyright {
  position: fixed;
  bottom: calc(var(--margin_page) + 0.2em);
  right: var(--margin_page);

  @media (--mq_sp) {
    bottom: var(--margin_page_sp);
    right: var(--margin_page_sp);
  }
}
</style>

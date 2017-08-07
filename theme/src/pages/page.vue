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
import NotFoundComponent from '../components/NotFound.vue';

export default {
  components: {
    NotFoundComponent
  },

  data() {
    return {
      page: {}
    };
  },

  computed: {
    hasPage() {
      return Object.keys(this.page).length > 0 ? true : false;
    },

    hasContent() {
      return this.page.content.rendered !== '' ? true : false;
    },

    hasEyecatch() {
      return this.page.featured_media > 0 ? true : false;
    }
  },

  methods: {
    // 404
    onNotFound() {
      this.$store.dispatch('changeTitle', 'Page Not Found');
      this.$store.dispatch('logoLoading', {boolean:false, wait:300});

      const $notFound = this.$refs.notFound;
      $notFound.classList.remove(this.$style.hidden);
    }
  },

  beforeRouteEnter(to, from, next) {
    next((vm)=>{
    });
  },

  mounted() {
    this.$store.dispatch('getPage', this.$route.params.slug)
      .then((result)=>{
        this.page = result;
        this.$store.dispatch('changeTitle', result.title.rendered.toUpperCase());
      })
      .catch(this.onNotFound);
  }
};
</script>

<style module>
@import "properties";
@import "propertySets";
@import "media";

.header {
  max-width: var(--width_content);
  margin: var(--margin_top) auto 70px;

  @media (--mq_sp) {
    margin: var(--margin_top_sp) var(--margin_page_sp) 45px;
  }

  & .title {
    font-size: var(--fontSize_h1);

    @media (--mq_sp) {
      font-size: var(--fontSize_h1_sp);
    }
  }
}

.eyecatch {
  display: table;
  border: 1px solid var(--color_key);
  max-width: var(--width_single);
  margin: 0 auto 3em;
  text-align: center;

  & img {
    max-width: 100%;
    height: auto;
    vertical-align: top;
    transition: all var(--duration_quick) var(--easing);
    opacity: 0;

    &:global(.ready) {
      opacity: 1;
    }
  }
}

.content {
  max-width: var(--width_content);
  margin: 0 auto;
  @apply --content;

  @media (--mq_sp) {
    margin: 0 var(--margin_page_sp);
  }
}

.footer {
  margin: var(--margin_bottom) var(--margin_page) var(--margin_page);
  line-height: 1;
  @apply --clearfix;
  position: relative;

  @media (--mq_sp) {
    margin: var(--margin_bottom_sp) var(--margin_page_sp) var(--margin_page_sp);
  }

  & .backIndex {
    cursor: pointer;
    position: fixed;
    bottom: var(--margin_page);
    left: var(--margin_page);
    font-size: var(--fontSize_small);
    line-height: 1;
    transition: all var(--duration_quick) var(--easing);
    @apply --link;

    & span {
      display: inline-block;
    }

    & .arrow {
      transition: all var(--duration_quick) var(--easing);
    }

    @nest :global(body.pc) &:hover {
      & .arrow {
        transform: translateX(-2px);
      }
    }

    @media (--mq_sp) {
      bottom: var(--margin_page_sp);
      left: var(--margin_page_sp);
    }
  }
}

.notFound {
  &.hidden {
    display: none;
  }
}
</style>

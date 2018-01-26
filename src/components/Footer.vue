<template>
  <footer :class="$style.footer">
    <router-link v-if="!isIndex" :to="'/'" tag="div" :class="$style.back">
      <svg :viewBox="icon.back.viewBox">
        <use :xlink:href="'#'+icon.back.id"></use>
      </svg>
      <span>Index</span>
    </router-link>

    <share-component v-if="!isIndex && hasPost" :permalink="post.link" :title="post.title.rendered" :class="$style.share"></share-component>

    <small :class="$style.copyright">
      <a href="https://twitter.com/ryo_dg" target="_blank">&copy;Ryo Nakae</a>
    </small>
  </footer>
</template>

<script>
import ShareComponent from '@/components/Share.vue'
import iconBack from 'images/icon-back.svg'

export default {
  components: {
    ShareComponent
  },

  data() {
    return {
      icon: {
        back: iconBack
      }
    }
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

<style module>
@import 'properties.css';
@import 'property-sets.css';
@import 'media.css';

.footer {
  margin: var(--margin_bottom) 0 var(--margin_page);
  line-height: 1;

  @apply --clearfix;

  @media (--mq_sp) {
    margin: var(--margin_bottom_sp) 0 var(--margin_page_sp);
  }
}

.back {
  cursor: pointer;
  position: fixed;
  bottom: var(--margin_page);
  left: var(--margin_page);
  font-size: var(--fontSize_small);
  transition: all var(--duration_quick) var(--easing);

  @apply --link;

  & * {
    display: inline-block;
  }

  & svg {
    display: inline;
    fill: var(--color_key);
    width: 11px;
    height: 7px;
    vertical-align: baseline;
    margin-right: 3px;
    transition: all var(--duration_quick) var(--easing);
  }

  @nest :global(body.pc) &:hover {
    & svg {
      transform: translateX(-1px);
    }
  }

  @media (--mq_sp) {
    bottom: var(--margin_page_sp);
    left: var(--margin_page_sp);
    font-size: var(--fontSize_small_sp);
  }
}

.share {
  display: inline-block;
  position: relative;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
}

.copyright {
  display: block;
  position: fixed;
  bottom: var(--margin_page);
  right: var(--margin_page);
  font-size: var(--fontSize_xSmall);

  @media (--mq_sp) {
    bottom: var(--margin_page_sp);
    right: var(--margin_page_sp);
  }
}
</style>

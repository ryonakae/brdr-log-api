<template>
  <div>
    <a class="icon twitter" :href="twitterUrl" target="_blank" @click.stop="onShare('Twitter', 'Tweet', twitterUrl)">
      <svg :viewBox="icon.twitter.viewBox">
        <use :xlink:href="'#'+icon.twitter.id"></use>
      </svg>
    </a>

    <a class="icon facebook" :href="facebookUrl" target="_blank" @click.stop="onShare('Facebook', 'Share', facebookUrl)">
      <svg :viewBox="icon.facebook.viewBox">
        <use :xlink:href="'#'+icon.facebook.id"></use>
      </svg>
    </a>
  </div>
</template>

<script>
import iconTwitter from 'images/icon-twitter.svg'
import iconFacebook from 'images/icon-facebook.svg'

export default {
  props: ['permalink', 'title'],

  data() {
    return {
      icon: {
        twitter: iconTwitter,
        facebook: iconFacebook
      }
    }
  },

  computed: {
    twitterUrl() {
      return (
        'https://twitter.com/share?url=' +
        encodeURIComponent(this.permalink) +
        '&text=' +
        encodeURIComponent(this.title) +
        ' - ' +
        this.$store.state.siteTitle
      )
    },

    facebookUrl() {
      return (
        'https://www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(this.permalink)
      )
    }
  },

  methods: {
    onShare(network, action, url) {
      window.ga('send', {
        hitType: 'social',
        socialNetwork: network,
        socialAction: action,
        socialTarget: url
      })
    }
  }
}
</script>

<style scoped>
@import 'config.css';

.icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 1.5em;

  &:first-child {
    margin-left: 0;
  }

  @apply --link;

  & svg {
    display: block;
    fill: var(--color_key);
    width: 100%;
    height: 100%;
  }

  @nest :global(body.pc) &:hover {
    & svg {
      fill: var(--color_bg);
    }
  }
}

.twitter {
  width: 14px;
  height: 11px;
}

.facebook {
  margin-top: -2px;
  width: 8px;
  height: 14px;
}
</style>

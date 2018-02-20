<template>
  <div>
    <a class="icon twitter" :href="twitterUrl" target="_blank" @click.stop="onShare('twitter', twitterUrl)">
      <svg :viewBox="icon.twitter.viewBox">
        <use :xlink:href="'#'+icon.twitter.id"></use>
      </svg>
    </a>

    <a class="icon facebook" :href="facebookUrl" target="_blank" @click.stop="onShare('facebook', facebookUrl)">
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
      const url =
        'https://twitter.com/share?url=' +
        encodeURIComponent(this.permalink) +
        '&text=' +
        encodeURIComponent(this.title) +
        ' - ' +
        this.$store.state.siteTitle
      return url
    },

    facebookUrl() {
      const url =
        'https://www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(this.permalink)
      return url
    }
  },

  methods: {
    onShare(network, url) {
      let socialNetwork
      if (network === 'twitter') socialNetwork = 'Twitter'
      else if (network === 'facebook') socialNetwork = 'Facebook'

      let socialAction
      if (network === 'twitter') socialAction = 'Tweet'
      else if (network === 'facebook') socialAction = 'Share'

      window.ga('send', {
        hitType: 'social',
        socialNetwork: socialNetwork,
        socialAction: socialAction,
        socialTarget: url
      })
    }
  }
}
</script>

<style scoped>
@import 'properties.css';
@import 'property-sets.css';

.icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 1.5em;

  &:first-child {
    margin-left: 0;
  }

  @apply --link;

  & svg {
    fill: var(--color_key);
  }

  @nest :global(body.pc) &:hover {
    & svg {
      fill: var(--color_bg);
    }
  }
}

.twitter {
  margin-top: 1px;

  & svg {
    width: 14px;
    height: 11px;
  }
}

.facebook svg {
  width: 8px;
  height: 14px;
}
</style>

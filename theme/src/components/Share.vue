<template>
  <ul :class="$style.share">
    <li :class="[$style.icon, $style.twitter]">
      <a :href="twitterUrl" target="_blank">
        <svg :viewBox="icon.twitter.viewBox">
          <use :xlink:href="'#'+icon.twitter.id"></use>
        </svg>
      </a>
    </li>

    <li :class="[$style.icon, $style.facebook]">
      <a :href="facebookUrl" target="_blank">
        <svg :viewBox="icon.facebook.viewBox">
          <use :xlink:href="'#'+icon.facebook.id"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
import iconTwitter from 'images/icon-twitter.svg'
import iconFacebook from 'images/icon-facebook.svg'

export default {
  props: ['permalink', 'title'],

  data () {
    return {
      icon: {
        twitter: iconTwitter,
        facebook: iconFacebook
      }
    }
  },

  computed: {
    twitterUrl () {
      const url = 'https://twitter.com/share?url=' + encodeURIComponent(this.permalink) + '&text=' + encodeURIComponent(this.title) + ' - ' + this.$store.state.siteTitle
      return url
    },

    facebookUrl () {
      const url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.permalink)
      return url
    }
  }
}
</script>

<style module>
@import "properties";
@import "propertySets";

.share {
  line-height: 1;
}

.icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 16px;
  @apply --link;

  &:first-child {
    margin-left: 0;
  }
}

svg {
  fill: var(--color_key);
}

.twitter svg {
  width: 14px;
  height: 11px;
}

.facebook svg {
  width: 8px;
  height: 14px;
}
</style>

<template>
  <h1 class="logo" :class="{ready: !isLoading}" @mouseenter="onEnter" @mouseleave="onLeave" @touchstart="onEnter" @touchend="onLeave">
    <router-link :to="'/'">
      <div class="inner">
        <div class="loading"></div>
        <div class="default"></div>
      </div>

      <div class="logoForFirefox">
        <svg :viewBox="logo.viewBox">
          <use :xlink:href="'#'+logo.id"></use>
        </svg>
      </div>
    </router-link>
  </h1>
</template>

<script>
import logo from 'images/logo.svg'
import logoClipPath from 'images/logo-clipPath.svg'

export default {
  data() {
    return {
      logo: logo
    }
  },

  computed: {
    isLoading() {
      return this.$store.state.isLoading
    }
  },

  methods: {
    onEnter() {
      this.$store.commit('changeIsLoading', true)
    },

    onLeave() {
      this.$store.commit('changeIsLoading', false)
    }
  }
}
</script>

<style scoped>
@import 'properties.css';
@import 'property-sets.css';
@import 'media.css';

@keyframes loading {
  0% {
    transform: translateX(20%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.logo {
  margin: 0;
  position: fixed;
  z-index: 100;
  top: var(--margin_page);
  left: var(--margin_page);
  cursor: pointer;
  width: 22px;
  height: 30px;

  @media (--mq_sp) {
    top: var(--margin_page_sp);
    left: var(--margin_page_sp);
  }

  & .inner {
    width: 100%;
    height: 100%;
    clip-path: url(#logo-clipPath_clipPath);
    position: relative;
    overflow: hidden;
    background-color: #6da3f2;
  }

  & .loading,
  & .default {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  & .loading {
    width: 500%;
    animation-name: loading;
    animation-duration: 1.2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: normal;
    background: linear-gradient(
      105deg,
      #6da3f2 0%,
      #6da3f2 5%,
      #af9bde 13%,
      #fa7895 26%,
      #ffa284 39%,
      #efb46e 52%,
      #efd69b 65%,
      #aed3b0 78%,
      #8ec9ce 91%,
      #6da3f2 95%,
      #6da3f2 100%
    );
  }

  & .default {
    background-color: var(--color_key);
    opacity: 0;
  }

  &.ready {
    & .default {
      opacity: 1;
    }
  }

  & .logoForFirefox {
    display: none;
  }
}

/* Firefox Hack */
@-moz-document url-prefix() {
  .logo {
    & .inner {
      display: none;
    }

    & .logoForFirefox {
      display: block;
      width: 100%;
      height: 100%;
    }

    & .logoForFirefox svg {
      fill: var(--color_key);
      width: 22px;
      height: 30px;
    }
  }
}
</style>

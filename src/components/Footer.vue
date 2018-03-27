<template>
  <footer class="footer">
    <a class="copyright" href="https://twitter.com/ryo_dg" target="_blank">&copy;Ryo Nakae</a>
  </footer>
</template>

<style scoped>
@import 'config.css';

.footer {
  font-size: var(--fontSize_small);
}

.copyright {
  @apply --link;

  position: fixed;
  bottom: var(--margin_page);
  right: var(--margin_page);

  @media (--mq_sp) {
    bottom: var(--margin_page_sp);
    right: var(--margin_page_sp);
  }
}
</style>

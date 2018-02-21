<template>
  <div>
    <h1 :class="$style.title">
      Page<br>
      Not<br>
      Found
    </h1>
  </div>
</template>

<style module>
@import 'properties.css';
@import 'media.css';

.title {
  margin: 0 0 0 var(--margin_top);
  padding-top: var(--margin_top);
  font-size: 20vw;

  @media (--mq_sp) {
    padding-top: var(--margin_top_sp);
    margin-left: var(--margin_page_sp);
  }
}
</style>

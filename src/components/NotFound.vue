<template>
  <div>
    <h1 class="title">Page Not Found</h1>
  </div>
</template>

<style scoped>
@import 'config.css';

.title {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 0 0 var(--margin_page);
  font-size: 10vw;

  @media (--mq_sp) {
    margin-left: var(--margin_page_sp);
  }
}
</style>

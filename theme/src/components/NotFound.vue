<template>
  <div>
    <h1 :class="$style.title">Page Not Found</h1>
  </div>
</template>

<style module>
@import "properties.css";
@import "property-sets.css";
@import "media.css";

.title {
  width: 100%;
  font-size: 7rem;
  letter-spacing: 0;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (--mq_tablet) {
    font-size: 6rem;
  }

  @media (--mq_sp) {
    font-size: 4rem;
  }
}
</style>

<template>
  <article v-if="hasPage" ref="page">
    <h1 v-html="page.title.rendered.toUpperCase()"></h1>
    <div v-html="page.content.rendered"></div>
  </article>
</template>

<script>
export default {
  data() {
    return {
      page: {}
    };
  },

  computed: {
    hasPage() {
      return Object.keys(this.page).length > 0 ? true : false;
    },
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
      .then(()=>{
        setTimeout(()=>{
          // コンテンツを表示
        }, 10);
      });
  }
};
</script>

<style lang='scss' module>
@import "~bourbon";
@import "~styles/config";
@import "~styles/mixin";
@import "~styles/extend";
</style>

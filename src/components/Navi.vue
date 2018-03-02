<template>
  <nav>
    <ul class="navi">
      <li v-if="isFiltered" class="categoryName" @click="filter(0)">
        <span>{{categoryName}}</span>
      </li>

      <li class="categories" :class="{active: isCategoriesActive}">
        <span @click="toggleCategories">Category</span>
        <ul>
          <li v-for="category in categories" v-if="category.count > 0" :key="category.id" @click="filter(category.id, category.name)">
            <span>{{category.name}}</span>
          </li>
        </ul>
      </li>

      <li>
        <a href="//brdr.jp" target="_blank">BRDR</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      isCategoriesActive: false
    }
  },

  computed: {
    client() {
      return this.$store.state.client
    },

    isFiltered() {
      return this.$store.state.categoryId !== 0
    },

    categoryName() {
      return this.$store.state.categoryName
    }
  },

  methods: {
    filter(categoryId, categoryName) {
      this.isCategoriesActive = false
      this.$store.dispatch('filter', {
        categoryId: categoryId,
        categoryName: categoryName
      })
    },

    async getAllCategories() {
      try {
        const res = await this.client.get('/categories')
        return res.data
      } catch (err) {
        console.log('[Navi.vue - getAllCategories]', err)
      }
    },

    toggleCategories() {
      this.isCategoriesActive = !this.isCategoriesActive
    }
  },

  async mounted() {
    const res = await this.getAllCategories()
    this.categories = res
  }
}
</script>

<style scoped>
@import 'config.css';

.navi {
  position: fixed;
  z-index: 100;
  top: calc(var(--margin_page) + 8px);
  right: var(--margin_page);
  font-size: var(--fontSize_small);
  font-weight: bold;
  margin: 0;
  padding: 0;
  list-style-type: none;

  @media (--mq_sp) {
    top: calc(var(--margin_page_sp) + 8px);
    right: var(--margin_page_sp);
  }

  & span,
  & a {
    @apply --link;
  }

  & > li {
    position: relative;
    display: inline-block;
    margin-left: 1.5em;
  }
}

.categoryName {
  & span::before {
    content: '[X]';
    margin-right: 0.2em;
  }
}

.categories {
  &.active {
    background-color: var(--color_bg);

    & ul {
      display: block;
      background-color: var(--color_bg);
      pointer-events: auto;
    }
  }

  & ul {
    position: absolute;
    top: 100%;
    left: 0;
    margin: 1.5em 0 0;
    padding: 0;
    list-style-type: none;
    display: none;
    pointer-events: none;
  }

  & li {
    margin-top: 0.8em;

    &:first-child {
      margin-top: 0;
    }
  }
}
</style>

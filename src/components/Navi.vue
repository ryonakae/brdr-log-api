<template>
  <nav class="nav">
    <ul class="navi">
      <li v-if="isFiltered" class="filteredCategoryName" @click="filter('reset', null)">
        <span>{{filteredCategoryName}}</span>
      </li>
      <li class="categories">
        <span @click="toggleCategories">Category</span>
        <ul :class="{active: isCategoriesActive}">
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
      return this.$store.state.isFiltered
    },
    filteredCategoryName() {
      return this.$store.state.filteredCategoryName
    }
  },

  methods: {
    filter(categoryId, categoryName) {
      this.$store.dispatch('filter', {
        categoryId: categoryId,
        categoryName: categoryName,
        transition: true
      })

      // カテゴリ一覧を閉じる
      this.isCategoriesActive = false
    },

    getAllCategories() {
      return new Promise((resolve, reject) => {
        this.client
          .get('/categories')
          .then(res => {
            console.log(res)
            resolve(res.data)
          })
          .catch(err => {
            console.erorr(err)
            reject(err)
          })
      })
    },

    toggleCategories() {
      this.isCategoriesActive = !this.isCategoriesActive
    }
  },

  mounted() {
    this.getAllCategories().then(result => {
      this.categories = result
    })
  }
}
</script>

<style scoped>
@import 'config.css';

.nav {
  font-size: var(--fontSize_small);
}

.navi {
  position: fixed;
  z-index: 100;
  top: calc(var(--margin_page) + 8px);

  @media (--mq_sp) {
    top: calc(var(--margin_page_sp) + 8px);
  }
}

.navi {
  margin: 0;
  padding: 0;
  list-style-type: none;
  right: var(--margin_page);

  @media (--mq_sp) {
    right: var(--margin_page_sp);
  }

  & span,
  & a {
    @apply --link;
  }

  & > li {
    display: inline-block;
    margin-left: 1.5em;
    pointer-events: auto;
  }
}

.filteredCategoryName {
  & span::before {
    content: 'X';
    margin-right: 0.2em;
  }
}

.categories {
  position: relative;

  & ul {
    position: absolute;
    top: 100%;
    left: 0;
    margin: 1.5em 0 0;
    padding: 0;
    list-style-type: none;
    display: none;

    &.active {
      display: block;
    }
  }

  & li {
    margin-top: 0.8em;

    &:first-child {
      margin-top: 0;
    }
  }
}
</style>

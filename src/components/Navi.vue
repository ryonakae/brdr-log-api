<template>
  <nav class="nav">
    <div v-if="isFiltered" class="filter" @click="filterByCategory('reset', null)">
      <svg :viewBox="icon.clear.viewBox">
        <use :xlink:href="'#'+icon.clear.id"></use>
      </svg>
      <span>{{filteredCategory}}</span>
    </div>

    <ul class="navi">
      <li class="categories">
        <span @click="toggleCategories">Category</span>
        <ul :class="{active: isCategoriesActive}">
          <li v-for="category in categories" v-if="category.count > 0" :key="category.id" @click="filterByCategory(category.id, category.name)">
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
import iconClear from 'images/icon-clear.svg'

export default {
  data() {
    return {
      icon: {
        clear: iconClear
      },
      categories: [],
      isCategoriesActive: false
    }
  },

  computed: {
    isFiltered() {
      return this.$store.state.isFiltered
    },

    filteredCategory() {
      return this.$store.state.filteredCategory
    }
  },

  methods: {
    filterByCategory(categoryId, categoryName) {
      this.$store.dispatch('filterByCategory', {
        categoryId: categoryId,
        categoryName: categoryName,
        transition: true
      })

      // カテゴリ一覧を閉じる
      this.isCategoriesActive = false
    },

    getAllCategories() {
      return new Promise((resolve, reject) => {
        this.$store.state.client
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
@import 'properties.css';
@import 'property-sets.css';
@import 'media.css';

.nav {
  font-size: var(--fontSize_small);
}

.filter,
.navi {
  position: fixed;
  z-index: 100;
  top: calc(var(--margin_page) + 6px);

  @media (--mq_sp) {
    top: calc(var(--margin_page_sp) + 6px);
  }
}

.filter {
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;

  @apply --link;

  & svg {
    display: inline;
    fill: var(--color_key);
    width: 10px;
    height: 10px;
    vertical-align: text-top;
    margin-right: 3px;
  }

  @nest :global(body.pc) &:hover {
    & svg {
      fill: var(--color_bg);
    }
  }
}

.navi {
  margin: 0;
  padding: 0;
  right: var(--margin_page);

  @media (--mq_sp) {
    right: var(--margin_page_sp);
  }

  @apply --clearfix;

  & span,
  & a {
    @apply --link;
  }

  & > li {
    float: left;
    margin-left: 30px;
    pointer-events: auto;

    &:first-child {
      margin-left: 0;
    }

    @media (--mq_sp) {
      margin-left: 15px;
    }
  }
}

.categories {
  position: relative;

  & ul {
    position: absolute;
    top: 100%;
    left: 0;
    margin: 15px 0 0;
    padding: 0;
    display: none;
    min-width: 100px;

    &.active {
      display: block;
    }

    @media (--mq_sp) {
      margin-top: 10px;
    }
  }

  & li {
    margin-top: 4px;

    &:first-child {
      margin-top: 0;
    }
  }
}
</style>

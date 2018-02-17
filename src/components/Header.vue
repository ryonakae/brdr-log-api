<template>
  <div>
    <div v-if="isFiltered" :class="$style.filter" @click="filterByCategory('reset', null)">
      <svg :viewBox="icon.clear.viewBox">
        <use :xlink:href="'#'+icon.clear.id"></use>
      </svg>
      <span>{{filteredCategory}}</span>
    </div>

    <ul :class="$style.navi">
      <li :class="$style.categories">
        <span :class="$style.text" @click="toggleCategories">Category</span>
        <ul :class="{[$style.active]: isCategoriesActive}">
          <li v-for="category in categories" v-if="category.count > 0" :key="category.id" @click="filterByCategory(category.id, category.name)">
            <span :class="$style.text">{{category.name}}</span>
          </li>
        </ul>
      </li>
      <li>
        <a href="http://brdr.jp" target="_blank">BRDR</a>
      </li>
    </ul>
  </div>
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
      if (this.isCategoriesActive) {
        this.isCategoriesActive = false
      } else {
        this.isCategoriesActive = true
      }
    }
  },

  mounted() {
    this.getAllCategories().then(result => {
      return new Promise((resolve, reject) => {
        this.categories = result
        resolve()
      })
    })
  }
}
</script>

<style module>
@import 'properties.css';
@import 'property-sets.css';
@import 'media.css';

.filter,
.navi {
  font-size: var(--fontSize_small);
  position: fixed;
  z-index: 100;
  top: calc(var(--margin_page) + 6px);

  @media (--mq_sp) {
    font-size: var(--fontSize_small_sp);
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
    transition: all var(--duration_quick) var(--easing);
  }

  @nest :global(body.pc) &:hover {
    & svg {
      transform: translateY(1px);
    }
  }
}

@-moz-document url-prefix() {
  .filter {
    @nest :global(body.pc) &:hover {
      & svg {
        transform: none;
      }
    }
  }
}

.navi {
  right: var(--margin_page);

  @media (--mq_sp) {
    right: var(--margin_page_sp);
  }

  @apply --clearfix;

  & .text {
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
    margin-top: 15px;
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

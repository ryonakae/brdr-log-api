import router from '@/router'

export default {
  async getAllCategoryName ({ state }, categories) {
    try {
      const _categories = []

      await categories.forEach(async (id, index) => {
        const res = await state.client.get('/categories/' + id)
        _categories.splice(index, 0, res.data)
      })

      return _categories
    } catch (err) {
      console.error(err)
    }
  },

  // カテゴリで絞り込む
  async filter ({ commit, state }, options) {
    console.log('[action - filter]', options)
    commit('changeIsFiltered', true)
    commit('setCategoryId', options.categoryId)
    commit('setCategoryName', options.categoryName)
    router.push('/')
    window.scrollTo(0, 0)
  }
}

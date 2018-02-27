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
      console.error('[action - getAllCategoryName]', err)
    }
  },

  async filter ({ commit, state }, options) {
    console.log('[action - filter]', options)
    router.push('/')
    window.scrollTo(0, 0)

    if (options.categoryId === state.categoryId) return

    commit('changeIsLoading', true)
    commit('setAllPosts', [])
    commit('setCurrentPost', {})
    commit('resetLoadedPost', [])

    if (options.categoryId === 0) {
      commit('setCategoryId', 0)
      commit('setCategoryName', '')
    } else {
      commit('setCategoryId', options.categoryId)
      commit('setCategoryName', options.categoryName)
    }
  }
}

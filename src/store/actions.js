'use strict'

export default {
  async getAllCategoryName ({ state, dispatch }, categories) {
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
  async filter ({ dispatch, commit, state }, options) {
    console.log('[action - filter]')
  }
}

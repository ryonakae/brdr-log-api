import router from '@/router'

export default {
  async getAllCategoryName ({ state }, categories) {
    try {
      const _categories = []
      await Promise.all(
        categories.map(async (id, index) => {
          const res = await state.client.get('/categories/' + id)
          _categories.splice(index, 0, res.data)
        })
      )
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
  },

  loadTypekit () {
    return new Promise((resolve, reject) => {
      window.Typekit.load({
        async: false,
        classes: false,
        timeout: 10000,
        fontloading: (familyName, fvd) => {
          console.log('[action - loadTypekit] fontloading -', familyName, fvd)
        },
        fontactive: (familyName, fvd) => {
          console.log('[action - loadTypekit] fontactive -', familyName, fvd)
        },
        active: () => {
          console.log('[action - loadTypekit] active - all typekit are loaded')
          return resolve()
        },
        inactive: () => {
          console.log(
            '[action - loadTypekit] inactive - the browser does not support OR if none of the fonts could be loaded'
          )
          return reject()
        }
      })
    })
  }
}

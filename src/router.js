'use strict'

import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '@/pages/index'
import page from '@/pages/page'
import single from '@/pages/single'
import notFound from '@/pages/notFound'

Vue.use(VueRouter)

// detect routes
const routes = [
  { path: '/', component: index, name: 'index' },
  { path: '/:slug', component: page, name: 'page' },
  { path: '/post/:id', component: single, name: 'single' },
  { path: '/*', component: notFound, name: 'notFound' }
]

// detect scroll behavior
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}

// router initialize
const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior,
  linkActiveClass: '',
  linkExactActiveClass: ''
})

// google analytics
router.afterEach(to => {
  window.ga('send', {
    hitType: 'pageview',
    location: to.path
  })
})

export default router

'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// import pages
import index from './pages/index.vue';
import page from './pages/page.vue';
import single from './pages/single.vue';
import notFound from './pages/notFound.vue';

// detect routes
const routes = [
  {path:'/', component: index},
  {path:'/:slug', component: page},
  {path:'/post/:id', component: single},
  {path:'/*', component: notFound}
];

// detect scroll behavior
const scrollBehavior = (to, from, savedPosition)=>{
  if (savedPosition) {
    return savedPosition;
  }
  else {
    return {x: 0, y: 0};
  }
};

// router initialize
const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior,
  linkActiveClass: '',
  linkExactActiveClass: ''
});

export default router;

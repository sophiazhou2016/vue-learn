import Vue from 'vue'
import Router from '../krouter'
import HelloWorld from '@/components/HelloWorld'
import about from '@/components/about'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/about',
      name: 'about',
      component: about
    }
  ]
})

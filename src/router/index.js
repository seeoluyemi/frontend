import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import onBoarding from "@/router/onBoarding";
import authorised from "@/router/authorised";
import store from "@/store";
import {adminPermissions} from "@/constants";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'Landing',
    component: () => import('../components/Landing/Landing.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: 'about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../components/Landing/About.vue')
      },
      {
        path: '/contact',
        name: 'Contact',
        component: () => import('../components/Landing/Contact.vue')
      },
      {
        path: 't&c',
        name: 'T&C',
        component: () => import('../components/onboarding/TermsAndCondition.vue')
      }
    ]
  },
  ...onBoarding,
  ...authorised,
  {
    path: '/*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const isAuthorizedToRoute = (route_name, permissions) => {
  return permissions && permissions.includes(adminPermissions[route_name.toLowerCase()]) || route_name === 'AdminDashboard'
}

const userDefaultRoute = user_type => {
  const defaults = {
    'customer': 'UserDashboard',
    'admin': 'AdminDashboard',
    'super_admin': 'AdminDashboard'
  }
  return defaults[user_type]
}

router.beforeEach((to, from, next) => {
  const {loggedIn, user: {user_type}} = store.state.onBoarding

  if (loggedIn) {
    if (to.name === 'Login' || to.name === 'AdminRegister') {
      next({name: userDefaultRoute(user_type)})
    } else {
      if (user_type === 'admin') {
        const permissions = JSON.parse(localStorage.getItem('permissions'))
        if (isAuthorizedToRoute(to.name, permissions)) {
          next()
        } else next({name: userDefaultRoute(user_type)})
      } else {
        next()
      }
    }
  } else {
    if (to.name !== 'Login' && to.name !== 'AdminRegister' && to.matched.some(match => match.meta.requiresAuth)) {
       next({ name: 'Login' })
    } else {
      next()
    }
  }
})

export default router

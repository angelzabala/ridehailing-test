import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'vehicles',
          component: () => import('@/modules/vehicles/views/VehicleList.vue')
        },
        {
          path: 'vehicles/new',
          name: 'new-vehicle',
          component: () => import('@/modules/vehicles/views/VehicleForm.vue')
        }
      ]
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { guest: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/modules/auth/views/LoginView.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/modules/auth/views/RegisterView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth/login')
    return
  }

  // Si la ruta es de accesp libre y el usuario está autenticado
  if (to.meta.guest && isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router 
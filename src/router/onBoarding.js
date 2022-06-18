export default [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterVIew.vue')
    },
    {
      path: '/register/verify',
      name: 'VerifyAccount',
      component: () => import('../components/onboarding/VerifyAccount.vue')
    },
    {
        path: '/admin/login',
        name: 'AdminRegister',
        component: () => import('../components/onboarding/AdminLogin.vue')
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('../components/onboarding/ForgotPassword.vue')
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: () => import('../components/onboarding/ResetPassword.vue')
    }
]
export default [
    {
        path: '/auth',
        component: () => import('../views/Authorised.vue'),
        children: [
            {
                path: 'user',
                component: () => import('../views/users/UserDashboardView.vue'),
                children: [
                    {
                        path: 'dashboard',
                        name: 'UserDashboard',
                        component: () => import('../components/users/UserDashboard.vue'),
                        meta: {
                            dashboard: true
                        }
                    },
                    {
                        path: 'trade',
                        name: 'Trade',
                        component: () => import('../components/users/Trade/TradeOptions.vue'),
                        // children: [
                        //     {
                        //         path: '',
                        //         name: 'Trade',
                        //         component: () => import('../components/users/Trade/TradeOptions')
                        //     },
                        //     {
                        //         path: 'buy',
                        //         name: 'Buy',
                        //         component: () => import('../components/users/Trade/BuyGiftCard')
                        //     },
                        //     {
                        //         path: 'sell',
                        //         name: 'Sell',
                        //         component: () => import('../components/users/Trade/SellGiftCard')
                        //     }
                        // ]
                    },
                    {
                        path: 'trade/transaction',
                        name: 'TradeTransaction',
                        component: () => import('../components/users/Trade/BuyGiftCard')
                    },
                    {
                      path: 'bc',
                      name: 'Bitcoin',
                      component: () => import('../components/users/Bitcoin/Bitcoin.vue')
                    },
                    {
                        path: 'history',
                        name: 'History',
                        component: () => import('../components/users/History/History.vue')
                    },
                    {
                        path: 'rates',
                        name: 'Rates',
                        component: () => import('../components/users/Rates/Rates.vue')
                    },
                    {
                        path: 'wallet',
                        name: 'Wallet',
                        component: () => import('../components/users/Wallet/Wallet.vue')
                    },
                    {
                        path: 'settings/:settingsState',
                        name: 'Settings',
                        component: () => import('../components/users/Settings/Settings.vue'),
                        beforeEnter: function (to, from, next) {
                            if (to.params.settingsState !== 'profile' && to.params.settingsState !== 'notifications')
                                next(`/auth/user/settings/profile`)
                            else next()
                        }
                    }
                ]
            },
            {
                path: 'admin',
                component: () => import('../views/admin/AdminDashboardView.vue'),
                children: [
                    {
                        path: 'dashboard',
                        name: 'AdminDashboard',
                        component: () => import('../components/admin/AdminDashboard.vue')
                    },
                    {
                        path: 'transactions',
                        name: 'Transactions',
                        component: () => import('../components/admin/Transactions.vue')
                    },
                    {
                        path: 'user-management/:status',
                        name: 'UserManagement',
                        component: () => import('../components/admin/UserManagement/UserManagement.vue')
                    },
                    {
                        path: 'giftcard-management/:status',
                        name: 'GiftCardManagement',
                        component: () => import('../components/admin/GiftCardManagement/GiftCardManagement.vue')
                    },
                    {
                        path: 'bitcoin-management',
                        name: 'BitcoinManagement',
                        component: () => import('../components/admin/BitcoinManagement/BitcoinManagement.vue')
                    },
                    {
                        path: 'merchant-management',
                        name: 'MerchantManagement',
                        component: () => import('../components/admin/MerchantManagement/MerchantManagement.vue')
                    },
                    {
                        path: 'admin-management',
                        name: 'AdminManagement',
                        component: () => import('../components/admin/AdminManagement/AdminManagement.vue')
                    },
                    {
                        path: 'rates-calculator',
                        name: 'RatesCalculator',
                        component: () => import('@/components/admin/GiftCardManagement/RatesCalculatorTable')
                    },
                    {
                        path: 'requests-management',
                        name: 'RequestsManagement',
                        component: () => import('../components/admin/RequestsManagement/RequestsManagement.vue')
                    },
                    {
                        path: 'edit-cards',
                        name: 'EditCards',
                        component: () => import('../components/admin/EditCards')
                    },
                    {
                        path: 'edit-cards/view-types/:card_id',
                        name: 'EditTypes',
                        component: () => import('../components/admin/EditCardTypeTable')
                    }
                ]
            }
        ],
        meta: {
            requiresAuth: true
        }
    }
]
import getters from './getters'
import actions from '@/store/transactions/actions'
import mutations from '@/store/transactions/mutations'

const state = {
    userTransactions: [],
    usersTransactions: [],
}

export default {
    state,
    getters,
    actions,
    mutations
}
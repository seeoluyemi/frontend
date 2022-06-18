import {getUserTransactions} from "@/apis";
import {capitalizeStr} from "@/utils/helpers";

export default {
    async getUserTransactions({ commit }, id) {
        const getProgressText = progress => {
            if (progress === 'completed') {
                return 'Successful'
            } else {
                return capitalizeStr(progress)
            }
        }
        const { data: { data: { transaction:transactions } } } = await getUserTransactions(id)
        console.log(transactions, 'actions')
        commit('SET_USER_TRANSACTIONS', transactions.map(transaction => ({...transaction, progress: getProgressText(transaction.progress)})))
    }
}
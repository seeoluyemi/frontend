import getters from './getters';
import actions from './actions';
import mutations from "@/store/wallet/mutations";

const state = {
    wallet: 0.00
}

export default {
    state,
    getters,
    actions,
    mutations
}
import getters from './getters';
import mutations from "@/store/bitcoin/mutations";
import actions from "@/store/bitcoin/actions";

const state = {
    bitcoinInfo: [],
    btcInNaira: 'N4,322,521.20',
}

export default {
    state,
    getters,
    mutations,
    actions
}
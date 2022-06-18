import {getBitcoinRate} from "@/apis";

export default {
    async getBitcoinRate({commit}) {
        const {data: {data: {bitcoinRate}}} = await getBitcoinRate()
        commit("SET_BITCOIN_RATE", bitcoinRate.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
    }
}
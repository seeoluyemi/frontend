import {creditWallet,fetchWallet,debitWallet} from "@/apis";

export default {
    async walletCredit({commit},payload) {
        try {
            const {userId} = payload
            const res = await creditWallet(userId,payload)
            const status = res.status
            if(status === 200 || res.status === 201){
                const wallet = res.data.data.wallet;
                commit("setWallet", wallet)
                return res;
            }
            console.error(res.data.errors.title);
            return res;

        } catch (e) {
            console.error(e, e.response)
        }
    },

    async getWallet({commit},payload){
        try {
            const {userId} = payload
            const res = await fetchWallet(userId)
            const status = res.status
            if(status === 200 || res.status === 201){
                const wallet = res.data.data.wallet;
                commit("setWallet", wallet)
                return res;
            }
            console.error(res.data.errors.title);
            return res;

        } catch (e) {
            console.error(e, e.response)
        }
    },

    // eslint-disable-next-line no-unused-vars
    async walletDebit({commit},payload){
        const {userId} = payload
        const res = await debitWallet(userId,payload)
        const status = res.status
        if(status === 200 || res.status === 201){
            const wallet = res.data.data.wallet;
            commit("setWallet", wallet)
            return res;
        }
        return res;
    }
}
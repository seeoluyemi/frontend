import {getUser} from "@/apis";

export default {
    async fetchUser({commit}) {
        const {data: {data: {user}}} = await getUser()
        commit('setUser', user)
    }
}
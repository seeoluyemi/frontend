import {getAllAvailableCards, getCardTypes} from "@/apis";

export default {
    async fetchBrands({commit}) {
        const {data} = await getAllAvailableCards()
        const cards = data.data.cards
        commit("setBrands", cards)
    },
    async setSelectedBrand({commit}, brand) {
        commit("setFetchingTypes", true)
        commit("setAvailableCountries", [])
        commit("setCardTypes", [])
        commit("setSelectedCountry", {})
        commit("setSelectedBrand", brand.id)
        const {data} = await getCardTypes(brand.id)
        const types = data.data.card_types
        commit("setCardTypes", types)
        commit("setFetchingTypes", false)
    },
}

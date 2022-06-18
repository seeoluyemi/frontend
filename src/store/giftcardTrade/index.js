import getters from './getters';
import mutations from './mutations'
import actions from "@/store/giftcardTrade/actions";

const state = {
    selectedBrand: {id: null},
    availableCountries: [],
    selectedCountry: {},
    selectedCardType: {},
    brands: [],
    cardTypes: [],
    fetchingTypes: false,
}

export default {
    state,
    getters,
    mutations,
    actions
}
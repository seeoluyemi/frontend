import Vue from 'vue'
import Vuex from 'vuex'
import onBoarding from "./onBoarding";
import wallet from './wallet';
import giftcardTrade from './giftcardTrade';
import bitcoin from './bitcoin'
import transactions from './transactions'
import global from './global';
import rates from './rates';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  modules: {
    onBoarding,
    transactions,
    wallet,
    giftcardTrade,
    bitcoin,
    global,
    rates
  }
})

import getters from "./getters";
import mutations from "./mutations";
import actions from "@/store/onBoarding/actions";

const state = {
    user: {},
    loggedIn: false,
    menuToggle: false,
}

export default {
    state,
    getters,
    mutations,
    actions
}
import getters from "@/store/global/getters";
import mutations from "@/store/global/mutations";
import actions from "@/store/global/actions";

const state = {
    errorOrSuccessDialog: false,
    errorOrSuccessTitle: '',
    errorOrSuccessMessage: '',
    success: null,
    snackbar: {
        message: '',
        success: true,
        timeout: 5000,
        display: false
    }
}

export default {
    state,
    mutations,
    getters,
    actions
}
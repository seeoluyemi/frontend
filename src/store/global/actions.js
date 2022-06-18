export default {
    setSnackbar({commit, getters}, snackbar) {
        commit('setSnackbar', {display: true, ...snackbar})
        setTimeout(() => commit('setSnackbar', {display: false,}), getters.snackbar.timeout)
    }
}
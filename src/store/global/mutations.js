export default {
    setErrorOrSuccessDialog: (state, open) => state.errorOrSuccessDialog = open,
    setErrorOrSuccessMessage: (state, message) => state.errorOrSuccessMessage = message,
    setErrorOrSuccessTitle: (state, title) => state.errorOrSuccessTitle = title,
    setSuccess: (state, success) => state.success = success,
    setSnackbar: (state, snackbar) => {
        const keys = Object.keys(snackbar)
        keys.forEach(key => state.snackbar[key] = snackbar[key])
    },
    setGlobalModal: (state, {success, title, message}) => {
        state.errorOrSuccessDialog = true
        state.errorOrSuccessMessage = message || ''
        state.errorOrSuccessTitle = title || ''
        state.success = success
    }
}
const determineMessage = e => {
    let message = 'Something went wrong!'
    console.log(e)
    if (!e.response || !e.response.data || !e.response.data.errors) {
        return message
    } else {
        const [{code, title, source}] = e.response.data.errors
        if (code === "005") {
            message = source[Object.keys(source)[0]]
        } else message = title
        return message
    }
}

export function displaySnackbar(e) {
    let message
    if (typeof e === 'string') {
        message = e
    } else message = determineMessage(e)
    this.$store.dispatch('setSnackbar', {message, success: false})
}
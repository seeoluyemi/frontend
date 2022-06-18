

const handleError = (err, self) => {
    if (err.response && err.response.data.errors[0].title === "Your Account has been inactive for a while.. kindly login") {
        sessionStorage.clear()
        console.log(self, self.$store)
        const email = localStorage.getItem('user_login')
        self.$store.commit('setErrorOrSuccessDialog', true)
        self.$store.commit('setSuccess', true)
        self.$store.commit('setErrorOrSuccessTitle', 'Session timed out.')
        self.$store.commit('setErrorOrSuccessMessage', 'You\'ll be logged out in a second')
        setTimeout(() => {
            logout(self)
            localStorage.setItem('user_login', email)
        }, 500)
    }
}

const logout = (that) => {
    localStorage.clear()
    that.$store.commit('setLoggedIn', false)
    that.$router.push({ name: 'Login' })
}

export default handleError
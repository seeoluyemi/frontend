export default {
    switchToggle: state => state.menuToggle = !state.menuToggle,
    toggleNav: (state, toggle) => state.menuToggle = toggle,
    updateUserRole: (state, role) => state.user.role = role,
    setUser: (state, user) => {
        user.firstName = user.name.split(' ')[0]
        user.lastName = user.name.split(' ')[1]
        state.user = user
    },
    setUserImage: (state, image) => state.user.image = image,
    setLoggedIn: (state, loggedIn) => state.loggedIn =loggedIn
}
<template>
  <div>
    <user-dashboard-top>
      <div class="ah-w-1/2">
        <settings-state/>
      </div>
    </user-dashboard-top>
    <component :is="currentComp"/>
  </div>
</template>

<script>
import UserDashboardTop from "@/components/users/UserDashboardTop";
import SettingsState from "@/components/users/Settings/SettingsState";
import ProfileSettings from "@/components/users/Settings/ProfileSettings";
import Banks from "@/components/users/Settings/Banks";
import Security from "@/components/users/Settings/Security";
import {mapGetters} from "vuex";
export default {
name: "Settings",
  components: {SettingsState, UserDashboardTop},
  computed: {
  ...mapGetters(['user']),
    currentComp() {
      let component = null
      const { params: {settingsState} } = this.$route
      if (settingsState === 'profile') component = ProfileSettings
      if (settingsState === 'banks') component = Banks
      if (settingsState === 'security') component = Security
      return component
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.user.user_type !== 'customer' && (vm.user.user_type === 'super_admin' || vm.user.user_type === 'admin')) {
        vm.$router.push({ name: 'AdminDashboard' })
      } else next()
    })
  }
}
</script>

<style scoped lang="scss">

</style>
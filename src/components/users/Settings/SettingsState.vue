<template>
  <dashboard-inner-content-state-indicator @change="route" :links="links"/>
</template>

<script>
import DashboardInnerContentStateIndicator from "@/components/resuables/DashboardInnerContentStateIndicator";
export default {
  name: "SettingsState",
  components: {DashboardInnerContentStateIndicator},
  data() {
    return {
      links: [
        {
          label: 'Profile',
          to: { name: 'Settings', params: { settingsState: 'profile' } }
        },
        {
          label: 'Banks',
          to: { name: 'Settings', params: { settingsState: 'banks' } }
        },
        {
          label: 'Security',
          to: { name: 'Settings', params: { settingsState: 'security' } }
        }
      ]
    }
  },
  methods: {
    route(value) {
      this.$router.push({
        name: 'Settings',
        params: { settingsState: value }
      })
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <dashboard-inner-content-state-indicator @change="route" :links="labels"/>
</template>

<script>
import DashboardInnerContentStateIndicator from "@/components/resuables/DashboardInnerContentStateIndicator";

export default {
  name: "HistoryFilter",
  components: {DashboardInnerContentStateIndicator},
  data() {
    return {
      labels: [
        {
          label: 'All',
          to: {name: 'History', query: {filter_key: 'all'}}
        },
        {
          label: 'Successful',
          to: {name: 'History', query: {filter_key: 'successful'}}
        },
        {
          label: 'Pending',
          to: {name: 'History', query: {filter_key: 'pending'}}
        },
        {
          label: 'Cancelled',
          to: {name: 'History', query: {filter_key: 'cancelled'}}
        },
      ]
    }
  },
  methods: {
    route(value) {
      this.$router.push({
        name: 'History',
        query: {
          filter_key: value
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
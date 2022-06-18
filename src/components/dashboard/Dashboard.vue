<template>
  <div>
    Hello
<!--    <DashboardHeader/>-->
    <the-dashboard-header/>
  </div>
</template>

<script>
// import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TheDashboardHeader from "@/components/dashboard/TheDashboardHeader";
export default {
  name: "Dashboard",
  components: {TheDashboardHeader}
}
</script>

<style scoped>

</style>
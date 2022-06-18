<template>
  <line-chart v-if="type === 'line'" :chart-data="chartData" :options="{ ...defaultOptions, ...options }"/>
  <bar-chart v-else-if="type === 'bar'" :chart-data="chartData" :options="{ ...defaultOptions, ...options }"/>
</template>

<script>
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
export default {
  name: "DashboardOverviewChart",
  components: {BarChart, LineChart},
  data() {
    return {
      defaultOptions: {
        scales: {
          xAxes: [
            {
              display: false
            }
          ],
          yAxes: [
            {
              display: false,
            }
          ]
        },
        tooltips: { enabled: false },
        hover: { mode: null },
        legend: { display: false }
      }
    }
  },
  props: {
    type: String,
    chartData: Object,
    options: Object
  }
}
</script>

<style scoped>

</style>
<script>
import { Line } from "vue-chartjs"

export default {
  name: "LineChart",
  extends: Line,
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
  props: {
    chartData: Object,
    options: Object
  }
}
</script>

<style scoped>

</style>
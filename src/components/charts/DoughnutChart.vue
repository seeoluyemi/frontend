<script>
import {Doughnut, mixins} from "vue-chartjs"

export default {
  name: "DoughnutChart",
  extends: Doughnut,
  mixins: [mixins.reactiveProp],
  computed: {
    computedOptions() {
      return {
        ...this.options,
        // legendCallback(chart) {
        //   let legendHTML = []
        //   legendHTML.push(`<ul class='doughnut-legend'>`)
        //   for (let i = 0; i < chart.data.labels.length; i++) {
        //     legendHTML.push(`<li><span class="legend-list-style-${i}" style="width: 20px; height: 20px; border-radius: 50%; background: ${chart.data.datasets[0].backgroundColor[i]}"></span>`)
        //     legendHTML.push(`<span class='legend-label'>${chart.data.labels[i]}</span></li>`)
        //   }
        //   legendHTML.push(`</ul>`)
        //   return legendHTML.join('')
        // }
      }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.computedOptions)
    // document.querySelector('#doughnutLegend').innerHTML = this.generateLegend()
  },
  props: {
    chartData: Object,
    options: Object
  }
}
</script>

<style lang="scss" scoped>
.legend-list-style-0 {
  background: linear-gradient(to right, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>
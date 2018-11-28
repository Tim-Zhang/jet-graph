<template>
  <div ref="container" class="charts">
  </div>
</template>
<script>
import helper from '../lib/helper'
const echarts = window.echarts

export default {
  props: ['rra', 'dsNames', 'lastUpdate', ],
  data() {
    return {
      charts: [],
    }
  },
  mounted() {
    this.initCharts()
    this.renderCharts()
  },
  methods: {
    initChart() {
      const div = document.createElement('div')
      div.style.width = '50%'
      div.style.height = '400px'
      this.$refs.container.appendChild(div)
      const chart = echarts.init(div)
      this.charts.push(chart)
    },
    initCharts() {
      const nrDSs = this.rra.getNrDSs()
      for (let i=0; i<nrDSs; i++) {
        this.initChart()
      }
    },
    renderChart(data, idx, rraLabel) {
      let option

      option = {
          legend: {},
          tooltip: {
            trigger: 'axis',
            axisPointer: { animation: false },
            formatter(params) {
              const date = helper.getLocaleTimeString(params[0].value[0])
              return date + params.map(param => `<br/>${param.marker}${param.value[1]}`)
            },
          },
          title: {
            left: 'center',
            text: this.dsNames[idx],
            subtext: rraLabel,
          },
          dataset: {
            source: data
          },
          xAxis: {type: 'time', axisLabel: {formatter(timestamp) {
            return helper.getLocaleTimeString(timestamp)
          }}},
          yAxis: {},
          series: [
              {
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                areaStyle: {normal: {opacity: 0.6}},
                lineStyle: {normal: {width: 1}},
                itemStyle: {color: 'green'},
              },
          ]
      };
      this.charts[idx].setOption(option)
    },

    renderCharts() {
      const nrDSs = this.rra.getNrDSs()
      for (let dsIdx = 0; dsIdx < nrDSs; dsIdx++) {
        const rra = this.rra
        const rowCount = rra.getNrRows()

        const step = rra.getStep()

        const firstElTimestamp = this.lastUpdate - (rowCount - 1) * step
        let timestamp = firstElTimestamp

        const data = []

        for (let i = 0; i < rowCount; i++) {
          const el = rra.getEl(i, dsIdx)
          if (el != undefined) {
            data.push([timestamp * 1000, el])
          }
          timestamp += step
        }
        const rraLabel = helper.getRraLabel(rra)
        this.renderChart(data, dsIdx, rraLabel)
      }

    },
  },

  watch: {
    rra: 'renderCharts'
  }
}

</script>

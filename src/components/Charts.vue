<template>
  <div ref="container" class="charts">
  </div>
</template>
<script>
import helper from '../lib/helper'
import config from '../config'

const echarts = window.echarts

export default {
  props: ['rra', 'dsNames', 'lastUpdate', ],
  data() {
    return {
      charts: {},
    }
  },
  mounted() {
    this.initCharts()
    this.renderCharts()
  },
  methods: {
    initChart(name) {
      const div = document.createElement('div')
      div.style.width = '50%'
      div.style.minWidth = '500px'
      div.style.height = '400px'
      this.$refs.container.appendChild(div)
      const chart = echarts.init(div)
      this.charts[name] = chart
    },
    initCharts() {
      for (let name of this.dsNames) {
        const dsConf = config.ds[name] || {}
        if (!dsConf.merge) this.initChart(name)
      }
    },
    renderChart({data, name, rraLabel}) {
      if (!data || !data.length) return

      const dsConf = config.ds[name] || {}
      const unit = dsConf.unit || ''
      const ratio = dsConf.ratio
      const g = dsConf.g || 1024

      const chartName = dsConf.merge || name
      const title = dsConf.title || name

      data = data.map((d, i) => {
        if (i === 0) return d
        return d.map((item, idx) => {
          if (idx === 0) return item
          return item / ratio
        })
      })

      const seriesItem = {
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        areaStyle: {normal: {opacity: 0.6}},
        lineStyle: {normal: {width: 1}},
      }

      const series = data[0].slice(1).map((col, idx) => Object.assign({}, seriesItem, {
        name: col,
        encode: {x: 'time', y: col,},
        itemStyle: {color: config.stackColors[idx] || ''},
      }))

      // Do not show legend if there is only one series
      if (series.length === 1) delete series[0].name

      const option = {
          legend: {orient: 'vertical', align: 'right', right: 50, },
          toolbox: {
            feature: {saveAsImage: {title: 'Save'}}
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { animation: false },
            formatter(params) {
              const date = helper.getLocaleTimeString(params[0].value[0])

              return date + '<br/>' + params.map((param, idx) => {
                let value = param.value[idx + 1] + ' ' + unit
                if (ratio > 1) value = helper.filesize(param.value[idx + 1] * ratio, g)
                return `${param.marker}${value}`
              }).join('<br/>')
            },
          },
          dataZoom: [
            {
              show: true,
              type: 'slider',
              start: 0,
              end: 100,
              y: '90%',
            }
          ],
          title: {
            text: title,
            subtext: rraLabel,
            left: 'center',
          },
          dataset: {
            source: data
          },
          xAxis: {type: 'time', axisLabel: {formatter(timestamp) {
            return helper.getLocaleTimeString(timestamp)
          }}},
          yAxis: {name: unit, axisLabel: {formatter(value) {
            return value
          }}},
          series,
      };
      this.charts[chartName].setOption(option)
    },

    renderCharts() {
      const rraLabel = helper.getRraLabel(this.rra)
      const nrDSs = this.rra.getNrDSs()
      const dataset = {}

      for (let dsIdx = 0; dsIdx < nrDSs; dsIdx++) {
        const rra = this.rra
        const rowCount = rra.getNrRows()

        const step = rra.getStep()

        const firstElTimestamp = this.lastUpdate - (rowCount - 1) * step
        let timestamp = firstElTimestamp

        const data = []
        const name = this.dsNames[dsIdx]

        for (let i = 0; i < rowCount; i++) {
          const el = rra.getEl(i, dsIdx)
          if (el != undefined) {
            data.push([timestamp * 1000, Number(el.toFixed(2))])
          }
          timestamp += step
        }

        data.unshift(['time', name])
        dataset[name] = data
      }

      Object.keys(config.ds).forEach((name) => {
        const conf = config.ds[name]
        if (conf.merge) {
          dataset[conf.merge] = dataset[conf.merge].map((d, idx) => {
            return d.concat(dataset[name][idx][1])
          })

          delete dataset[name]
        }
      })

      Object.keys(dataset).forEach(name => this.renderChart({data: dataset[name], name, rraLabel}))
    },

    getDsNameByIdx(idx) {
      return this.dsNames[idx]
    },

    getDsConfigByIdx(idx) {
      const name = this.getDsNameByIdx(idx)
      return config.ds[name]
    },
  },

  watch: {
    rra: 'renderCharts'
  }
}

</script>

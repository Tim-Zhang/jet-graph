<template>
  <div>
    <input type="file" id="files" name="files[]" multiple @change="handleFileSelect"/>
    <RRASel :rrd="rrd" v-if="rrd" v-model="rraIdx"></RRASel>
    &nbsp;<DSNameSel :rrd="rrd" v-if="rrd" v-model="dsIdx"></DSNameSel>
    <div ref="container" style="width: 100%;height:500px;"></div>
  </div>
</template>

<script>
import RRDFile from '../lib/RRDFile'
import {BinaryFile} from '../lib/binaryXHR'
import helper  from '../lib/helper'

import RRASel from '../components/RRASel'
import DSNameSel from '../components/DSNameSel'

const echarts = window.echarts

export default {
  data() {
    return {
      rrd: null,
      rraIdx: 0,
      dsIdx: 0,
    }
  },

  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.container)
    },
    renderChart(data) {
      this.chart || this.initChart()
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

      this.chart.setOption(option)
    },
    render() {
      const lastUpdate = this.rrd.getLastUpdate()
      const rra = this.rrd.getRRA(this.rraIdx)
      const rowCount = rra.getNrRows()

      const step = rra.getStep()

      const firstElTimestamp = lastUpdate - (rowCount - 1) * step
      let timestamp = firstElTimestamp

      const data = []

      for (let i = 0; i < rowCount; i++) {
        const el = rra.getEl(i , this.dsIdx)
        if (el != undefined) {
          data.push([timestamp * 1000, el])
        }
        timestamp += step
      }

      this.renderChart(data)
    },
    handleFileSelect(evt) {
      var files = evt.target.files; // FileList object

      // Loop through the FileList and render image files as thumbnails.
      for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onloadend = () => {
          // console.log()
          this.rrd = new RRDFile(new BinaryFile(reader.result))
          this.render()
        }

        // Read in the image file as a data URL.
        reader.readAsBinaryString(f);
      }
    },

  },
  async created() {
    const bf = await helper.fetchRrd('/docker_stats.rrd')
    this.rrd = new RRDFile(bf)
    this.render()
  },

  watch: {
    rraIdx: 'render',
    dsIdx: 'render',
  },

  components: {
    RRASel, DSNameSel,
  }
}
</script>

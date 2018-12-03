<template>
  <div>
    <ServiceInstanceSel :stackName="stackName" :services="services"></ServiceInstanceSel>
    <RRASel :rrd="rrd" v-if="rrd" v-model="rraIdx"></RRASel>
    <Charts v-if="rra" :rra="rra" :dsNames="dsNames" :lastUpdate="lastUpdate"></Charts>
    <div v-else>Loading ...</div>
  </div>
</template>

<style scoped>
  .charts {
    display: flex;
    flex-wrap: wrap;
  }
</style>


<script>
import RRDFile from '../lib/RRDFile'
import helper  from '../lib/helper'

import RRASel from '../components/RRASel'
import ServiceInstanceSel from '../components/ServiceInstanceSel'
import Charts from '../components/Charts'

export default {
  data() {
    return {
      rrd: null,
      rra: null,
      rraIdx: 0,
      stackName: '',
      services: [],
      dsNames: [],
    }
  },

  methods: {
    render() {
      if (!this.rrd) return
      this.lastUpdate = this.rrd.getLastUpdate()
      this.rra = this.rrd.getRRA(this.rraIdx)
      this.dsNames = Array.from(Array(this.rrd.getNrDSs()).keys()).map(i => this.rrd.getDS(i).getName())
    },

    async fetchRrd() {
      const {stackName, serviceName, instanceId} = this.$route.params
      if (!stackName || !serviceName || !instanceId) return

      let bf
      try {
        bf = await helper.fetchRrd(`/${stackName}/${serviceName}/${instanceId}.rrd`)
        setTimeout(this.fetchRrd, 30 * 1000) // Update the graph
      } catch (e) {
        // The rrd file may not ready, try reload later
        if (e.message === '404') {
          setTimeout(this.fetchRrd, 3 * 1000)
          return
        }
        throw e
      }
      this.rrd = new RRDFile(bf)
      this.render()
    },

    async fetchMeta() {
      const meta = await fetch('/meta.json')
      if (meta.status === 404) {
        return setTimeout(this.fetchMeta, 1500)
      }
      const metaJson = await meta.json()
      this.stackName = metaJson.Stack

      this.services = metaJson.Services.map(service => ({name: service.Name, instances: service.Instances}))
    },
  },
  async created() {
    await this.fetchMeta()
    await this.fetchRrd()
  },

  watch: {
    rrd: 'render',
    rraIdx: 'render',
    $route: 'fetchRrd'
  },

  components: {
    RRASel, ServiceInstanceSel, Charts,
  }
}
</script>

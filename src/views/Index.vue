<template>
  <div>
    <ServiceInstanceSel :stackName="stackName" :services="services"></ServiceInstanceSel>
    <RRASel :rrdData="rrdData" v-if="rrdData" v-model="rraIdx"></RRASel>
    <Charts v-if="rrdData" :rrdData="rrdData" :rraIdx="rraIdx"></Charts>
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
import helper  from '../lib/helper'

import RRASel from '../components/RRASel'
import ServiceInstanceSel from '../components/ServiceInstanceSel'
import Charts from '../components/Charts'

export default {
  data() {
    return {
      rraIdx: 0,
      stackName: '',
      services: [],
      dsNames: [],
      lastUpdate: 0,
      rrdData: null,
    }
  },

  methods: {
    async fetchRrd() {
      const {stackName, serviceName, instanceId} = this.$route.params
      if (!stackName || !serviceName || !instanceId) return

      try {
        this.rrdData = await helper.fetchRrd(`/${stackName}/${serviceName}/${instanceId}.rrd`)
        setTimeout(this.fetchRrd, 10 * 1000) // Update the graph
      } catch (e) {
        // The rrd file may not ready, try reload later
        if (e.message === '404') {
          setTimeout(this.fetchRrd, 3 * 1000)
          return
        }
        throw e
      }
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
    $route: 'fetchRrd'
  },

  components: {
    RRASel, ServiceInstanceSel, Charts,
  }
}
</script>

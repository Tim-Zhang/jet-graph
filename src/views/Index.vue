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

    async fetch() {
      const {stackName, serviceName, instanceId} = this.$route.params
      if (!stackName || !serviceName || !instanceId) return

      const bf = await helper.fetchRrd(`/${stackName}/${serviceName}/${instanceId}.rrd`)
      this.rrd = new RRDFile(bf)
      this.render()
    },
  },
  async created() {
    const meta = await fetch('/meta.json')
    const metaJson = await meta.json()
    this.stackName = metaJson.Stack

    this.services = metaJson.Services.map(service => ({name: service.Name, instances: service.Instances}))
    this.fetch()
  },

  watch: {
    rrd: 'render',
    rraIdx: 'render',
    $route: 'fetch'
  },

  components: {
    RRASel, ServiceInstanceSel, Charts,
  }
}
</script>

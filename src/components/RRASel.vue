<template>
  <select @change="$emit('input', $event.target.value)">
    <option :key="idx" v-for="(label, idx) in labels" :value="idx">{{label}}</option>
  </select>
</template>

<script>
import helper from '../lib/helper'

export default {
  props: ['rrd', 'value'],
  computed: {
    labels() {
      const lbs = []
      for (let i = 0; i < this.rrd.getNrRRAs(); i++) {
        const rra = this.rrd.getRRAInfo(i)
        const step = rra.getStep()
        const rows = rra.getNrRows()
        const period = step * rows
        let label = helper.rfsFormatTime(step) + " (" + helper.rfsFormatTime(period) + " total)"
        label += " " + rra.getCFName()
        lbs.push(label)
      }
      return lbs
    }
  },
}
</script>

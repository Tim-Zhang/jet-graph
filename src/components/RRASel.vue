<template>
  <div>
    RRA:
    <select @change="$emit('input', $event.target.value)">
      <option :key="idx" v-for="(label, idx) in labels" :value="idx">{{label}}</option>
    </select>
  </div>
</template>

<style scoped>
  div {
    margin: 20px;
  }
</style>


<script>
import helper from '../lib/helper'

export default {
  props: ['rrd', 'value'],
  computed: {
    labels() {
      const lbs = []
      for (let i = 0; i < this.rrd.getNrRRAs(); i++) {
        const rra = this.rrd.getRRAInfo(i)
        lbs.push(helper.getRraLabel(rra))
      }
      return lbs
    }
  },
}
</script>

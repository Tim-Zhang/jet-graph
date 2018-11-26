<template>
  <select @change="$emit('input', $event.target.value)">
    <option :key="idx" v-for="(label, idx) in labels" :value="idx">{{label}}</option>
  </select>
</template>

<script>
export default {
  props: ['rrd', 'value'],

  computed: {
    labels() {
      const lbs = []
      for (let i = 0; i < this.rrd.getNrDSs(); i++) {
        const ds = this.rrd.getDS(i)
        lbs.push(ds.getName())
      }
      return lbs
    }
  },
}
</script>

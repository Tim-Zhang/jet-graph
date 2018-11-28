<template>
  <div>
    Service: <select v-model="selectedServiceName">
      <option :key="serviceName" v-for="serviceName in serviceNames" :value="serviceName">{{serviceName}}</option>
    </select>
    Instance: <select v-model="selectedInstanceId">
      <option :key="i.id" v-for="i in instances" :value="i.id">{{i.id}}</option>
    </select>
  </div>
</template>

<style scoped>
  div {
    margin: 20px;
  }
</style>


<script>
export default {
  props: ['services', 'stackName'],
  data() {
    return {
      serviceNames: [],
      instances: [],
      selectedServiceName: '',
      selectedInstanceId: '',
    }
  },

  methods: {
    initPaths() {
      const service = this.services.find(service => service.name === this.selectedServiceName)
      if (!service) return

      this.instances = service.instances.map((path) => {
        return {
          id: path.split('/').slice(-1)[0].slice(0, -4),
          path: path,
        }
      })

      this.selectedInstanceId = this.instances[0] && this.instances[0].id

      const {stackName, instanceId} = this.$route.params

      if (instanceId && stackName) {
        if (!this.instances.length) this.instances = [instanceId]
        if (this.instances.includes(instanceId)) this.selectedInstanceId = instanceId
      }

      this.changeRoute()
    },
    initServices() {
      this.serviceNames = this.services.map(service => service.name)
      this.selectedServiceName = this.serviceNames[0]

      const {serviceName} = this.$route.params
      if (!this.serviceNames.length && serviceName) {
        this.serviceNames = [serviceName]
      }

      if (serviceName && this.serviceNames.includes(serviceName)) this.selectedServiceName = serviceName
    },

    changeRoute() {
      this.$router.push(`/${this.selectedStackName}/${this.selectedServiceName}/${this.selectedInstanceId}`)
    },
  },

  computed: {
    selectedStackName() {
      return this.stackName || this.$route.stackName
    },
  },

  watch: {
    selectedServiceName: 'initPaths',
    services: 'initServices',
    $route: 'initServices',
    selectedInstanceId: 'changeRoute',
  },
}
</script>

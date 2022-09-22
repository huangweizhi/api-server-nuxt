<template>
  <div>
    <Logo />
    <h2>api-server</h2>
    <ul v-for="item in users">
      <li>{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  layout: 'indexPageLayout',
  data() {
    return {
      users: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      let {data: res} = await this.$axios.get('/users')
      this.users = res
    }
  }
}
</script>

<style scoped>

</style>

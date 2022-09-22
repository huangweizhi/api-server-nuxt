<template>
  <div>
    <p class="title">
      <span>项目名</span>
      <b-button size="sm" class="my-2 my-sm-0" variant="success" @click="showAdd">新建接口</b-button>
      <b-button size="sm" class="my-2 my-sm-0" variant="info" @click="getData">刷新</b-button>
    </p>

    <b-table striped hover :items="items" :fields="fields">
      <!-- 序号 -->
      <template #cell(index)="row">{{row.index+1}}</template>
      <!-- 操作栏 -->
      <template #cell(todo)="row">
        <b-button size="sm" class="my-2 my-sm-0" variant="warning" @click="showEdit(row.item)">修改</b-button>
        <b-button size="sm" class="my-2 my-sm-0" variant="danger" @click="showDelete(row.item)">删除</b-button>
        <b-button size="sm" class="my-2 my-sm-0" variant="info" @click="row.toggleDetails">
          {{ row.detailsShowing ? '关闭' : '查看'}}
        </b-button>
      </template>

      <!-- 详情 -->
      <template #row-details="row">
        详情
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  layout: 'common-layout',
  data() {
    return {
      fields: [
        {key: 'index', label: '#'},
        {key: 'path', label: '路径'},
        {key: 'method', label: '方法'},
        {key: 'desc', label: '说明'},
        {key: 'todo', label: '操作'}
      ],
      items: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      let {data: res} = await this.$axios.get('/api/handle')
      this.items = res.data
    },
    /**
     * 新建
     */
    showAdd() {

    },
    /**
     * 修改
     */
    showEdit(item) {
      console.log(item)
    },
    /**
     * 删除
     */
    showDelete(item) {
      console.log(item)
    }
  }
}
</script>

<style scoped>
.title {
  margin-top: 1rem;
}
.title span {
  font-weight: 700;
  margin-right: 1rem;
}
</style>

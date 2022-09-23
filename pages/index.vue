<template>
  <div>
    <!-- 标题 -->
    <p class="title">
      <span>项目名</span>
      <b-button size="sm"  variant="success" @click="showAdd">新建接口</b-button>
      <b-button size="sm"  variant="info" @click="getData">刷新</b-button>
    </p>

    <!-- 表格 -->
    <b-table striped hover :items="items" :fields="fields">
      <!-- 序号 -->
      <template #cell(index)="row">{{row.index+1}}</template>
      <!-- 操作栏 -->
      <template #cell(todo)="row">
        <b-button size="sm"  variant="warning" @click="showEdit(row.item)">修改</b-button>
        <b-button size="sm"  variant="danger" @click="showDelete(row.item)">删除</b-button>
        <b-button size="sm"  variant="info" @click="row.toggleDetails">
          {{ row.detailsShowing ? '关闭' : '查看'}}
        </b-button>
      </template>

      <!-- 详情 -->
      <template #row-details="row">
        详情
      </template>
    </b-table>

    <!-- 新建&&修改 -->
    <b-modal
      v-model="modalShow"
      ref="modal"
      title="新建接口"
      @hidden="resetModal"
      @ok="handleOk"
      size="lg"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="路径"
          label-for="path-input"
          invalid-feedback="请输入路径"
          :state="pathState"
        >
          <b-form-input
            id="path-input"
            v-model="path"
            :state="pathState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="方法"
          label-for="method-input"
          invalid-feedback="请输入方法"
          :state="methodState"
        >
          <b-form-input
            id="method-input"
            v-model="method"
            :state="methodState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="响应内容"
          label-for="content-input"
          invalid-feedback="请输入响应内容"
          :state="contentState"
        >
          <b-form-input
            id="content-input"
            v-model="content"
            :state="contentState"
            required
          ></b-form-input>
        </b-form-group>
      </form>

      <template #modal-cancel>取消</template>
      <template #modal-ok>确定</template>
    </b-modal>
  </div>
</template>

<script>
export default {
  layout: 'common-layout',
  data() {
    return {
      // 表格数据
      fields: [
        {key: 'index', label: '#'},
        {key: 'path', label: '路径'},
        {key: 'method', label: '方法'},
        {key: 'todo', label: '操作'}
      ],
      items: [],

      // 新建&&修改
      modalShow: false,
      modalFor: 'add', // 'edit'
      // 表单字段
      path: '',
      method: '',
      content: '',
      pathState: null,
      methodState: null,
      contentState: null
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    /**
     * 获取数据
     */
    async getData() {
      let {data: res} = await this.$axios.get('/api/handle')
      this.items = res.data
    },

    /**
     * 新建&&修改
     */
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.pathState = valid
      return valid
    },
    resetModal() {
      this.path = ''
      this.method = ''
      this.content = ''
      this.pathState = null
      this.methodState = null
      this.contentState = null
    },
    handleOk(bvModalEvent) {
      // 防止模态框关闭
      bvModalEvent.preventDefault()
      // 提交
      this.handleSubmit()
    },
    handleSubmit() {
      // 表单校验不通过
      if (!this.checkFormValidity()) {
        return
      }
      // 提交
      if(this.modalFor==='add') {
        // 新建
        this.handleAdd()
      }else {
        // 修改
        this.handleEdit()
      }
      // 关闭模态框
      this.$nextTick(() => {
        this.modalShow = false
      })
    },

    /**
     * 新建
     */
    showAdd() {
      this.modalFor = 'add'
      this.modalShow = true
    },
    handleAdd() {

    },

    /**
     * 修改
     */
    showEdit(item) {
      this.modalFor = 'edit'
      this.modalShow = true
      // 赋值
      this.path = item.path
      
    },
    handleEdit() {

    },

    /**
     * 删除
     */
    showDelete(item) {
      
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

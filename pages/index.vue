<template>
  <div>
    <!-- 标题 -->
    <TableHeader>
      <template v-slot:left>
        <span>项目</span>
      </template>
      <template v-slot:right>
        <b-button size="sm" variant="success" @click="showAdd">新建项目</b-button>
      </template>
    </TableHeader>

    <!-- 表格 -->
    <b-table striped hover :items="items" :fields="fields">
      <!-- 配置列 -->
      <template #table-colgroup="scope">
        <col
          v-for="field in scope.fields"
          :key="field.key"
          :style="{ width: field.key === 'todo' ? '200px' : '' }"
        >
      </template>

      <!-- 序号 -->
      <template #cell(index)="row">{{row.index+1}}</template>
      <!-- 操作栏 -->
      <template #cell(todo)="row">
        <b-button size="sm" variant="warning" @click="showEdit(row.item)">修改</b-button>
        <b-button size="sm" variant="danger" @click="showDelete(row.item)">删除</b-button>
        <b-button size="sm" variant="info" @click="showDetail(row.item)">查看</b-button>
      </template>
    </b-table>

    <!-- 新建&&修改 -->
    <b-modal
      v-model="formModalShow"
      :title="modalFor==='add'?'新建项目':'修改项目'"
      @hidden="resetFormModal"
      @ok="handleFormOk"
      size="lg"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="项目名"
          label-for="dir-name-input"
          :invalid-feedback="dirNameFeedback"
          :state="dirNameState"
        >
          <b-form-input
            id="dir-name-input"
            v-model="dirName"
            :state="dirNameState"
            autocomplete="off"
          ></b-form-input>
        </b-form-group>
      </form>

      <template #modal-cancel>取消</template>
      <template #modal-ok>确定</template>
    </b-modal>

    <!-- 删除 -->
    <b-modal
      v-model="deleteModalShow"
      title="删除项目"
      @ok="handleDeleteOk"
    >
      确定删除该项目吗？
      <template #modal-cancel>取消</template>
      <template #modal-ok>确定</template>
    </b-modal>

  </div>
</template>

<script>
export default {
  layout: 'common-layout',
  async asyncData({ $axios }) {
    let {data} = await $axios.$get(`/api/handle/category`)

    // 返回的数据会传递到data()
    return { 
      items: data
    }
  },
  data() {
    return {
      // 表格数据
      fields: [
        {key: 'index', label: '#'},
        {key: 'dirName', label: '项目名'},
        {key: 'todo', label: '操作'}
      ],
      items: [],

      // 新建&&修改
      formModalShow: false,
      modalFor: 'add', // 'edit'

      // 表单字段
      dirName: '',
      dirNameState: null,
      dirNameFeedback: '',

      // 删除
      deleteModalShow: false,
      deleteDir: {},
    }
  },
  methods: {
    /**
     * 获取数据
     */
    async getData() {
      let {data: res} = await this.$axios.get(`/api/handle/category`)
      if(!res.flag) {
        this.$bvToast.toast(res.message, {
          title: '提示',
          variant: 'danger',
          autoHideDelay: 2500
        })
        return 
      }
      this.items = res.data
    },

    /**
     * 字段校验
     */
    dirNameCheck() {
      if (this.dirName) {
        if(/^[A-Za-z0-9\-_]+$/.test(this.dirName)) {
          return true
        }else {
          this.dirNameFeedback = '项目名只能由  字母 数字 - _  构成'
          return false
        }
      }
      this.dirNameFeedback = '请输入项目名'
      return false
    },

    /**
     * 新建&&修改
     */
    checkFormValidity() {
      // const valid = this.$refs.form.checkValidity()
      // 自定义校验方法
      const valid = this.dirNameCheck()
      this.dirNameState = valid
      return valid
    },
    resetFormModal() {
      this.dirName = ''
      this.dirNameState = null
    },
    handleFormOk(bvModalEvent) {
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
    },

    /**
     * 新建
     */
    showAdd() {
      this.modalFor = 'add'
      this.formModalShow = true
    },
    async handleAdd() {
      let {data: res} = await this.$axios.post(`/api/handle/category`, {
        dirName: this.dirName
      })
      if(!res.flag) {
        this.$bvToast.toast(res.message, {
          title: '提示',
          variant: 'danger',
          autoHideDelay: 2500
        })
        return
      }
      this.$bvToast.toast(res.message, {
        title: '提示',
        variant: 'success',
        autoHideDelay: 2500
      })
      // 刷新数据
      this.getData()
      // 关闭模态框
      this.$nextTick(() => {
        this.formModalShow = false
      })
    },

    /**
     * 修改
     */
    showEdit(item) {
      this.modalFor = 'edit'
      this.formModalShow = true
      // 赋值
      this.dirName = item.dirName
      this.oldName = item.dirName
      
    },
    async handleEdit() {
      let {data: res} = await this.$axios.put(`/api/handle/category`, {
        dirName: this.dirName,
        oldName: this.oldName
      })
      if(!res.flag) {
        this.$bvToast.toast(res.message, {
          title: '提示',
          variant: 'danger',
          autoHideDelay: 2500
        })
        return
      }
      this.$bvToast.toast(res.message, {
        title: '提示',
        variant: 'success',
        autoHideDelay: 2500
      })
      // 刷新数据
      this.getData()
      // 关闭模态框
      this.$nextTick(() => {
        this.formModalShow = false
      })
    },

    /**
     * 删除
     */
    showDelete(item) {
      this.deleteDir = item
      this.deleteModalShow = true
    },
    async handleDeleteOk() {
      let {data: res} = await this.$axios.delete(`/api/handle/category/${this.deleteDir.dirName}`)
      if(!res.flag) {
        this.$bvToast.toast(res.message, {
          title: '提示',
          variant: 'danger',
          autoHideDelay: 2500
        })
        return
      }
      this.$bvToast.toast(res.message, {
        title: '提示',
        variant: 'success',
        autoHideDelay: 2500
      })
      // 刷新数据
      this.getData()
      // 关闭模态框
      this.$nextTick(() => {
        this.deleteModalShow = false
      })
    },

    /**
     * 查看
     */
    async showDetail(item) {
      // 文件名
      this.$router.push('/category/'+item.dirName)
    }

  }
}
</script>

<style scoped>

</style>

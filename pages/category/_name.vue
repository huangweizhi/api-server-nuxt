<template>
  <div>
    <!-- 标题 -->
    <div class="title">
      <div>
        <nuxt-link to="/">项目</nuxt-link> / <span>{{dirName}}</span>
      </div>
      <div>
        <b-button size="sm" variant="info" @click="getData">刷新</b-button>
        <b-button size="sm" variant="success" @click="showAdd">新建接口</b-button>
      </div>
    </div>

    <!-- 表格 -->
    <b-table striped hover :items="items" :fields="fields">
      <!-- 序号 -->
      <template #cell(index)="row">{{row.index+1}}</template>
      <!-- 路径 -->
      <template #cell(path)="row">{{baseURL + row.item.path}}</template>
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
      :title="modalFor==='add'?'新建接口':'修改接口'"
      @hidden="resetFormModal"
      @ok="handleFormOk"
      size="lg"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="路径"
          label-for="path-input"
          invalid-feedback="请输入路径"
          :state="pathState"
        >
          <b-input-group :prepend="baseURL">
            <b-form-input
              id="path-input"
              v-model="path"
              :state="pathState"
              required
            ></b-form-input>
          </b-input-group>
        </b-form-group>

        <b-form-group
          label="方法"
          label-for="method-input"
          invalid-feedback="请选择方法"
          :state="methodState"
        >
          <b-form-select
            id="method-input"
            :options="methods"
            v-model="method"
            :state="methodState"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group
          label="响应内容"
          label-for="content-input"
          invalid-feedback="请输入响应内容"
          :state="contentState"
        >
          <b-form-textarea
            id="content-input"
            v-model="content"
            :state="contentState"
            required
            rows="10"
            max-rows="10"
          ></b-form-textarea>
        </b-form-group>
      </form>

      <template #modal-cancel>取消</template>
      <template #modal-ok>确定</template>
    </b-modal>

    <!-- 删除 -->
    <b-modal
      v-model="deleteModalShow"
      title="删除接口"
      @ok="handleDeleteOk"
    >
      确定删除该接口吗？
      <template #modal-cancel>取消</template>
      <template #modal-ok>确定</template>
    </b-modal>

    <!-- 查看 -->
    <b-modal
      v-model="detailModalShow"
      title="接口响应内容"
      @hidden="resetDetailModal"
      size="lg"
    >
      <pre>{{apiDetail}}</pre>
      <template #modal-cancel>取消</template>
      <template #modal-ok>确定</template>
    </b-modal>

  </div>
</template>

<script>
import {splitStr} from '@/api/settings'

export default {
  layout: 'common-layout',
  async asyncData({ $axios, params }) {
    const dirName = params.name
    let {data} = await $axios.$get(`/api/handle/api/${dirName}`)
    // 返回的数据会传递到data()
    return { 
      items: data, 
      baseURL: $axios.defaults.baseURL + `/api/${dirName}`,
      dirName
    }
  },
  data() {
    return {
      // 路径
      baseURL: '',
      dirName: '',

      // 表格数据
      fields: [
        {key: 'index', label: '#'},
        {key: 'path', label: '路径'},
        {key: 'method', label: '方法'},
        {key: 'todo', label: '操作'}
      ],
      items: [],

      // 新建&&修改
      formModalShow: false,
      modalFor: 'add', // 'edit'
      methods: [
        {value: 'GET', text: 'GET'},
        {value: 'POST', text: 'POST'},
        {value: 'PUT', text: 'PUT'},
        {value: 'DELETE', text: 'DELETE'},
        {value: 'OPTIONS', text: 'OPTIONS'},
        {value: 'HEAD', text: 'HEAD'},
        {value: 'TRACE', text: 'TRACE'},
        {value: 'CONNECT', text: 'CONNECT'}
      ],

      // 表单字段
      path: '',
      method: '',
      content: '',
      pathState: null,
      methodState: null,
      contentState: null,

      // 删除
      deleteModalShow: false,
      deleteAPI: {},

      // 查看
      detailModalShow: false,
      apiDetail: ''
    }
  },
  mounted() {
    this.baseURL = window.location.origin + `/api/${this.dirName}`
  },
  methods: {
    /**
     * 获取数据
     */
    async getData() {
      let {data: res} = await this.$axios.get(`/api/handle/api/${this.dirName}`)
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
     * 新建&&修改
     */
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.pathState = valid
      return valid
    },
    resetFormModal() {
      this.path = ''
      this.method = ''
      this.content = ''
      this.pathState = null
      this.methodState = null
      this.contentState = null
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
      let {data: res} = await this.$axios.post(`/api/handle/api/${this.dirName}`, {
        path: this.path,
        method: this.method,
        content: this.content
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
      this.path = item.path
      this.method = item.method
      this.content = item.content
      
    },
    async handleEdit() {
      let {data: res} = await this.$axios.post(`/api/handle/api/${this.dirName}`, {
        path: this.path,
        method: this.method,
        content: this.content
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
      this.deleteAPI = item
      this.deleteModalShow = true
    },
    async handleDeleteOk() {
      const {deleteAPI} = this
      // 文件名
      const fileName = deleteAPI.path.split('/').join(splitStr) + '.' + deleteAPI.method
      let {data: res} = await this.$axios.delete(`/api/handle/api/${this.dirName}/${fileName}`)
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
      const fileName = item.path.split('/').join(splitStr) + '.' + item.method
      let {data: res} = await this.$axios.get(`/api/handle/api/${this.dirName}/${fileName}`)
      this.apiDetail = res
      this.detailModalShow = true
    },
    resetDetailModal() {
      this.apiDetail = ''
    }

  }
}
</script>

<style scoped>
.title {
  margin: 1rem 0 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title div span {
  font-weight: 700;
}
</style>

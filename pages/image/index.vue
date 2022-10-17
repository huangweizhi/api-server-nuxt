<template>
  <div>
    <!-- 标题 -->
    <TableHeader>
      <template v-slot:right>
        <b-button size="sm" variant="info" @click="getData">刷新</b-button>
        <div class="file">
          <b-form-file
            v-model="file"
            accept="image/*"
            placeholder="选择或拖拽图片"
            drop-placeholder="拖拽到这里..."
            size="sm"
            browse-text="上传"
            @change="changeFile"
          ></b-form-file>
        </div>
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
      <!-- 路径 -->
      <template #cell(path)="row">{{baseURL + row.item.path}}</template>
      <!-- 操作栏 -->
      <template #cell(todo)="row">
        <b-button size="sm" variant="danger" @click="showDelete(row.item)">删除</b-button>
        <b-button size="sm" variant="info" @click="showDetail(row.item)">查看</b-button>
      </template>
    </b-table>

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
  async asyncData({ $axios, params, env }) {
    const dirName = params.name || 'test'
    let {data} = await $axios.$get(`/api/handle/api/${dirName}`)
    // 返回的数据会传递到data()
    return { 
      items: data, 
      baseURL: $axios.defaults.baseURL + `/api/${dirName}`,
      dirName,
      env
    }
  },
  data() {
    return {
      // 展示用的基础路径
      baseURL: '',
      dirName: '',

      // 表格数据
      fields: [
        {key: 'index', label: '#'},
        {key: 'path', label: '图片路径'},
        {key: 'method', label: '图片'},
        {key: 'todo', label: '操作'}
      ],
      items: [],

      // 上传
      file: null,

      // 删除
      deleteModalShow: false,
      deleteAPI: {},

      // 查看
      detailModalShow: false,
      apiDetail: ''
    }
  },
  mounted() {
    if(this.env.NODE_ENV === 'prod') {
      this.baseURL = window.location.origin + `/mock/api/${this.dirName}`
    }else {
      this.baseURL = window.location.origin + `/api/${this.dirName}`
    }
    
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
     * 上传
     */
    changeFile(event) {
      const file = event.type == 'drop' ? event.dataTransfer.files[0] : event.target.files[0] 
      // 校验
      const formData = new FormData()
      formData.append("file", file) // 上传的key值 file
      formData.append("name", file.name) // 上传的key值 file
      this.$axios.post('/api/handle/image/upload', formData, {
        'Content-type': 'multipart/form-data'
      }).then(res=>{
        console.log(res)
      },err=>{
        console.log(err)
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
.file {
  display: inline-block;
}
</style>

<template>
  <div>
    <!-- 标题 -->
    <TableHeader>
      <template v-slot:right>
        <div class="file">
          <b-form-file
            v-model="file"
            accept="image/*"
            placeholder="选择或拖拽图片"
            drop-placeholder="拖拽到这里..."
            size="sm"
            browse-text="选择"
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
      <template #cell(path)="row">{{baseURL + row.item}}</template>
      <!-- 图片 -->
      <template #cell(image)="row">
        <img class="table-img" :src="baseURL + row.item" @click="showDetail(row.item)" />
      </template>
      <!-- 操作栏 -->
      <template #cell(todo)="row">
        <b-button size="sm" variant="danger" @click="showDelete(row.item)">删除</b-button>
      </template>
    </b-table>

    <!-- 删除 -->
    <b-modal
      v-model="deleteModalShow"
      title="删除图片"
      @ok="handleDeleteOk"
    >
      确定删除该图片吗？
      <template #modal-cancel>取消</template>
      <template #modal-ok>确定</template>
    </b-modal>

    <!-- 查看 -->
    <b-modal
      v-model="detailModalShow"
      title="图片"
      size="lg"
    >
      <img class="show-img" :src="showImageUrl" />
      <template #modal-cancel>取消</template>
      <template #modal-ok>确定</template>
    </b-modal>

  </div>
</template>

<script>
export default {
  layout: 'common-layout',
  async asyncData({ $axios, env }) {
    let baseURL
    if(env.NODE_ENV === 'prod') {
      baseURL = $axios.defaults.baseURL + '/mock/api/image/'
    }else {
      baseURL = $axios.defaults.baseURL + '/api/image/'
    }

    let {data} = await $axios.$get('/api/image')
    // 返回的数据会传递到data()
    return { 
      items: data, 
      baseURL,
      env
    }
  },
  data() {
    return {
      // 展示用的基础路径
      baseURL: '',

      // 表格数据
      fields: [
        {key: 'index', label: '#'},
        {key: 'path', label: '路径'},
        {key: 'image', label: '图片'},
        {key: 'todo', label: '操作'}
      ],
      items: [],

      // 上传
      file: null,

      // 删除
      deleteModalShow: false,
      deleteImage: {},

      // 查看
      detailModalShow: false,
      showImageUrl: ''
    }
  },
  mounted() {
    if(this.env.NODE_ENV === 'prod') {
      this.baseURL = window.location.origin + '/mock/api/image/'
    }else {
      this.baseURL = window.location.origin + '/api/image/'
    }
    
  },
  methods: {
    /**
     * 获取数据
     */
    async getData() {
      let {data: res} = await this.$axios.get('/api/image')
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
    async changeFile(event) {
      const file = event.type == 'drop' ? event.dataTransfer.files[0] : event.target.files[0] 
      // 判断是否是图片文件
      if(!/\.(gif|jpg|jpeg|png)$/i.test(file.name)) {
        this.$bvToast.toast('不支持该格式的文件！', {
          title: '提示',
          variant: 'warning',
          autoHideDelay: 2500
        })
        return
      }
      // 校验
      const formData = new FormData()
      formData.append("file", file) // 上传的key值 file

      let {data: res} = await this.$axios.post('/api/image', formData, {
        'Content-type': 'multipart/form-data'
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
    },

    /**
     * 删除
     */
    showDelete(item) {
      this.deleteImage = item
      this.deleteModalShow = true
    },
    async handleDeleteOk() {
      // 图片文件名
      const {deleteImage} = this
      let {data: res} = await this.$axios.delete(`/api/image/${deleteImage}`)
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
      // 查看图片
      this.showImageUrl = this.baseURL + item
      this.detailModalShow = true
    },

  }
}
</script>

<style scoped>
.file {
  display: inline-block;
}
.table-img {
  width: 60px;
  cursor: pointer;
}

.show-img {
  width: 100%;
}
</style>

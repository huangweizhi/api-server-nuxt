<template>
  <div>
    <!-- 导航 -->
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand href="#">
        <img src="@/static/logo.png" alt="Kitten">
        API接口服务
      </b-navbar-brand>
      
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/" :active="isActive('/')">JSON格式</b-nav-item>
          <b-nav-item to="/image" :active="isActive('/image')">图片</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!-- <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder=""></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" variant="info">搜索</b-button>
          </b-nav-form> -->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- 内容 -->
    <b-container>
      <nuxt />
    </b-container>
  </div>
</template>

<script>
export default {
  computed: {
    isActive() {
      return (path) => {
        // JSON格式
        if(path == '/') {
          if(this.$route.path == '/') return true
          if(this.$route.path.indexOf('/category')==0) return true
          return false
        }
        // 其他导航栏
        else {
          if(this.$route.path.indexOf(path) == 0) return true
          return false
        }
      }
    }
  }
}
</script>



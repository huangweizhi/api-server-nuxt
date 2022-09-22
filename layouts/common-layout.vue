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
          <b-nav-item href="https://www.wzblogs.top">火星巴士</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder=""></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" variant="info">搜索</b-button>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- 内容 -->
    <b-container>
      <nuxt />
    </b-container>
  </div>
</template>



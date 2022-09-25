
// 请根据实际需求修改：开发环境(dev)在根目录运行，生产环境(prod)在二级路由 /mock 运行
const routerPrefix = process.env.NODE_ENV === 'prod' ? '/mock' : ''

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'api-server-nuxt',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: routerPrefix + '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'http://localhost:3100' + routerPrefix,
    browserBaseURL: routerPrefix
  },

  /*
  ** Server Middleware
  */
  serverMiddleware: {
    '/api': '~/api'
  },

  router: {
    base: routerPrefix // 应用的根 URL
  },
  
  server: {
    port: 3100, // 默认: 3000
    host: '0.0.0.0' // 默认: localhost
  },

  env: {
    NODE_ENV: process.env.NODE_ENV
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}

## api-server-nuxt

# API接口服务

## 安装及运行

```bash
# 安装依赖项
$ npm install

# 开发环境运行
$ npm run dev

# 生产环境运行
$ npm run build
$ npm run start

# 生成静态项目
$ npm run generate
```
项目基于nuxt.js+express构建
[Nuxt文档](https://nuxtjs.org)
[Express文档](http://expressjs.com)

---

## 如何使用

### `1.`打开项目页面

- 开发环境访问 http://192.168.117.2:3100/
- 生产环境访问 http://192.168.117.2:3100/mock/ 
  如有需要，在项目配置文件nuxt.config.js修改应用的根URL

### `2.`创建接口示例

- 在首页 新建项目 test
- 进入该项目 新建接口 /user/info
- 复制接口路径 http://192.168.117.2:3100/api/test/user/info
- 通过该路径访问你定义的接口内容（目前只支持json格式的响应内容）





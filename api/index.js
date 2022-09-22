const express = require('express')
const logger = require('morgan')

// 创建express实例
const app = express()

// 在终端打印日志
app.use(logger('dev'))
// 解析 JSON 格式的请求体数据
app.use(express.json())
// 解析 URL-encoded 格式的请求体数据
app.use(express.urlencoded({ extended: true }))

// 路由
const apiRouter = require('./routes/api')
const handleApiRouter = require('./routes/handle-api')

app.use('/handle', handleApiRouter) // api接口管理
app.use('/', apiRouter) // api接口服务

// 导出 express app
module.exports = app

// 如果直接运行，则启动独立服务器
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}

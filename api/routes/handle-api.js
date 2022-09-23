const express = require('express')
const router = express.Router()

const {addAPi, getApi, getOneAPi, deleteOneAPi} = require('../controllers/handle-api')

/**
 * 管理API的 路由
 */

// 获取某接口数据
router.get('/:name', getOneAPi)

// 添加接口
router.post('/', addAPi)

// 删除
router.delete('/:name', deleteOneAPi)

// 获取接口数据(列表)
router.get('/', getApi)

module.exports = router
const express = require('express')
const router = express.Router()

const {addAPi, getApi, getOneAPi, deleteOneAPi} = require('../controllers/handle-api')

/**
 * 管理API的 路由
 */

// 获取某接口数据
router.get('/:dirName/:fileName', getOneAPi)

// 添加接口
router.post('/:dirName', addAPi)

// 删除接口
router.delete('/:dirName/:fileName', deleteOneAPi)

// 获取接口数据(列表)
router.get('/:dirName', getApi)

module.exports = router
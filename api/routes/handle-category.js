const express = require('express')
const router = express.Router()

const {addCategory, getCategory, deleteOneCategory} = require('../controllers/handle-category')

/**
 * 管理分类的 路由
 */

// 获取分类数据(列表)
router.get('/', getCategory)

// 添加分类
router.post('/', addCategory)

// 删除分类
router.delete('/:dirName', deleteOneCategory)

module.exports = router
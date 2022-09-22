const express = require('express')
const router = express.Router()

const {readFile} = require('../dao/file')
const {splitStr} = require('../settings')

/**
 * 路由
 */
// 处理静态接口数据
router.use(async (req, res, next) => {
  let name = req.path.split('/').join(splitStr) + '.' + req.method
  let result = await readFile(name)
  if(result) {
    result = JSON.parse(result)
    res.json(result)
  }else {
    res.json(result)
  }
})

module.exports = router

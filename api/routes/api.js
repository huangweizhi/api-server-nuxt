const express = require('express')
const router = express.Router()

const {readFile} = require('../dao/file')
const {splitStr} = require('../settings')

/**
 * 路由
 */
// 处理静态接口数据
router.use(async (req, res, next) => {
  // /test/user/register
  const pathArr = req.path.split('/')
  // 文件夹 test
  let dirName = pathArr[1]
  pathArr.splice(1, 1)
  // 文件名 ~@~user~@~register.POST
  let fileName = pathArr.join(splitStr) + '.' + req.method
  
  let result = await readFile(dirName, fileName)
  if(result) {
    result = JSON.parse(result)
    res.json(result)
  }else {
    res.json(result)
  }
})

module.exports = router

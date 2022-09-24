const {makeDir, deleteDir, getDir, renameDir} = require('../dao/file')

/**
 * 添加分类
 */
exports.addCategory = async (req, res, next) => {
  // 文件夹
  let {dirName} = req.body

  const result = await makeDir(dirName)
  if(result) {
    res.json({
      status: 200,
      flag: true,
      data: null,
      message: "创建分类成功"
    })
  }else {
    res.json({
      status: 500,
      flag: false,
      data: null,
      message: "创建分类失败"
    })
  }
}

/**
 * 修改分类
 */
 exports.editCategory = async (req, res, next) => {
  // 文件夹
  let {oldName, dirName} = req.body

  const result = await renameDir(oldName, dirName)
  if(result) {
    res.json({
      status: 200,
      flag: true,
      data: null,
      message: "修改分类成功"
    })
  }else {
    res.json({
      status: 500,
      flag: false,
      data: null,
      message: "修改分类失败"
    })
  }
}

/**
 * 删除分类
 */
exports.deleteOneCategory = async (req, res, next) => {
  // 文件夹
  const {dirName} = req.params

  const result = await deleteDir(dirName)
  if(result) {
    res.json({
      status: 200,
      flag: true,
      data: result,
      message: "删除分类成功"
    })
  }else {
    res.json({
      status: 500,
      flag: false,
      data: result,
      message: "删除分类失败"
    })
  }
}

/**
 * 获取分类数据(列表)
 */
exports.getCategory = async (req, res, next) => {
  //获取数据
  let result = await getDir()

  if(result) {
    const _result = result.map(item => {
      return {dirName: item}
    })
    res.json({
      status: 200,
      flag: true,
      data: _result,
      message: "获取分类列表成功"
    })
  }else {
    res.json({
      status: 500,
      flag: false,
      data: result,
      message: "获取分类列表失败"
    })
  }
}

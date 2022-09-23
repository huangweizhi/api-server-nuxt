const {saveFile, getFile, readFile, deleteFile} = require('../dao/file')
const {splitStr} = require('../settings')

/**
 * 添加api接口
 */
exports.addAPi = async (req, res, next) => {
  // 文件夹
  let {dirName} = req.params
  //获取表单内容
  let {path, method, content} = req.body
  //保存为文件
  path = path.split('/').join(splitStr)
  let fileName = `${path}.${method}`
  const result = await saveFile(dirName, fileName, content)
  if(result) {
    res.json({
      status: 200,
      flag: true,
      data: null,
      message: "创建接口成功"
    })
  }else {
    res.json({
      status: 500,
      flag: false,
      data: null,
      message: "创建接口失败"
    })
  }
}

/**
 * 删除api接口
 */
exports.deleteOneAPi = async (req, res, next) => {
  const {dirName, fileName} = req.params
  //保存
  const result = await deleteFile(dirName, fileName)
  if(result) {
    res.json({
      status: 200,
      flag: true,
      data: result,
      message: "删除接口成功"
    })
  }else {
    res.json({
      status: 500,
      flag: false,
      data: result,
      message: "删除接口失败"
    })
  }
}

/**
 * 获取api接口数据(列表)
 */
 exports.getApi = async (req, res, next) => {
  //获取数据
  let result = await getFile(req.params.dirName)
  if(result) {
    //文件名转成path, 文件后缀转成method
    let _result = []
    result.forEach(async item => {
      item = item.split(splitStr).join('/')
      let itemList = item.split('.')
      let method = itemList[itemList.length-1]
      let path = itemList.slice(0, itemList.length-1).join('')
      _result.push({
        path,
        method
      })
    })

    res.json({
      status: 200,
      flag: true,
      data: _result,
      message: "获取接口列表成功"
    })
  }else {
    res.json({
      status: 500,
      flag: false,
      data: result,
      message: "获取接口列表失败"
    })
  }
}


/**
 * 获取api接口内容
 */
exports.getOneAPi = async (req, res, next) => {
  const {dirName, fileName} = req.params
  // 文件内容
  let result = await readFile(dirName, fileName)
  if(result) {
    result = JSON.parse(result)
    res.json(result)
  }else {
    res.json(result)
  }
}
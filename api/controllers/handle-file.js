const multer = require('multer')
const fs = require('fs')
const {UPLOAD_PATH} = require('../settings') // 上传文件路径
const {getFile, deleteFile} = require('../dao/file-image')

// 文件上传路径
const uploadPath = UPLOAD_PATH

const storage = multer.diskStorage({
  // 文件上传目录
  destination: (req, file, cb) => {
    cb(null, uploadPath)
  },
  // 上传文件名称
  filename: (req, file, cb) => {
    // 解决中文乱码
    let fileName = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    )
    cb(null, new Date().getTime() + '_' + Math.random().toString(36).slice(-10) + '_' + fileName)
  }

})

// multer配置
exports.upload = multer({storage})

// 文件上传
exports.uploadFile = async (req, res, next) => {
  const result = req.file
  let jsonObj = {}
	if(result === false) {
		jsonObj = {
      status: 500,
      flag: false,
      data: null,
      message: "文件上传失败"
    }
	}
  else if(result) {
    jsonObj = {
      status: 200,
      flag: true,
      data: result,
      message: "文件上传成功"
    }
  }else {
    jsonObj = {
      status: 403,
      flag: false,
      data: result,
      message: "文件上传失败"
    }
  }
  
  res.json(jsonObj)
}

// 删除上传的文件
exports.deleteFile = async (req, res, next) => {
  const result = await deleteFile(req.params.name)
  if(result) {
    res.json({
      status: 200,
      flag: true,
      data: result,
      message: "删除文件成功"
    })
  }else {
    res.json({
      status: 500,
      flag: false,
      data: result,
      message: "删除文件失败"
    })
  }
  
}

// 获取文件列表
exports.getFileList = async (req, res, next) => {
  const result = await getFile()
  if(result) {
    res.json({
      status: 200,
      flag: true,
      data: result,
      message: "获取文件列表成功"
    })
  }else {
    res.json({
      status: 500,
      flag: false,
      data: result,
      message: "获取文件列表失败"
    })
  }
}

// 下载文件
exports.downloadFile = async (req, res, next) => {
  const path = UPLOAD_PATH + `/${req.params.name}`

  const cr = fs.createReadStream(path, {
    // highWaterMark: 64*1024, // 文件一次读多少字节, 默认 64*1024
    flags: 'r', // 默认 'r'
    autoClose: true, // 默认读取完毕后自动关闭
    // start: 0, // 读取文件开始位置
    // end: 3, // 流是闭合区间 包含start也含end
    // encoding: 'utf8' // 默认null
  })
  cr.on('error',(err)=>{
    console.error('下载文件', err)
    res.send(err)
  })
  cr.pipe(res)
}

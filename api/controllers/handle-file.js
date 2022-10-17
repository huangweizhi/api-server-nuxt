const multer = require('multer')
const fs = require('fs')
const {UPLOAD_PATH} = require('../settings') // 上传文件路径

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

//删除文件
const doDeleteFile = (name) => {
  return new Promise((resolve, reject) => {
    fs.unlink(uploadPath + '/' + name, function(err) {
      if(err) {
        console.error('删除文件', err)
        resolve(false)
        return
      }
      resolve(true)
    })
  })
}
exports.doDeleteFile = doDeleteFile

// 删除文件
exports.deleteFile = async (req, res, next) => {
  
  let jsonObj = {}
  const result = await doDeleteFile(req.params.name)
  if(result === false) {
    jsonObj = {
      status: 500,
      flag: false,
      data: null,
      message: "删除文件失败"
    }
  }
  else if(result) {
    jsonObj = {
      status: 200,
      flag: true,
      data: result,
      message: "删除文件成功"
    }
  }else {
    jsonObj = {
      status: 403,
      flag: false,
      data: result,
      message: "删除文件失败"
    }
  }
  
  res.json(jsonObj)
}


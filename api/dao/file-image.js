// fs.stat && fs.statSync 提供了访问文件的属性信息
// fs.readdir && fs.readdirSync 提供读取文件目录信息
// fs.unlink && unlinkSync 进行删除文件操作，不可以删除文件夹
// fs.rmdir && fs.rmdirSync 进行删除文件夹操作，但文件夹必须为空文件夹
// 写入文件：writeFile()覆盖文件，appendFile()追加文件
// fs.exists() && fs.existsSync() 检测目录是否存在

const fs = require('fs')
const {UPLOAD_PATH} = require('../settings') // 文件存放路径

/**
 * 获取所有文件（文件夹下的文件列表）
 * @returns Array
 */
exports.getFile = () => {
  return new Promise((resolve, reject) => {
    const path = UPLOAD_PATH

    try {
      const files = fs.readdirSync(path)
      // 文件列表
      let fileArr = []
      files.forEach(file => {
        const filePath = `${path}/${file}`
        const stats = fs.statSync(filePath)
        if(!stats.isDirectory()) {
          // 文件
          fileArr.push(file)
        }
      })
      resolve(fileArr)
    }catch(err) {
      console.error('获取所有文件', err)
      resolve(false)
    }
  })
}

/**
 * 删除文件
 * @param {String} fileName 
 * @returns Boolean
 */
exports.deleteFile = (fileName) => {
  return new Promise((resolve, reject) => {
    const path = `${UPLOAD_PATH}/${fileName}`

    fs.unlink(path, function(err) {
      if(err) {
        console.error('删除文件', err)
        resolve(false)
        return
      }
      resolve(true)
    })
  })
}



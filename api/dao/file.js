// fs.stat && fs.statSync 提供了访问文件的属性信息
// fs.readdir && fs.readdirSync 提供读取文件目录信息
// fs.unlink && unlinkSync 进行删除文件操作，不可以删除文件夹
// fs.rmdir && fs.rmdirSync 进行删除文件夹操作，但文件夹必须为空文件夹
// 写入文件：writeFile()覆盖文件，appendFile()追加文件
// fs.exists() && fs.existsSync() 检测目录是否存在

const fs = require('fs')
const {basePath} = require('../settings') // 文件存放路径

/**
 * 保存文件
 * @param {String} dirName 文件夹名称
 * @param {String} fileName 文件名
 * @param {String} content 文件内容
 * @returns Boolean
 */
exports.saveFile = (dirName, fileName, content) => {
  return new Promise((resolve, reject) => {
    const path = `${basePath}/${dirName}/${fileName}`

    fs.writeFile(path, content, (err) => {
      if(err) {
        console.error('保存文件:', err)
        resolve(false)
        return
      }
      resolve(true)
    })
  })
}

/**
 * 获取所有文件（文件夹下的文件列表）
 * @param {String} dirName 文件夹名称
 * @returns Array
 */
exports.getFile = (dirName) => {
  return new Promise((resolve, reject) => {
    const path = `${basePath}/${dirName}`

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
 * 读取文件内容
 * @param {String} dirName 
 * @param {String} fileName 
 * @returns String
 */
exports.readFile = (dirName, fileName) => {
  return new Promise((resolve, reject) => {
    const path = `${basePath}/${dirName}/${fileName}`

    fs.readFile(path, function(err, data) {
      if(err) {
        console.error('读取文件', err)
        resolve(false)
        return
      }
      let str = data.toString()
      resolve(str)
    })
  })
}

/**
 * 删除文件
 * @param {String} dirName 
 * @param {String} fileName 
 * @returns Boolean
 */
exports.deleteFile = (dirName, fileName) => {
  return new Promise((resolve, reject) => {
    const path = `${basePath}/${dirName}/${fileName}`

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



/**
 * 创建文件夹
 * @param {String} dirName 
 * @returns Boolean
 */
exports.makeDir = (dirName) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(`${basePath}/${dirName}`, (err) => {
      if(err) {
        resolve(false)
        return
      }
      resolve(true)
    })
  })
}

/**
 * 获取文件夹（files下的文件夹列表）
 * @returns Boolean
 */
exports.getDir = () => {
  return new Promise((resolve, reject) => {
    try {
      const files = fs.readdirSync(basePath)
      let dirs = []
      files.forEach(file => {
        const filePath = `${basePath}/${file}`
        const stats = fs.statSync(filePath)
        if(stats.isDirectory()) {
          // 文件夹
          dirs.push(file)
        }
      })
      resolve(dirs)
    }catch(err) {
      console.error('获取文件夹列表', err)
      resolve(false)
    }
  })
}

/**
 * 删除文件夹方法
 * @param {*} path 文件夹路径
 * @returns Boolean
 */
const deleteFolder = (path) => {  
  try {
    let files = []
    if( fs.existsSync(path) ) {
      files = fs.readdirSync(path)
      files.forEach(file => {
        let filePath = `${path}/${file}`
        if(fs.statSync(filePath).isDirectory()) {
          // 递归删除文件夹
          deleteFolder(filePath)
        } else {
          fs.unlinkSync(filePath)
        }
      })
      fs.rmdirSync(path)
    }
    return true
  }catch(err) {
    console.error('删除文件夹', err)
    return false
  }
}

/**
 * 删除文件夹
 * @param {*} dirName 
 * @returns Boolean
 */
exports.deleteDir = (dirName) => {
  const path = `${basePath}/${dirName}`
  return new Promise((resolve, reject) => {
    const res =  deleteFolder(path)
    if(res) {
      resolve(true)
    }else {
      resolve(false)
    }
  })
}


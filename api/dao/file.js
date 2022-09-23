// 1、 fs.stat && fs.statSync 提供了访问文件的属性信息
// 2、 fs.readdir && fs.readdirSync 提供读取文件目录信息
// 3、 fs.unlink && unlinkSync 进行删除文件操作，不可以删除文件夹
// 4、 fs.rmdir && fs.rmdirSync 进行删除文件夹操作，但文件夹必须为空文件夹
// 5、写入文件：writeFile()覆盖文件，appendFile()追加文件

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

    fs.readdir(path, (err, files) => {
      if(err) {
        console.log('获取所有文件:', err)
        resolve(false)
        return
      }
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
    })
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
 * 清空 文件夹下的所有文件
 * @param {String} path 文件夹路径
 * @returns Boolean
 */
const emptyDir = (path) => {
  try {
    const files = fs.readdirSync(path)
    files.forEach(file => {
      const filePath = `${path}/${file}`
      const stats = fs.statSync(filePath)
      if(stats.isDirectory()) {
        // 递归清空文件夹
        emptyDir(filePath)
      }else {
        fs.unlink(filePath, () => {})
      }
    })
  }catch(err) {
    console.error('清空文件夹', err)
  }
}

/**
 * 删除指定路径下的所有空文件夹
 * @param {*} path 文件夹路径
 */
const rmEmptyDir = (path, level=0) => {
  try {
    const files = fs.readdirSync(path)
    if (files.length > 0) {
      let tempFile = 0
      files.forEach(file => {
        tempFile++
        rmEmptyDir(`${path}/${file}`, 1)
      })
      if (tempFile === files.length && level !== 0) {
        fs.rmdirSync(path)
      }
    }
    else {
      level !==0 && fs.rmdirSync(path)
    }
  }catch(err) {
    console.error('删除文件夹', err)
  }
}

/**
 * 清空文件夹
 * @param {*} dirName 
 */
exports.clearDir = (dirName) => {
  const path = `${basePath}/${dirName}`
  emptyDir(path)
  rmEmptyDir(path)
}

/**
 * 删除文件夹
 * @param {*} dirName 
 * @returns Boolean
 */
exports.deleteDir = (dirName) => {
  const path = `${basePath}/${dirName}`
  emptyDir(path)
  rmEmptyDir(path)
  return new Promise((resolve, reject) => {
    fs.rmdir(path, (err) => {
      if(err) {
        resolve(false)
        return
      }
      resolve(true)
    })
  })
}

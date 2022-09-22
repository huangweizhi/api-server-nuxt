const fs = require('fs')
const {baseurl} = require('../settings')

/**
 * 保存文件
 * @param {String} name 
 * @param {String} content 
 * @returns Boolean
 */
exports.saveFile = (name, content) => {
  //写入文件，writeFile()覆盖文件，appendFile()追加文件
  return new Promise((resolve, reject) => {
    fs.writeFile(`${baseurl}/${name}`, content, (err) => {
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
 * 读取文件夹中所有文件
 * @returns Array
 */
exports.getAllFile = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(baseurl, (err, filenameArray) => {
      if(err) {
        console.log('读取文件:', err)
        resolve(false)
        return
      }
      resolve(filenameArray)
    })
  })
}


/**
 * 读取文件内容
 * @param {String} name 
 * @returns String
 */
exports.readFile = (name) => {
  return new Promise((resolve, reject) => {
    fs.readFile(baseurl + '/' + name, function(err, data) {
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
 * @param {String} name 
 * @returns Boolean
 */
exports.deleteFile = (name) => {
  return new Promise((resolve, reject) => {
    fs.unlink(baseurl + '/' + name, function(err) {
      if(err) {
        console.error('删除文件', err)
        resolve(false)
        return
      }
      resolve(true)
    })
  })
}


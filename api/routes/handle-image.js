const express = require('express')
const router = express.Router()

const {upload, uploadFile, deleteFile} = require('../controllers/handle-file')
const {downloadFile, getFileList} = require('../controllers/handle-file')

// 上传图片
router.post('/', upload.single('file'), uploadFile)

// 删除图片
router.delete('/:name', deleteFile)

// 获取图片
router.get('/:name', downloadFile)

// 获取图片（列表）
router.get('/', getFileList)

module.exports = router

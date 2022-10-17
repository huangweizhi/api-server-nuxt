const express = require('express')
const router = express.Router()

const {upload, uploadFile, deleteFile} = require('../controllers/handle-file')

// 图片上传
router.post('/upload', upload.single('file'), uploadFile)
router.delete('/delete/:name', deleteFile)

module.exports = router

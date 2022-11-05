// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const Restaurant = require('./modules/restaurants')
const users = require('./modules/users') 

// 準備引入路由模組
router.use('/', home)
router.use('/restaurant', Restaurant)
router.use('/users', users) 

module.exports = router // 匯出路由模組，要記得寫！不然會出錯
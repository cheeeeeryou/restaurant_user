
const mongoose = require('mongoose')
const restaurantList = require("../../restaurant.json").results
const Restaurant = require('../restaurant') //載入 Restaurant model

// 連線至資料庫
require('dotenv').config()
console.log(process.env.MY_ENV)  // 設定連線到 mongoDB
mongoose.connect(process.env.MY_ENV, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料連線狀態_連線異常_連線成功 顯示訊息
const db = mongoose.connection
db.on('error', () =>
  console.log('Mongodb error')
)
db.once('open', () => {
  console.log('Mongodb connected running script...')

  // 在資料庫建立種子資料
  Restaurant.create(restaurantList)
    .then(() => {
      console.log("restaurantSeeder done!")

    })
    .catch(err => console.log(err))
})
console.log(restaurantList)
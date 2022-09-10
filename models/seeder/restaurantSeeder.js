

const db = require('../../config/mongoose')

const restaurantList = require("../../restaurant.json").results
const Restaurant = require('../restaurant') //載入 Restaurant model

// 連線至資料庫

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
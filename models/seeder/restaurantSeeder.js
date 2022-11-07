const bcrypt = require('bcryptjs')

const db = require('../../config/mongoose')
const User = require('../user')
const Restaurant = require('../restaurant') //載入 Restaurant model
const restaurantList = require("../../restaurant.json").results

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const userSeeder = [{
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678',
  collection: [0, 1, 2]
},
{
  name: 'user2',
  email: 'user2@example.com',
  password: '12345678',
  collection: [0, 1, 2]
}]

// 連線至資料庫
db.once('open', () => {
  Promise.all(userSeeder.map((serSeeder) =>
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(userSeeder.password, salt))
      .then(hash => User.create({
        name: userSeeder.name,
        email: userSeeder.email,
        password: hash
      }))
      .then(user => {
        const restaurantSeeds = userSeeder.collection.map(index => {
          restaurantList[index].userId = user._id
          return restaurantList[index]
        })
        return Restaurant.create(restaurantSeeds)
      })
  ))
    .then(() => {
      console.log('done.')
      process.exit()
    })
    .catch((error) => console.log(error))
})
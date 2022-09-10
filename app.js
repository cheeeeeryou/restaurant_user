
const express = require('express') // 套用express
const app = express()
const port = 3000
const exphbs = require('express-handlebars') // 套用handlebars
const restaurantList = require('./restaurant.json') //套用餐廳名單
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Restaurant = require("./models/Restaurant") //載入 Restaurant model

app.use(methodOverride("_method"))

require('dotenv').config()
console.log(process.env.MY_ENV)  // 設定連線到 mongoDB
mongoose.connect(process.env.MY_ENV, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))//所有路由的請求都先走這

// routes setting
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()          // 把 Mongoose 的 Model 物件，轉換成乾淨單純的 JS 資料陣列
    .then(restaurantsData => res.render("index", { restaurantsData }))
    .catch(error => console.error(error)) //如果發生意外，執行錯誤處理
})

//setting search function
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword) || restaurant.category.includes(keyword)
  }) //餐廳名稱 or(||) 種類
  res.render('index', { restaurants, keyword })
})

//render information page(show.handlebars)
app.get('/restaurant/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
}) //參考教案movie list的寫法，用3等號 + toString() 

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})


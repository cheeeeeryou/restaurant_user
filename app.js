
const express = require('express') // 套用express
const app = express()
const port = 3000
const exphbs = require('express-handlebars') // 套用handlebars
const restaurantList = require('./restaurant.json') //套用餐廳名單
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Restaurant = require('./models/Restaurant') //載入 Restaurant model
// 引用 body-parser
const bodyParser = require('body-parser')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理

app.use(bodyParser.urlencoded({ extended: true }))
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
    .lean()
    .then(restaurantsData => res.render("index", { restaurantsData }))
    .catch(error => console.error(error))
})


//setting search function
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  Restaurant.find({})
    .lean()
    .then(restaurantsData => {
      const filterRestaurantsData = restaurantsData.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      )
      res.render("index", { restaurantsData: filterRestaurantsData, keyword })
    })
})

app.get('/restaurant/new', (req, res) => {
  return res.render("new")
})

app.post('/restaurant', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

app.get('/restaurant/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findById(id)
    .lean()
    .then((restaurantsData) => res.render('edit', { restaurantsData }))
    .catch(error => console.log(error))
})

app.put("/restaurant/:restaurant_id", (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurant/${id}`))
    .catch(err => console.log(err))
})

//render information page(show.handlebars)
app.get('/restaurant/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findById(id)
    .lean()
    .then(restaurantsData =>
      res.render("show", { restaurantsData }))
    .catch(error => console.log(error))

})

app.delete('/restaurant/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findByIdAndDelete(id)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})


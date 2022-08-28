
const express = require('express') // 套用express
const app = express()
const port = 3000
const exphbs = require('express-handlebars') // 套用handlebars
const restaurantList = require('./restaurant.json') //套用餐廳名單

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))//所有路由的請求都先走這

// routes setting
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
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


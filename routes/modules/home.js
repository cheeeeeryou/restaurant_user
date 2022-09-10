const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant') //載入 Restaurant model

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' }) // desc
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  Restaurant.find()
    .lean()
    .then(restaurantsData => {
      const filterRestaurantsData = restaurantsData.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      )
      res.render("index", { restaurant: filterRestaurantsData, keyword })
    })
})

module.exports = router// 匯出路由模組，要記得寫！不然會出錯
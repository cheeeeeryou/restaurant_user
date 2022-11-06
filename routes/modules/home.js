const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant') //載入 Restaurant model

router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/sort/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOne({ _id, userId })
    .lean()
    .sort(_id) // 
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/search', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword.toLowerCase()
  Restaurant.findOneAndDelete({ userId })
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
const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')




router.get('/new', (req, res) => {
  return res.render("new")
})

router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

router.get('/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findById(id)
    .lean()
    .then((restaurantsData) => res.render('edit', { restaurantsData }))
    .catch(error => console.log(error))
})

router.put('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurant/${id}`))
    .catch(err => console.log(err))
})

//render information page(show.handlebars)
router.get('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findById(id)
    .lean()
    .then(restaurantsData =>
      res.render("show", { restaurantsData }))
    .catch(error => console.log(error))

})

router.delete('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findByIdAndDelete(id)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router // 匯出路由模組，要記得寫！不然會出錯
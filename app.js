
const express = require('express') // 套用express
const app = express()
const port = 3000

const exphbs = require('express-handlebars') // 套用handlebars
const mongoose = require('mongoose') //套用mongoose
const methodOverride = require('method-override')
const bodyParser = require('body-parser')// body-parser 進行前置處理以利用HTTP動詞
const routes = require('./routes')// 將 request 導入路由器

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static('public')) //載入CSS js等
app.use(routes)//所有路由從routes走


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


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})


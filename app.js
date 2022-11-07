
const express = require('express') // 套用express
const session = require('express-session')
const app = express()
const port = 3000

const exphbs = require('express-handlebars') // 套用handlebars
const mongoose = require('mongoose') //套用mongoose
const methodOverride = require('method-override')
const flash = require('connect-flash')
const bodyParser = require('body-parser')// body-parser 進行前置處理以利用HTTP動詞
const routes = require('./routes')// 將 request 導入路由器
const usePassport = require('./config/passport') // 載入設定檔，要寫在 express-session 以後

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded( { limit: "50mb", extended: true, parameterLimit: 50000 }) )
app.use(methodOverride("_method"))

usePassport(app)// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
app.use(flash())  // 掛載套件
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})

app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})


app.use(express.static('public')) //載入CSS js等
app.use(routes)//所有路由從routes走


// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')




// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})


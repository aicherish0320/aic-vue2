const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const cors = require('koa-cors')

const app = new Koa()
app.use(cors())
const router = new Router()
app.use(router.routes()).use(router.allowedMethods())
app.use(static(path.resolve(__dirname, 'public')))

router.get('/list', (ctx) => {
  const arr = []
  for (let index = 0; index < 23; index++) {
    arr.push(`http://localhost:3001/images/${index + 1}.jpg`)
  }
  ctx.body = arr
})

app.listen(3001, () => console.log('3001 port'))

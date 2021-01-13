const express = require('express')
require('./db/mongoose')
const app = express()
const userRouter = require('./routes/user')
const vechileRouter = require('./routes/vechile')
const repairRouter = require('./routes/repair')
const tireRouter = require('./routes/tire')
const consignorRouter = require('./routes/consignor')
// const consigneeRouter = require('./routes/consignee')
const lrRouter = require('./routes/lr')
const port = 3000

app.use(express.json())
app.use(userRouter)
app.use(vechileRouter)
app.use(repairRouter)
app.use(tireRouter)
app.use(consignorRouter)
// app.use(consigneeRouter)
app.use(lrRouter)

app.listen(port,()=>{
    console.log('server is connected to the port : '+port);
})

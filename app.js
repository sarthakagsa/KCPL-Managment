const express = require('express')
require('./db/mongoose')
const app = express()
const userRouter = require('./routes/user')
const vechileRouter = require('./routes/vechile')
const repairRouter = require('./routes/repair')
const tireRouter = require('./routes/tire')
const port = 3000

app.use(express.json())
app.use(userRouter)
app.use(vechileRouter)
app.use(repairRouter)
app.use(tireRouter)

app.listen(port,()=>{
    console.log('server is connected to the port : '+port);
})

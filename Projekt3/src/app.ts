import express from 'express'
import {Request, Response, NextFunction} from 'express'
import menuRouter from './views/menu'
import orderRouter from './views/order'
import restaurantRouter from './views/restaurant'
import rezervationRouter from './views/rezervation'
import tableRouter from './views/table'
import warehouseRouter from './views/warehouse'
import workerRouter from './views/worker'

const port = 3000 
const app = express()

app.use(express.json())
app.use('/menu', menuRouter)
app.use('/order', orderRouter)
app.use('/restaurant', restaurantRouter)
app.use('/rezervation', rezervationRouter)
app.use('/table', tableRouter)
app.use('/warehouse', warehouseRouter)
app.use('/worker', workerRouter)

app.listen(port, () => console.log(`Server is running on ${port}...`))
/* IMPORT */

import express from 'express'
import databaseRouter from './views/database'
import menuRouter from './views/menu'
import orderRouter from './views/order'
import orderRepRouter from './views/orderReports'
import restaurantRouter from './views/restaurant'
import rezervationRouter from './views/rezervation'
import tableRouter from './views/table'
import warehouseRouter from './views/warehouse'
import workerRouter from './views/worker'

/* SETUP */

const port = 3000 
const app = express()

app.use(express.json())
app.use('/database', databaseRouter)
app.use('/menu', menuRouter)
app.use('/orders', orderRouter)
app.use('/report', orderRepRouter)
app.use('/restaurants', restaurantRouter)
app.use('/rezervations', rezervationRouter)
app.use('/tables', tableRouter)
app.use('/warehouse', warehouseRouter)
app.use('/workers', workerRouter)

app.listen(port, () => console.log(`Server is running on ${port}...`))
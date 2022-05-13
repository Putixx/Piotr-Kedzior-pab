import mongoose from 'mongoose';
import mealDBModel from './mealScheme';
import tableDBModel from './tableScheme';
import workerDBModel from './workerScheme';

enum OrderStatus { ordered = 'ordered', inprogress = 'inprogress', realized = 'realized', bill = 'bill'}

const orderSchema = new mongoose.Schema({
    id: { 
        type: Number,
        required: true
    },
    worker: {
        type: workerDBModel,
        required: true
    },
    meals: { 
        type: [mealDBModel],
        required: true
    },
    status: {
        type: OrderStatus,
        required: true
    },
    table: {
        type: tableDBModel,
        required: true
    },
    price: {
        type: String,
        required: true
    }
})

const orderDBModel = mongoose.model('order', orderSchema)
export default orderDBModel
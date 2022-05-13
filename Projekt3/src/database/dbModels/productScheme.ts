import mongoose from 'mongoose';

enum UnitOfMeasure { gram = 'g', dekagram = 'dg', kilogram = 'kg', tona = 't'}

const productSchema = new mongoose.Schema({
    id: { 
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: { 
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    unitOfMeasure: {
        type: UnitOfMeasure,
        required: true
    }
})

const productDBModel = mongoose.model('product', productSchema)
export default productDBModel
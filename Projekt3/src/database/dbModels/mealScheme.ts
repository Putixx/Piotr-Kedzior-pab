import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
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
    category: {
        type: String,
        required: true
    }
})

const mealDBModel = mongoose.model('meal', mealSchema)
export default mealDBModel
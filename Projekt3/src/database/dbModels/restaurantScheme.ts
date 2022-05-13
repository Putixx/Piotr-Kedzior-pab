import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    id: { 
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: { 
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    nip: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    www: {
        type: String,
        required: true
    }
})

const restaurantDBModel = mongoose.model('restaurant', restaurantSchema)
export default restaurantDBModel
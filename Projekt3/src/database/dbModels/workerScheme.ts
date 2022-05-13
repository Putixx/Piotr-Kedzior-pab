import mongoose from 'mongoose';

const workerScheme = new mongoose.Schema({
    id: { 
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: { 
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    }
})

const workerDBModel = mongoose.model('worker', workerScheme)
export default workerDBModel
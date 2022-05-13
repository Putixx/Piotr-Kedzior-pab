import mongoose from 'mongoose';

enum TableStatus { free = 'free', taken = 'taken', unavailable = 'unavailable'}

const tableSchema = new mongoose.Schema({
    id: { 
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    numPlaces: { 
        type: Number,
        required: true
    },
    status: {
        type: TableStatus,
        required: true
    }
})

const tableDBModel = mongoose.model('table', tableSchema)
export default tableDBModel
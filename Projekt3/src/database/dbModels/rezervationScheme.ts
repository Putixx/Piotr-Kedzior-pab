import mongoose from 'mongoose';
import tableDBModel from './tableScheme';

const rezervationSchema = new mongoose.Schema({
    id: { 
        type: Number,
        required: true
    },
    table: {
        type: tableDBModel,
        required: true
    },
    start: { 
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    client: {
        type: String,
        required: true
    }
})

const rezervationDBModel = mongoose.model('rezervation', rezervationSchema)
export default rezervationDBModel
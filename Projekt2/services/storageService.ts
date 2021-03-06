/* IMPORT BEG */

import fs from 'fs';
import {
    User
} from '../models/user'
import mongoose from 'mongoose'

/* IMPORT END */
//mongoose.connect('mongodb://127.0.0.1:27017')

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    notes: [],
    tags: []
})
const userCollection = mongoose.model('Users', userSchema)


interface DataStorage {
    readStorage(): Promise < string >
        updateStorage(data: User[]): Promise < void >
}

export class DatabaseStorage implements DataStorage {

    async readStorage(): Promise < string > {
        return JSON.stringify(await userCollection.find())
    }
    async updateStorage(data: User[]): Promise < void > {
        await userCollection.deleteMany()
        await userCollection.insertMany(data)
    }
}

export class FileSystemStorage implements DataStorage {
    async readStorage(): Promise < string > {
        return await fs.promises.readFile('./data/users.json', 'utf-8');
    }
    async updateStorage(data: User[]): Promise < void > {
        try {
            await fs.promises.writeFile('./data/users.json', JSON.stringify(data));
        } catch (err) {
            console.log(err)
        }
    }
}
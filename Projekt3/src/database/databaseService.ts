/* IMPORT */

import mongoose from 'mongoose';
import { Meal } from '../models/mealModel';
import { Order } from '../models/orderModel';
import { Product } from '../models/productModel';
import { Restaurant } from '../models/restaurantModel';
import { Rezervation } from '../models/rezervationModel';
import { Table } from '../models/tableModel';
import { Worker } from '../models/workerModel';
import { readStorage } from '../services/storageService';
import mealDBModel from './dbModels/mealScheme';
import orderDBModel from './dbModels/orderScheme';
import productDBModel from './dbModels/productScheme';
import restaurantDBModel from './dbModels/restaurantScheme';
import rezervationDBModel from './dbModels/rezervationScheme';
import tableDBModel from './dbModels/tableScheme';
import workerDBModel from './dbModels/workerScheme';

/* FUNCTIONS */

// Connect to database
export async function connectDB(): Promise<void> {
    try {
        const conn = await mongoose.connect('mongodb+srv://PiotrKedzior:ic3pfg8e60DO3VWB@restaurantproject.mkjqh.mongodb.net/RestaurantProject?retryWrites=true&w=majority')
        console.log('Connected to database!')
    } catch(error) {
        console.log(error);
        throw new Error('Connection failed!')
    }
}

// Synchronize data with database
export async function syncData(): Promise<void> {
    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];
    const savedProducts: Product[] = JSON.parse(await readStorage('./data/products.json')) ?? [];
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

    if(savedMeals && savedMeals.length > 0) {
        await mealDBModel.deleteMany();

        for(let i = 0; i < savedMeals.length; i++) {
            await (new mealDBModel(savedMeals[i])).save();
        }
    } else {
        console.log('There are no meals!');
    }

    if(savedWorkers && savedWorkers.length > 0) {
        await workerDBModel.deleteMany();

        for(let i = 0; i < savedWorkers.length; i++) {
            await (new workerDBModel(savedWorkers[i])).save();
        }
    } else {
        console.log('There are no workers!');
    }

    if(savedRestaurants && savedRestaurants.length > 0) {
        await restaurantDBModel.deleteMany();

        for(let i = 0; i < savedRestaurants.length; i++) {
            await (new restaurantDBModel(savedRestaurants[i])).save();
        }
    } else {
        console.log('There are no restaurants!');
    }

    if(savedTables && savedTables.length > 0) {
        await tableDBModel.deleteMany();

        for(let i = 0; i < savedTables.length; i++) {
            await (new tableDBModel(savedTables[i])).save();
        }
    } else {
        console.log('There are no tables!');
    }

    if(savedProducts && savedProducts.length > 0) {
        await productDBModel.deleteMany();

        for(let i = 0; i < savedProducts.length; i++) {
            await (new productDBModel(savedProducts[i])).save();
        }
    } else {
        console.log('There are no products!');
    }
    
    if(savedRezervations && savedRezervations.length > 0) {
        await rezervationDBModel.deleteMany();

        for(let i = 0; i < savedRezervations.length; i++) {
            await (new rezervationDBModel(savedRezervations[i])).save();
        }
    } else {
        console.log('There are no rezervations!');
    }
    
    if(savedOrders && savedOrders.length > 0) {
        await orderDBModel.deleteMany();

        for(let i = 0; i < savedOrders.length; i++) {
            await (new orderDBModel(savedOrders[i])).save();
        }
    } else {
        console.log('There are no orders!');
    }
}
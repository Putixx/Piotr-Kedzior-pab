/* IMPORT */

import { Meal } from "../models/mealModel";
import { Order } from "../models/orderModel";
import { Table, TableStatus } from "../models/tableModel";
import { Worker } from "../models/workerModel";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new order
export async function createOrder(data: Order): Promise<JSON> {
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];
    const specificWorker = savedWorkers.find(w => w.name === data.worker.name && w.surname === data.worker.surname && w.occupation === data.worker.occupation);

    if(!specificWorker) {
        throw new Error("Current worker isn't registered!");
    }

    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];
    const specificMeals: Meal[] = [];

    for(let i = 0; i < data.meals.length; i++) {
        const temp = savedMeals.find(m => m.name === data.meals[i].name && m.price === data.meals[i].price && m.category === data.meals[i].category);
        if(temp) {
            specificMeals.push(temp);
        }
        else {
            throw new Error("Current meal isn't registered!");
        }
    }

    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];
    const specificTable = savedTables.find(t => t.name === data.table.name && t.numPlaces === data.table.numPlaces);

    if(!specificTable) {
        throw new Error("Current table isn't registered!");
    }

    let orderPrice = 0;

    for(let i = 0; i < data.meals.length; i++) {
        orderPrice += data.meals[i].price;
    }

    data.meals = specificMeals;
    data.worker = specificWorker;
    data.table = specificTable;
    data.table.status = TableStatus['taken'];

    const newOrder = {
        id: Date.now(),
        worker: data.worker,
        meals: data.meals,
        status: data.status,
        table: data.table,
        price: data.price ?? orderPrice
    };

    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

    if(savedOrders.find(o => o.worker.name === newOrder.worker.name && o.table.name === newOrder.table.name && o.price === newOrder.price)) {
        throw new Error("Current order is already registered!");
    }

    savedOrders.push(newOrder);
    await updateStorage('./data/orders.json', JSON.stringify(savedOrders));
    return JSON.parse(JSON.stringify(newOrder));
}

// Read all orders
export async function readAllOrders(): Promise<JSON> {
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

    if(savedOrders.length < 1) {
        throw new Error("There are no orders!");
    }

    return JSON.parse(JSON.stringify(savedOrders));
}

// Read order specified by ID
export async function readOrder(searchID: number): Promise<JSON> {
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

    if(savedOrders.length < 1) {
        throw new Error("There is no orders!");
    }
  
    const orderIndex = savedOrders.findIndex(o => o.id === searchID)
  
    if(orderIndex === -1) {
      throw new Error("Wrong ID!");
    }
  
    return JSON.parse(JSON.stringify(savedOrders[orderIndex]));
}

// Update existing order specified by ID
export async function updateOrder(data: Order, searchID: number): Promise<JSON> {
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];

    if(!savedWorkers.find(w => w.name === data.worker.name && w.surname === data.worker.surname && w.occupation === data.worker.occupation)) {
        throw new Error("Current worker isn't registered!");
    }

    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

    for(let i = 0; i < data.meals.length; i++) {
        if(!savedMeals.find(m => m.name === data.meals[i].name && m.price === data.meals[i].price && m.category === data.meals[i].category)) {
            throw new Error("Current meal isn't registered!");
        }
    }

    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(!savedTables.find(t => t.name === data.table.name && t.numPlaces === data.table.numPlaces)) {
        throw new Error("Current worker isn't registered!");
    }

    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

    if(savedOrders.length < 1) {
        throw new Error("There are no orders!");
    }

    const orderIndex = savedOrders.findIndex(o => o.id === searchID)

    if(orderIndex === -1) {
        throw new Error("Wrong ID!");
    }

    if(data.worker) {
        savedOrders[orderIndex].worker = data.worker;
    }
    if(data.meals) {
        savedOrders[orderIndex].meals = data.meals;
    }
    if(data.status) {
        savedOrders[orderIndex].status = data.status;
    }
    if(data.table) {
        savedOrders[orderIndex].table = data.table;
    }
    if(data.price) {
        savedOrders[orderIndex].price = data.price;
    }

    await updateStorage('./data/orders.json', JSON.stringify(savedOrders));
    return JSON.parse(JSON.stringify(savedOrders[orderIndex]));
}

// Delete existing order specified by ID
export async function deleteOrder(searchID: number): Promise<JSON> {
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

    if(savedOrders.length < 1) {
        throw new Error("There is no orders!");
    }

    const orderIndex = savedOrders.findIndex(o => o.id === searchID)

    if(orderIndex === -1) {
        throw new Error("Wrong ID!");
    }

    const deletedOrder = savedOrders[orderIndex];
    savedOrders.splice(orderIndex, 1);
    await updateStorage('./data/orders.json', JSON.stringify(savedOrders));
    return JSON.parse(JSON.stringify(deletedOrder));
}
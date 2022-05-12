/* IMPORT */

import { Meal } from "../models/Meal";
import { Order } from "../models/Order";
import { Table, TableStatus } from "../models/Table";
import { Worker } from "../models/Worker";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new order
export async function createOrder(data: Order): Promise<number> {
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
    const specificTable = savedTables.find(t => t.name === data.table.name && t.numPlaces === data.table.numPlaces && t.status === data.table.status);

    if(!specificTable) {
        throw new Error("Current table isn't registered!");
    }

    let orderPrice = 0;

    for(let i = 0; i < data.meals.length; i++) {
        orderPrice += parseFloat(data.meals[i].price);
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

    if(savedOrders.find(o => o.worker === newOrder.worker &&  o.meals === newOrder.meals &&  o.table === newOrder.table && o.price === newOrder.price)) {
        throw new Error("Current order is already registered!");
    }

    savedOrders.push(newOrder);
    await updateStorage('./data/orders.json', JSON.stringify(savedOrders));
    return newOrder.id;
}

// Read all orders
export async function readAllOrders(): Promise<string> {
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

    if(savedOrders.length < 1) {
        throw new Error("There are no orders!");
    }

    let print = "";
    let meals = "";

    for(let i = 0; i < savedOrders.length; i++) {
        for(let j = 0; j < savedOrders[i].meals.length; j++) {
        meals += " Meal name: " + savedOrders[i].meals[j].name + " Meal price: " + savedOrders[i].meals[j].price + " Meal category: " + savedOrders[i].meals[j].category + " ";
        }

        print += "ID: " + savedOrders[i].id + " Worker name: " + savedOrders[i].worker.name + " Worker surname: " + savedOrders[i].worker.surname 
        + " Worker occupation: " + savedOrders[i].worker.occupation + meals + " Status: " + savedOrders[i].status + " Table name: " 
        + savedOrders[i].table.name + " Table number of place settings: " + savedOrders[i].table.numPlaces + " Table status: " 
        + savedOrders[i].table.status + " Price: " + savedOrders[i].price + "\n";
    }
    return print;
}

// Read order specified by ID
export async function readOrder(searchID: number): Promise<string> {
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

    if(savedOrders.length < 1) {
        throw new Error("There is no orders!");
    }
  
    const orderIndex = savedOrders.findIndex(o => o.id === searchID)
  
    if(orderIndex === -1) {
      throw new Error("Wrong ID!");
    }
  
    let meals = "";
  
    for(let j = 0; j < savedOrders[orderIndex].meals.length; j++) {
      meals += " Meal name: " + savedOrders[orderIndex].meals[j].name + " Meal price: " + savedOrders[orderIndex].meals[j].price 
      + " Meal category: " + savedOrders[orderIndex].meals[j].category + " ";
    }
  
    return "ID: " + savedOrders[orderIndex].id + " Worker name: " + savedOrders[orderIndex].worker.name + " Worker surname: " + savedOrders[orderIndex].worker.surname 
    + " Worker occupation: " + savedOrders[orderIndex].worker.occupation + meals + " Status: " + savedOrders[orderIndex].status + " Table name: " 
    + savedOrders[orderIndex].table.name + " Table number of place settings: " + savedOrders[orderIndex].table.numPlaces + " Table status: " 
    + savedOrders[orderIndex].table.status + " Price: " + savedOrders[orderIndex].price + "\n";
}

// Update existing order specified by ID
export async function updateOrder(data: Order, searchID: number): Promise<string> {
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

    let meals = "";

    for(let j = 0; j < savedOrders[orderIndex].meals.length; j++) {
        meals += " Meal name: " + savedOrders[orderIndex].meals[j].name + " Meal price: " + savedOrders[orderIndex].meals[j].price 
        + " Meal category: " + savedOrders[orderIndex].meals[j].category + " ";
    }

    const printOld = "ID: " + savedOrders[orderIndex].id + " Worker name: " + savedOrders[orderIndex].worker.name + " Worker surname: " + savedOrders[orderIndex].worker.surname 
    + " Worker occupation: " + savedOrders[orderIndex].worker.occupation + meals + " Status: " + savedOrders[orderIndex].status + " Table name: " 
    + savedOrders[orderIndex].table.name + " Table number of place settings: " + savedOrders[orderIndex].table.numPlaces + " Table status: " 
    + savedOrders[orderIndex].table.status + " Price: " + savedOrders[orderIndex].price + "\n";

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

    for(let j = 0; j < savedOrders[orderIndex].meals.length; j++) {
        meals += " Meal name: " + savedOrders[orderIndex].meals[j].name + " Meal price: " + savedOrders[orderIndex].meals[j].price 
        + " Meal category: " + savedOrders[orderIndex].meals[j].category + " ";
    }

    const printNew = "ID: " + savedOrders[orderIndex].id + " Worker name: " + savedOrders[orderIndex].worker.name + " Worker surname: " + savedOrders[orderIndex].worker.surname 
    + " Worker occupation: " + savedOrders[orderIndex].worker.occupation + meals + " Status: " + savedOrders[orderIndex].status + " Table name: " 
    + savedOrders[orderIndex].table.name + " Table number of place settings: " + savedOrders[orderIndex].table.numPlaces + " Table status: " 
    + savedOrders[orderIndex].table.status + " Price: " + savedOrders[orderIndex].price + "\n";

    await updateStorage('./data/orders.json', JSON.stringify(savedOrders));
    return printOld + printNew;
}

// Delete existing order specified by ID
export async function deleteOrder(searchID: number): Promise<void> {
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

    if(savedOrders.length < 1) {
        throw new Error("There is no orders!");
    }

    const orderIndex = savedOrders.findIndex(o => o.id === searchID)

    if(orderIndex === -1) {
        throw new Error("Wrong ID!");
    }

    savedOrders.splice(orderIndex, 1);
    await updateStorage('./data/orders.json', JSON.stringify(savedOrders));
}
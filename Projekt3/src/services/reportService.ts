/* IMPORT */

import { Meal } from "../models/mealModel";
import { Order } from "../models/orderModel";
import { Rezervation } from "../models/rezervationModel";
import { Table, TableStatus } from "../models/tableModel";
import { Worker } from "../models/workerModel";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Read order specified by worker ID
export async function reportByWorkerID(searchID: number): Promise<string> {
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];
  
    if(savedOrders.length < 1) {
      throw new Error("There are no orders!");
    }
  
    const specificOrders = savedOrders.filter(o => o.worker.id === searchID)
  
    if(!specificOrders) {
        throw new Error("There are no orders for this worker!");
    }

    let print = "";
    let meals = "";
      
    for(let i = 0; i < specificOrders.length; i++) {
        for(let j = 0; j < savedOrders[i].meals.length; j++) {
            meals += " Meal name: " + savedOrders[i].meals[j].name + " Meal price: " + savedOrders[i].meals[j].price 
            + " Meal category: " + savedOrders[i].meals[j].category + " ";
        }
      
        print += "ID: " + savedOrders[i].id + " Worker name: " + savedOrders[i].worker.name + " Worker surname: " + savedOrders[i].worker.surname 
        + " Worker occupation: " + savedOrders[i].worker.occupation + meals + " Status: " + savedOrders[i].status + " Table name: " 
        + savedOrders[i].table.name + " Table number of place settings: " + savedOrders[i].table.numPlaces + " Table status: " 
        + savedOrders[i].table.status + " Price: " + savedOrders[i].price + "\n";
    }

    return print;
}

// Report orders by specified time period
export async function reportOrdersByTime(start: string, end: string): Promise<string> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];
    const dateStart = new Date(start);
    const dateEnd = new Date(end);
    const specificRezervations = savedRezervations.filter(r => 
        (new Date(r.start).getTime() >= new Date(dateStart).getTime() && new Date(r.start).getTime() <= new Date(dateEnd).getTime()) || 
        (new Date(r.start).getTime() >= new Date(dateStart).getTime() && new Date(r.end).getTime() <= new Date(dateEnd).getTime()) || 
        (new Date(r.start).getTime() <= new Date(dateStart).getTime() && new Date(r.end).getTime() >= new Date(dateEnd).getTime()) || 
        (new Date(r.end).getTime() >= new Date(dateStart).getTime() && new Date(r.end).getTime() <= new Date(dateEnd).getTime()));
    const specificOrders: Order[][] = [];

    if(!specificRezervations) {
        throw new Error("There are no orders in this time period!");
    }

    for(let i = 0; i < specificRezervations.length; i++) {
        const temp = savedOrders.filter(o => o.table.name === specificRezervations[i].table.name)
        if(temp) {
            specificOrders.push(temp);
        }
    }

    if(!specificOrders) {
        throw new Error("There are no orders in this time period!");
    }

    let print = '';

    for(let i = 0; i < specificOrders.length; i++) {
        let meals = '';

        for(let j = 0; j < specificOrders[i].length; j++) {
            for(let k = 0; k < specificOrders[i][j].meals.length; k++) {
                meals += " Meal name: " + specificOrders[i][j].meals[k].name + " Meal price: " + specificOrders[i][j].meals[k].price 
                + " Meal category: " + specificOrders[i][j].meals[k].category + " ";
                }
        
                print += "ID: " + specificOrders[i][j].id + " Worker name: " + specificOrders[i][j].worker.name + " Worker surname: " + specificOrders[i][j].worker.surname 
                + " Worker occupation: " + specificOrders[i][j].worker.occupation + meals + " Status: " + specificOrders[i][j].status + " Table name: " 
                + specificOrders[i][j].table.name + " Table number of place settings: " + specificOrders[i][j].table.numPlaces + " Table status: " 
                + specificOrders[i][j].table.status + " Price: " + specificOrders[i][j].price + "\n";
        }
    }
    
    return print;
}

// Report remuneration in specified time period
export async function reportIncomeByTime(start: string, end: string): Promise<number> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];
    const dateStart = new Date(start);
    const dateEnd = new Date(end);
    const specificRezervations = savedRezervations.filter(r => 
        (new Date(r.start).getTime() >= new Date(dateStart).getTime() && new Date(r.start).getTime() <= new Date(dateEnd).getTime()) || 
        (new Date(r.start).getTime() >= new Date(dateStart).getTime() && new Date(r.end).getTime() <= new Date(dateEnd).getTime()) || 
        (new Date(r.start).getTime() <= new Date(dateStart).getTime() && new Date(r.end).getTime() >= new Date(dateEnd).getTime()) || 
        (new Date(r.end).getTime() >= new Date(dateStart).getTime() && new Date(r.end).getTime() <= new Date(dateEnd).getTime()));
    const specificOrders: Order[][] = [];

    if(!specificRezervations) {
        throw new Error("There are no orders in this time period!");
    }

    for(let i = 0; i < specificRezervations.length; i++) {
        const temp = savedOrders.filter(o => o.table.name === specificRezervations[i].table.name)
        if(temp) {
            specificOrders.push(temp);
        }
    }

    if(!specificOrders) {
        throw new Error("There are no orders in this time period!");
    }

    let income = 0;

    for(let i = 0; i < specificOrders.length; i++) {
        for(let j = 0; j < specificOrders[i].length; j++) { 
            income += parseFloat(specificOrders[i][j].price);
        }
    }
    
    return income;
}
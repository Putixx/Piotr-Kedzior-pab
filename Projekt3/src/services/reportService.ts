/* IMPORT */

import { Order } from "../models/orderModel";
import { Rezervation } from "../models/rezervationModel";
import { readStorage } from "../services/storageService";

/* FUNCTIONS */

// Read order specified by worker ID
export async function reportByWorkerID(searchID: number): Promise<JSON> {
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];
  
    if(savedOrders.length < 1) {
      throw new Error("There are no orders!");
    }
  
    const specificOrders = savedOrders.filter(o => o.worker.id === searchID)
  
    if(!specificOrders) {
        throw new Error("There are no orders for this worker!");
    }

    return JSON.parse(JSON.stringify(specificOrders));
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

    return JSON.parse(JSON.stringify(specificOrders));
}

// Report remuneration in specified time period
export async function reportIncomeByTime(start: string, end: string): Promise<JSON> {
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

    const incomeReport = {
        id: Date.now(),
        income: 0
    }

    for(let i = 0; i < specificOrders.length; i++) {
        for(let j = 0; j < specificOrders[i].length; j++) { 
            incomeReport.income += specificOrders[i][j].price;
        }
    }
    
    return JSON.parse(JSON.stringify(incomeReport));
}
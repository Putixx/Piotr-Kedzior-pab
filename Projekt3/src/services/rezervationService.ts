/* IMPORT */

import { Table, TableStatus } from "../models/Table";
import { Rezervation } from "../models/Rezervation";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new rezervation
export async function createRezervation(data: Rezervation): Promise<number> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];
    const specificTable = savedTables.find(t => t.name === data.table.name && t.numPlaces === data.table.numPlaces);
    
    if(!specificTable) {
        throw new Error("There is no such table!")
    }


    specificTable.status = TableStatus['taken'];
    data.table = specificTable;
    const newRezervation: Rezervation = new Rezervation(data);

    if(new Date(newRezervation.end).getTime() < new Date(newRezervation.start).getTime()) {
        throw new Error("End time must be later than start time!")
    }

    if(savedRezervations.find(r => new Date(r.end).getTime() > new Date(newRezervation.start).getTime() && r.table.name === newRezervation.table.name)) {
        throw new Error("Current table is already reserved!");
    }

    savedRezervations.push(newRezervation);
    await updateStorage('./data/rezervations.json', JSON.stringify(savedRezervations));
    return newRezervation.id;
}

// Read all rezervations
export async function readAllRezervations(): Promise<string> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];

    if(savedRezervations.length < 1) {
        throw new Error("There are no rezervations!");
    }

    let print = "";

    for(let i = 0; i < savedRezervations.length; i++) {
        print += "ID: " + savedRezervations[i].id + " Table name: " + savedRezervations[i].table.name + " Table number of place settings: " 
        + savedRezervations[i].table.numPlaces + " Table status: " + savedRezervations[i].table.status + " Start: " + savedRezervations[i].start 
        + " End: " + savedRezervations[i].end + " Client: " + savedRezervations[i].client + "\n";
    }

    return print;
}

// Read rezervation specified by ID
export async function readRezervation(searchID: number): Promise<string> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];

    if(savedRezervations.length < 1) {
        throw new Error("There are no rezervations!");
    }

    const rezervationIndex = savedRezervations.findIndex(r => r.id === searchID)

    if(rezervationIndex === -1) {
        throw new Error("Wrong ID!");
    }

    return "ID: " + savedRezervations[rezervationIndex].id + " Table name: " + savedRezervations[rezervationIndex].table.name + " Table number of place settings: " 
    + savedRezervations[rezervationIndex].table.numPlaces + " Table status: " + savedRezervations[rezervationIndex].table.status 
    + " Start: " + savedRezervations[rezervationIndex].start + " End: " + savedRezervations[rezervationIndex].end + " Client: " 
    + savedRezervations[rezervationIndex].client + "\n";
}

// Update existing rezervation specified by ID
export async function updateRezervation(data: Rezervation, searchID: number): Promise<string> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];

    if(savedRezervations.length < 1) {
        throw new Error("There are no rezervations!");
    }

    const rezervationIndex = savedRezervations.findIndex(r => r.id === searchID)

    if(rezervationIndex === -1) {
        throw new Error("Wrong ID!");
    }

    const printOld = "ID: " + savedRezervations[rezervationIndex].id + " Table name: " + savedRezervations[rezervationIndex].table.name + " Table number of place settings: " 
    + savedRezervations[rezervationIndex].table.numPlaces + " Table status: " + savedRezervations[rezervationIndex].table.status 
    + " Start: " + savedRezervations[rezervationIndex].start + " End: " + savedRezervations[rezervationIndex].end + " Client: " 
    + savedRezervations[rezervationIndex].client + "\n";

    if(data.table) {
        savedRezervations[rezervationIndex].table = data.table;
    }
    if(data.start) {
        savedRezervations[rezervationIndex].start = data.start;
    }
    if(data.end) {
        savedRezervations[rezervationIndex].end = data.end;
    }
    if(data.client) {
        savedRezervations[rezervationIndex].client = data.client;
    }
    
    const printNew = "ID: " + savedRezervations[rezervationIndex].id + " Table name: " + savedRezervations[rezervationIndex].table.name + " Table number of place settings: " 
    + savedRezervations[rezervationIndex].table.numPlaces + " Table status: " + savedRezervations[rezervationIndex].table.status 
    + " Start: " + savedRezervations[rezervationIndex].start + " End: " + savedRezervations[rezervationIndex].end + " Client: " 
    + savedRezervations[rezervationIndex].client + "\n";

    await updateStorage('./data/rezervations.json', JSON.stringify(savedRezervations));
    return printOld + printNew;
}

// Delete existing rezervation specified by ID
export async function deleteRezervation(searchID: number): Promise<void> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];

    if(savedRezervations.length < 1) {
        throw new Error("There are no rezervations!");
    }

    const rezervationIndex = savedRezervations.findIndex(r => r.id === searchID)

    if(rezervationIndex === -1) {
        throw new Error("Wrong ID!");
    }

    savedRezervations.splice(rezervationIndex, 1);
    await updateStorage('./data/rezervations.json', JSON.stringify(savedRezervations));
}
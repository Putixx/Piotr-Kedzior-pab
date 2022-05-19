/* IMPORT */

import { Table, TableStatus } from "../models/tableModel";
import { Rezervation } from "../models/rezervationModel";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new rezervation
export async function createRezervation(data: Rezervation): Promise<JSON> {
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
    return JSON.parse(JSON.stringify(newRezervation));
}

// Read all rezervations
export async function readAllRezervations(): Promise<JSON> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];

    if(savedRezervations.length < 1) {
        throw new Error("There are no rezervations!");
    }

    return JSON.parse(JSON.stringify(savedRezervations));
}

// Read rezervation specified by ID
export async function readRezervation(searchID: number): Promise<JSON> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];

    if(savedRezervations.length < 1) {
        throw new Error("There are no rezervations!");
    }

    const rezervationIndex = savedRezervations.findIndex(r => r.id === searchID)

    if(rezervationIndex === -1) {
        throw new Error("Wrong ID!");
    }

    return JSON.parse(JSON.stringify(savedRezervations[rezervationIndex]));
}

// Update existing rezervation specified by ID
export async function updateRezervation(data: Rezervation, searchID: number): Promise<JSON> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];

    if(savedRezervations.length < 1) {
        throw new Error("There are no rezervations!");
    }

    const rezervationIndex = savedRezervations.findIndex(r => r.id === searchID)

    if(rezervationIndex === -1) {
        throw new Error("Wrong ID!");
    }

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
    
    await updateStorage('./data/rezervations.json', JSON.stringify(savedRezervations));
    return JSON.parse(JSON.stringify(savedRezervations[rezervationIndex]));
}

// Delete existing rezervation specified by ID
export async function deleteRezervation(searchID: number): Promise<JSON> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];

    if(savedRezervations.length < 1) {
        throw new Error("There are no rezervations!");
    }

    const rezervationIndex = savedRezervations.findIndex(r => r.id === searchID)

    if(rezervationIndex === -1) {
        throw new Error("Wrong ID!");
    }

    const deletedRezervation = savedRezervations[rezervationIndex];
    savedRezervations.splice(rezervationIndex, 1);
    await updateStorage('./data/rezervations.json', JSON.stringify(savedRezervations));
    return JSON.parse(JSON.stringify(deletedRezervation));
}
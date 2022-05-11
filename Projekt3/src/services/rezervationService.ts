/* IMPORT */

import { Table } from "../models/Table";
import { Rezervation } from "../models/Rezervation";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new rezervation
export async function createRezervation(data: Rezervation): Promise<number> {
    const newRezervation: Rezervation = new Rezervation(data);
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(!savedTables.find(t => t.name === newRezervation.table.name && t.numPlaces === newRezervation.table.numPlaces)) {
        throw new Error("There is no such table!")
    }

    if(savedRezervations.find(r => r.table === newRezervation.table)) {
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
        + savedRezervations[i].table.numPlaces + "Table status: " + savedRezervations[i].table.status + " Start: " + savedRezervations[i].start 
        + " End: " + savedRezervations[i].end + " Client: " + savedRezervations[i].client + "\n";
    }

    return print;
}

// Read rezervation specified by ID
export async function readRezervation(searchID: number): Promise<string> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervation.json')) ?? [];

    if(savedRezervations.length < 1) {
        throw new Error("There are no rezervations!");
    }

    const reservationIndex = savedRezervations.findIndex(r => r.id === searchID)

    if(reservationIndex === -1) {
        throw new Error("Wrong ID!");
    }

    return "ID: " + savedRezervations[reservationIndex].id + " Table: " + savedRezervations[reservationIndex].table + " Start: " 
    + savedRezervations[reservationIndex].start + " End: " + savedRezervations[reservationIndex].end + " Client: " + savedRezervations[reservationIndex].client + "\n";
}

// Update existing rezervation specified by ID
export async function updateRezervation(data: Rezervation, searchID: number): Promise<string> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervation.json')) ?? [];

    if(savedRezervations.length < 1) {
        throw new Error("There are no rezervations!");
    }

    const reservationIndex = savedRezervations.findIndex(r => r.id === searchID)

    if(reservationIndex === -1) {
        throw new Error("Wrong ID!");
    }

    const printOld = "ID: " + savedRezervations[reservationIndex].id + " Table: " + savedRezervations[reservationIndex].table + " Start: " 
    + savedRezervations[reservationIndex].start + " End: " + savedRezervations[reservationIndex].end + " Client: " 
    + savedRezervations[reservationIndex].client + "\n";

    if(data.table) {
        savedRezervations[reservationIndex].table = data.table;
    }
    if(data.start) {
        savedRezervations[reservationIndex].start = data.start;
    }
    if(data.end) {
        savedRezervations[reservationIndex].end = data.end;
    }
    if(data.client) {
        savedRezervations[reservationIndex].client = data.client;
    }
    
    const printNew = "ID: " + savedRezervations[reservationIndex].id + " Table: " + savedRezervations[reservationIndex].table + " Start: " + savedRezervations[reservationIndex].start 
    + " End: " + savedRezervations[reservationIndex].end + " Client: " + savedRezervations[reservationIndex].client + "\n";

    await updateStorage('./data/rezervations.json', JSON.stringify(savedRezervations));
    return printOld + printNew;
}

// Delete existing rezervation specified by ID
export async function deleteRezervation(searchID: number): Promise<void> {
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('./data/rezervations.json')) ?? [];

    if(savedRezervations.length < 1) {
        throw new Error("There is no rezervations!");
    }

    const reservationIndex = savedRezervations.findIndex(r => r.id === searchID)

    if(reservationIndex === -1) {
        throw new Error("Wrong ID!");
    }

    savedRezervations.splice(reservationIndex, 1);
    await updateStorage('./data/rezervations.json', JSON.stringify(savedRezervations));
}
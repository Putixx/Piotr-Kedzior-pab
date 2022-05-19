/* IMPORT */

import { Table, TableStatus } from "../models/tableModel";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new table
export async function createTable(data: Table): Promise<JSON> {
    const newTable = new Table(data);
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];
  
    if(savedTables.find(t => t.name === newTable.name)) {
      throw new Error("Current table is already registered!");
    }
  
    savedTables.push(newTable);
    await updateStorage('./data/tables.json', JSON.stringify(savedTables));

    return JSON.parse(JSON.stringify(newTable));
}

// Read tables specified by number of place settings
export async function readTableByNumOfPlaces(numPlaces: number): Promise<JSON> {
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(savedTables.length < 1) {
        throw new Error("There are no such tables!");
    }

    const specificTables = savedTables.filter(t => t.numPlaces.toString() === numPlaces.toString());

    if(specificTables.length < 1) {
        throw new Error("No free tables of specified number of place settings available!");
    }

    return JSON.parse(JSON.stringify(specificTables));
}

// Read all tables
export async function readAllTables(): Promise<JSON> {
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(savedTables.length < 1) {
        throw new Error("There are no tables!");
    }

    return JSON.parse(JSON.stringify(savedTables));
}

// Read table specified by ID
export async function readTable(searchID: number): Promise<JSON> {
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(savedTables.length < 1) {
        throw new Error("There are no tables!");
    }

    const tableIndex = savedTables.findIndex(t => t.id === searchID)

    if(tableIndex === -1) {
        throw new Error("Wrong ID!");
    }

    return JSON.parse(JSON.stringify(savedTables[tableIndex]));
}

// Update existing table specified by ID
export async function updateTable(data: Table, searchID: number): Promise<JSON> {
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(savedTables.length < 1) {
        throw new Error("There are no tables!");
    }

    const tableIndex = savedTables.findIndex(t => t.id === searchID)

    if(tableIndex === -1) {
        throw new Error("Wrong ID!");
    }

    if(data.name) {
        savedTables[tableIndex].name = data.name;
    }
    if(data.numPlaces) {
        savedTables[tableIndex].numPlaces = data.numPlaces;
    }
    if(data.status) {
        savedTables[tableIndex].status = data.status;
    }

    await updateStorage('./data/tables.json', JSON.stringify(savedTables));
    return JSON.parse(JSON.stringify(savedTables[tableIndex]));
}

// Delete existing table specified by ID
export async function deleteTable(searchID: number): Promise<JSON> {
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(savedTables.length < 1) {
        throw new Error("There are no tables!");
    }

    const tableIndex = savedTables.findIndex(t => t.id === searchID)

    if(tableIndex === -1) {
        throw new Error("Wrong ID!");
    }

    const deletedTables = savedTables[tableIndex];
    savedTables.splice(tableIndex, 1);
    await updateStorage('./data/tables.json', JSON.stringify(savedTables));
    return JSON.parse(JSON.stringify(deletedTables));
}
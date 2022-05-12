/* IMPORT */

import { Table, TableStatus } from "../models/Table";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new table
export async function createTable(data: Table): Promise<number> {

    const newTable = new Table(data);
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];
  
    if(savedTables.find(t => t.name === newTable.name)) {
      throw new Error("Current table is already registered!");
    }
  
    savedTables.push(newTable);
    await updateStorage('./data/tables.json', JSON.stringify(savedTables));

    return newTable.id;
}

// Read tables specified by number of place settings
export async function readTableByNumOfPlaces(numPlaces: number): Promise<string> {
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(savedTables.length < 1) {
        throw new Error("There are no such tables!");
    }

    const specificTables = savedTables.filter(t => t.numPlaces.toString() === numPlaces.toString());

    if(specificTables.length < 1) {
        return 'No free tables of specified number of place settings available!';
    }

    let print = "";
    
    for(let i = 0; i < specificTables.length; i++) {
        print += "ID: " + specificTables[i].id + " Name: " + specificTables[i].name + " Number of place settings: " + specificTables[i].numPlaces 
        + " Status: " + specificTables[i].status + "\n";
    }

    return print;
}

// Read all tables
export async function readAllTables(): Promise<string> {
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(savedTables.length < 1) {
        throw new Error("There are no tables!");
    }

    let print = "";

    for(let i = 0; i < savedTables.length; i++) {
        print += "ID: " + savedTables[i].id + " Name: " + savedTables[i].name + " Number of place settings: " + savedTables[i].numPlaces 
        + " Status: " + savedTables[i].status + "\n";
    }

    return print;
}

// Read table specified by ID
export async function readTable(searchID: number): Promise<string> {
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(savedTables.length < 1) {
        throw new Error("There are no tables!");
    }

    const tableIndex = savedTables.findIndex(t => t.id === searchID)

    if(tableIndex === -1) {
        throw new Error("Wrong ID!");
    }

    return "ID: " + savedTables[tableIndex].id + " Name: " + savedTables[tableIndex].name + " Number of place settings: " 
    + savedTables[tableIndex].numPlaces + " Status: " + savedTables[tableIndex].status + "\n";
}

// Update existing table specified by ID
export async function updateTable(data: Table, searchID: number): Promise<string> {
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(savedTables.length < 1) {
        throw new Error("There are no tables!");
    }

    const tableIndex = savedTables.findIndex(t => t.id === searchID)

    if(tableIndex === -1) {
        throw new Error("Wrong ID!");
    }

    const printOld = "ID: " + savedTables[tableIndex].id + " Name: " + savedTables[tableIndex].name + " Number of place settings: " 
    + savedTables[tableIndex].numPlaces + " Status: " + savedTables[tableIndex].status + "\n";

    if(data.name) {
        savedTables[tableIndex].name = data.name;
    }
    if(data.numPlaces) {
        savedTables[tableIndex].numPlaces = data.numPlaces;
    }
    if(data.status) {
        savedTables[tableIndex].status = data.status;
    }
    
    const printNew = "ID: " + savedTables[tableIndex].id + " Name: " + savedTables[tableIndex].name + " Number of place settings: " 
    + savedTables[tableIndex].numPlaces + " Status: " + savedTables[tableIndex].status + "\n";

    await updateStorage('./data/tables.json', JSON.stringify(savedTables));
    return printOld + printNew;
}

// Delete existing table specified by ID
export async function deleteTable(searchID: number): Promise<void> {
    const savedTables: Table[] = JSON.parse(await readStorage('./data/tables.json')) ?? [];

    if(savedTables.length < 1) {
        throw new Error("There are no tables!");
    }

    const tableIndex = savedTables.findIndex(t => t.id === searchID)

    if(tableIndex === -1) {
        throw new Error("Wrong ID!");
    }

    savedTables.splice(tableIndex, 1);
    await updateStorage('./data/tables.json', JSON.stringify(savedTables));
}
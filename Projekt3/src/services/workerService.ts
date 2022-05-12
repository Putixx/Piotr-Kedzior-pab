/* IMPORT */

import { Worker } from "../models/Worker";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new worker
export async function createWorker(data: Worker): Promise<number> {
    const newWorker = new Worker(data);
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];
    
    if(savedWorkers.find(w => w.name === newWorker.name && w.surname === newWorker.surname && w.occupation === newWorker.occupation)) {
        throw new Error("Current worker is already registered!");
    }
    
    savedWorkers.push(newWorker);
    await updateStorage('./data/workers.json', JSON.stringify(savedWorkers));
    return newWorker.id;
}

// Read all workers
export async function readAllWorkers(): Promise<string> {
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];

    if(savedWorkers.length < 1) {
      throw new Error("There are no workers!");
    }
  
    let print = "";
  
    for(let i = 0; i < savedWorkers.length; i++) {
      print += "ID: " + savedWorkers[i].id + " Name: " + savedWorkers[i].name + " Surname: " + savedWorkers[i].surname 
      + " Occupation: " + savedWorkers[i].occupation + "\n";
    }

    return print;
}

// Read worker specified by ID
export async function readWorker(searchID: number): Promise<string> {
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];

  if(savedWorkers.length < 1) {
    throw new Error("There are no workers!");
  }

  const workerIndex = savedWorkers.findIndex(w => w.id === searchID)

  if(workerIndex === -1) {
    throw new Error("Wrong ID!");
  }

  return "ID: " + savedWorkers[workerIndex].id + " Name: " + savedWorkers[workerIndex].name + " Surname: " + savedWorkers[workerIndex].surname 
  + " Occupation: " + savedWorkers[workerIndex].occupation + "\n";
}

// Update existing worker specified by ID
export async function updateWorker(data: Worker, searchID: number): Promise<string> {
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];

    if(savedWorkers.length < 1) {
        throw new Error("There are no workers!");
    }

    const workerIndex = savedWorkers.findIndex(w => w.id === searchID)

    if(workerIndex === -1) {
        throw new Error("Wrong ID!");
    }

    const printOld = "ID: " + savedWorkers[workerIndex].id + " Name: " + savedWorkers[workerIndex].name + " Surname: " + savedWorkers[workerIndex].surname 
    + " Occupation: " + savedWorkers[workerIndex].occupation + "\n";

    if(data.name) {
        savedWorkers[workerIndex].name = data.name;
    }
    if(data.surname) {
        savedWorkers[workerIndex].surname = data.surname;
    }
    if(data.occupation) {
        savedWorkers[workerIndex].occupation = data.occupation;
    }
    
    const printNew = "ID: " + savedWorkers[workerIndex].id + " Name: " + savedWorkers[workerIndex].name + " Surname: " 
    + savedWorkers[workerIndex].surname + " Occupation: " + savedWorkers[workerIndex].occupation + "\n";

    await updateStorage('./data/workers.json', JSON.stringify(savedWorkers));
    return printOld + printNew;
}

// Delete existing worker specified by ID
export async function deleteWorker(searchID: number): Promise<void> {
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];

  if(savedWorkers.length < 1) {
    throw new Error("There are no workers!");
  }

  const workerIndex = savedWorkers.findIndex(w => w.id === searchID)

  if(workerIndex === -1) {
    throw new Error("Wrong ID!");
  }

  savedWorkers.splice(workerIndex, 1);
  await updateStorage('./data/workers.json', JSON.stringify(savedWorkers));
}
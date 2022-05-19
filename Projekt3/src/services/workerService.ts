/* IMPORT */

import { Worker } from "../models/workerModel";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new worker
export async function createWorker(data: Worker): Promise<JSON> {
    const newWorker = new Worker(data);
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];
    
    if(savedWorkers.find(w => w.name === newWorker.name && w.surname === newWorker.surname && w.occupation === newWorker.occupation)) {
        throw new Error("Current worker is already registered!");
    }
    
    savedWorkers.push(newWorker);
    await updateStorage('./data/workers.json', JSON.stringify(savedWorkers));
    return JSON.parse(JSON.stringify(newWorker));
}

// Read all workers
export async function readAllWorkers(): Promise<JSON> {
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];

    if(savedWorkers.length < 1) {
      throw new Error("There are no workers!");
    }
  
    return JSON.parse(JSON.stringify(savedWorkers));
}

// Read worker specified by ID
export async function readWorker(searchID: number): Promise<JSON> {
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];

  if(savedWorkers.length < 1) {
    throw new Error("There are no workers!");
  }

  const workerIndex = savedWorkers.findIndex(w => w.id === searchID)

  if(workerIndex === -1) {
    throw new Error("Wrong ID!");
  }

  return JSON.parse(JSON.stringify(savedWorkers[workerIndex]));
}

// Update existing worker specified by ID
export async function updateWorker(data: Worker, searchID: number): Promise<JSON> {
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];

    if(savedWorkers.length < 1) {
        throw new Error("There are no workers!");
    }

    const workerIndex = savedWorkers.findIndex(w => w.id === searchID)

    if(workerIndex === -1) {
        throw new Error("Wrong ID!");
    }

    if(data.name) {
        savedWorkers[workerIndex].name = data.name;
    }
    if(data.surname) {
        savedWorkers[workerIndex].surname = data.surname;
    }
    if(data.occupation) {
        savedWorkers[workerIndex].occupation = data.occupation;
    }
    
    await updateStorage('./data/workers.json', JSON.stringify(savedWorkers));
    return JSON.parse(JSON.stringify(savedWorkers[workerIndex]));
}

// Delete existing worker specified by ID
export async function deleteWorker(searchID: number): Promise<JSON> {
    const savedWorkers: Worker[] = JSON.parse(await readStorage('./data/workers.json')) ?? [];

  if(savedWorkers.length < 1) {
    throw new Error("There are no workers!");
  }

  const workerIndex = savedWorkers.findIndex(w => w.id === searchID)

  if(workerIndex === -1) {
    throw new Error("Wrong ID!");
  }

  const deletedWorker = savedWorkers[workerIndex];
  savedWorkers.splice(workerIndex, 1);
  await updateStorage('./data/workers.json', JSON.stringify(savedWorkers));
  return JSON.parse(JSON.stringify(deletedWorker));
}
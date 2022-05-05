/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { Worker } from "../models/Worker";
import { readStorage, updateStorage } from "../services/storageService";

/* SETUP */

const app = express();
app.use(express.json());

/* POST */

// POST register new table
app.post("/register/worker", async function (req: Request, res: Response) {
  if (!req.body) {
    res.status(401).send("To register a new worker you need to send it's: name, surname and occupation!");
  }
  if (!req.body.name) {
    res.status(401).send("Name is missing!");
  }
  if (!req.body.surname) {
    res.status(401).send("Surname is missing!");
  }
  if (!req.body.occupation) {
    res.status(401).send("Occupation is missing!");
  }

  const data = JSON.parse(JSON.stringify(req.body));

  const newWorker = {
    id: Date.now(),
    name: data.name,
    surname: data.surname,
    occupation: data.occupation
  };

  const savedWorkers: Worker[] = JSON.parse(await readStorage('../data/workers.json')) ?? [];

  if(savedWorkers.find(w => w.name === newWorker.name && w.surname === newWorker.surname && w.occupation === newWorker.occupation)) {
    res.status(400).send("Current worker is already registered!");
  }

  savedWorkers.push(newWorker);
  await updateStorage('../data/workers.json', JSON.stringify(savedWorkers));

  res.status(200).send("New worker registration succeded! It's ID: " + newWorker.id);
});

/* GET */

// GET registered workers
app.get("/workers", async function (req: Request, res: Response) {
  const savedWorkers: Worker[] = JSON.parse(await readStorage('../data/workers.json')) ?? [];

  if(savedWorkers.length < 1) {
    res.status(400).send("There is no workers!");
  }

  let print = "";

  for(let i = 0; i < savedWorkers.length; i++) {
    print += "ID: " + savedWorkers[i].id + " Name: " + savedWorkers[i].name + " Surname: " + savedWorkers[i].surname 
    + " Occupation: " + savedWorkers[i].occupation + "\n";
  }

  res.status(201).send("List of workers: \n" + print);
});

// GET registered worker by id
app.get("/worker/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedWorkers: Worker[] = JSON.parse(await readStorage('../data/workers.json')) ?? [];

  if(savedWorkers.length < 1) {
    res.status(400).send("There is no tables!");
  }

  const workerIndex = savedWorkers.findIndex(w => w.id === +req.params.id)

  if(workerIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const print = "ID: " + savedWorkers[workerIndex].id + " Name: " + savedWorkers[workerIndex].name + " Surname: " + savedWorkers[workerIndex].surname 
  + " Occupation: " + savedWorkers[workerIndex].occupation + "\n";

  res.status(201).send("Table before edit: " + print);
});

/* PUT */

// EDIT registered worker by id
app.put("/worker/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    res.status(400).send("You need to send new data to update existing worker!");
  }
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedWorkers: Worker[] = JSON.parse(await readStorage('../data/workers.json')) ?? [];

  if(savedWorkers.length < 1) {
    res.status(400).send("There is no workers!");
  }

  const workerIndex = savedWorkers.findIndex(t => t.id === +req.params.id)

  if(workerIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const data = JSON.parse(JSON.stringify(req.body));
  const tempTable = savedWorkers[workerIndex];

  if(data.name) {
    savedWorkers[workerIndex].name = data.name;
  }
  if(data.surname) {
    savedWorkers[workerIndex].surname = data.surname;
  }
  if(data.occupation) {
    savedWorkers[workerIndex].occupation = data.occupation;
  }
  
  const printOld = "ID: " + tempTable.id + " Name: " + tempTable.name + " Surname: " + tempTable.surname 
  + " Occupation: " + tempTable.occupation + "\n";

  const printNew = "ID: " + savedWorkers[workerIndex].id + " Name: " + savedWorkers[workerIndex].name + " Surname: " 
  + savedWorkers[workerIndex].surname + " Occupation: " + savedWorkers[workerIndex].occupation + "\n";

  await updateStorage('../data/workers.json', JSON.stringify(savedWorkers));
  res.status(201).send("Worker before edit: " + printOld + " Worker after edit: " + printNew);
});

/* DELETE */

// DELETE registered worker by id
app.delete("/worker/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedWorkers: Worker[] = JSON.parse(await readStorage('../data/workers.json')) ?? [];

  if(savedWorkers.length < 1) {
    res.status(400).send("There is no workers!");
  }

  const workerIndex = savedWorkers.findIndex(w => w.id === +req.params.id)

  if(workerIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  savedWorkers.splice(workerIndex, 1);
  await updateStorage('../data/workers.json', JSON.stringify(savedWorkers));
  res.status(201).send("Worker successfuly removed!");
});

app.listen(3000);
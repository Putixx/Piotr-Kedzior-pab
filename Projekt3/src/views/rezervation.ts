/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { Rezervation } from "../models/Rezervation";
import { readStorage, updateStorage } from "../services/storageService";

/* SETUP */

const app = express();
app.use(express.json());

/* POST */

// POST register new rezervation
app.post("/register/rezervation", async function (req: Request, res: Response) {
  if (!req.body) {
    res.status(401).send("To register a new rezervation you need to send it's: table, start time, end time and client!");
  }
  if (!req.body.table) {
    res.status(401).send("Table is missing!");
  }
  if (!req.body.start) {
    res.status(401).send("Start time is missing!");
  }
  if (!req.body.end) {
    res.status(401).send("End time is missing!");
  }
  if (!req.body.client) {
    res.status(401).send("Client data is missing!");
  }

  const data = JSON.parse(JSON.stringify(req.body));


  const newRezervation = {
    id: Date.now(),
    table: data.table,
    start: data.start,
    end: data.end,
    client: data.client
  };

  const savedRezervations: Rezervation[] = JSON.parse(await readStorage('../data/rezervations.json')) ?? [];

  if(savedRezervations.find(r => r.table === newRezervation.table)) {
    res.status(400).send("Current table is already reserved!");
  }

  savedRezervations.push(newRezervation);
  await updateStorage('../data/rezervations.json', JSON.stringify(savedRezervations));

  res.status(200).send("New rezervation registration succeded! It's ID: " + newRezervation.id);
});

/* GET */

// GET registered rezervations
app.get("/rezervations", async function (req: Request, res: Response) {
  const savedRezervations: Rezervation[] = JSON.parse(await readStorage('../data/rezervations.json')) ?? [];

  if(savedRezervations.length < 1) {
    res.status(400).send("There is no rezervations!");
  }

  let print = "";

  for(let i = 0; i < savedRezervations.length; i++) {
    print += "ID: " + savedRezervations[i].id + " Table: " + savedRezervations[i].table + " Start: " + savedRezervations[i].start 
    + " End: " + savedRezervations[i].end + " Client: " + savedRezervations[i].client + "\n";
  }

  res.status(201).send("List of rezervations: \n" + print);
});

// GET registered rezervation by id
app.get("/rezervation/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedRezervations: Rezervation[] = JSON.parse(await readStorage('../data/rezervation.json')) ?? [];

  if(savedRezervations.length < 1) {
    res.status(400).send("There is no rezervations!");
  }

  const reservationIndex = savedRezervations.findIndex(r => r.id === +req.params.id)

  if(reservationIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const print = "ID: " + savedRezervations[reservationIndex].id + " Table: " + savedRezervations[reservationIndex].table + " Start: " + savedRezervations[reservationIndex].start 
  + " End: " + savedRezervations[reservationIndex].end + " Client: " + savedRezervations[reservationIndex].client + "\n";

  res.status(201).send("Reservation: " + print);
});

/* PUT */

// EDIT registered rezervation by id
app.put("/rezervation/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    res.status(400).send("You need to send new data to update existing rezervation!");
  }
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedRezervations: Rezervation[] = JSON.parse(await readStorage('../data/rezervation.json')) ?? [];

  if(savedRezervations.length < 1) {
    res.status(400).send("There is no rezervations!");
  }

  const reservationIndex = savedRezervations.findIndex(r => r.id === +req.params.id)

  if(reservationIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const data = JSON.parse(JSON.stringify(req.body));
  const tempTable = savedRezervations[reservationIndex];

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
  
  const printOld = "ID: " + tempTable.id + " Table: " + tempTable.table + " Start: " + tempTable.start 
  + " End: " + tempTable.end + " Client: " + tempTable.client + "\n";

  const printNew = "ID: " + savedRezervations[reservationIndex].id + " Table: " + savedRezervations[reservationIndex].table + " Start: " + savedRezervations[reservationIndex].start 
  + " End: " + savedRezervations[reservationIndex].end + " Client: " + savedRezervations[reservationIndex].client + "\n";

  await updateStorage('../data/rezervations.json', JSON.stringify(savedRezervations));
  res.status(201).send("Rezervation before edit: " + printOld + " Rezervation after edit: " + printNew);
});

/* DELETE */

// DELETE registered rezervation by id
app.delete("/rezervation/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedRezervations: Rezervation[] = JSON.parse(await readStorage('../data/rezervations.json')) ?? [];

  if(savedRezervations.length < 1) {
    res.status(400).send("There is no rezervations!");
  }

  const reservationIndex = savedRezervations.findIndex(r => r.id === +req.params.id)

  if(reservationIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  savedRezervations.splice(reservationIndex, 1);
  await updateStorage('../data/rezervations.json', JSON.stringify(savedRezervations));
  res.status(201).send("Rezervation successfuly removed!");
});

app.listen(3000);
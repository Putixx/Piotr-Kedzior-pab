/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { Table } from "../models/Table";
import { readStorage, updateStorage } from "../services/storageService";

/* SETUP */

const app = express();
app.use(express.json());

/* POST */

// POST register new table
app.post("/register/table", async function (req: Request, res: Response) {
  if (!req.body) {
    res.status(401).send("To register a new table you need to send it's: name, number of place settings and status!");
  }
  if (!req.body.name) {
    res.status(401).send("Name is missing!");
  }
  if (!req.body.numPlaces) {
    res.status(401).send("Number of place settings is missing!");
  }
  if (!req.body.status) {
    res.status(401).send("Status is missing!");
  }
  if(req.body.status === 'free' || req.body.status === 'taken' || req.body.status === 'unavailable') {
    const data = JSON.parse(JSON.stringify(req.body));

    const newTable = {
      id: Date.now(),
      name: data.name,
      numPlaces: data.numPlaces,
      status: data.status
    };
  
    const savedTables: Table[] = JSON.parse(await readStorage('../data/tables.json')) ?? [];
  
    if(savedTables.find(t => t.name === newTable.name)) {
      res.status(400).send("Current table is already registered!");
    }
  
    savedTables.push(newTable);
    await updateStorage('../data/tables.json', JSON.stringify(savedTables));
  
    res.status(200).send("New table registration succeded! It's ID: " + newTable.id);
  }
  else {
    res.status(401).send("Statuses available: free, taken, unavailable!");
  }
});

/* GET */

// GET registered tables with specific number of place settings
app.get("/tables/:numPlaces", async function (req: Request, res: Response) {
  const savedTables: Table[] = JSON.parse(await readStorage('../data/tables.json')) ?? [];

  if(savedTables.length < 1) {
    res.status(400).send("There is no such tables!");
  }

  const specificTables = savedTables.filter(t => t.numPlaces === +req.params.numPlaces && t.status === 'free');

  if(!specificTables) {
    res.status(400).send("There is no such tables!");
  }

  let print = "";

  for(let i = 0; i < specificTables.length; i++) {
    print += "ID: " + specificTables[i].id + " Name: " + specificTables[i].name + " Number of place settings: " + specificTables[i].numPlaces 
    + " Status: " + specificTables[i].status + "\n";
  }

  res.status(201).send("Free tables with specific number of place settings: \n" + print);
});

// GET registered tables
app.get("/tables", async function (req: Request, res: Response) {
  const savedTables: Table[] = JSON.parse(await readStorage('../data/tables.json')) ?? [];

  if(savedTables.length < 1) {
    res.status(400).send("There is no tables!");
  }

  let print = "";

  for(let i = 0; i < savedTables.length; i++) {
    print += "ID: " + savedTables[i].id + " Name: " + savedTables[i].name + " Number of place settings: " + savedTables[i].numPlaces 
    + " Status: " + savedTables[i].status + "\n";
  }

  res.status(201).send("List of tables: \n" + print);
});

// GET registered table by id
app.get("/table/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedTables: Table[] = JSON.parse(await readStorage('../data/tables.json')) ?? [];

  if(savedTables.length < 1) {
    res.status(400).send("There is no tables!");
  }

  const tableIndex = savedTables.findIndex(t => t.id === +req.params.id)

  if(tableIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const print = "ID: " + savedTables[tableIndex].id + " Name: " + savedTables[tableIndex].name + " Number of place settings: " 
  + savedTables[tableIndex].numPlaces + " Status: " + savedTables[tableIndex].status + "\n";

  res.status(201).send("Table before edit: " + print);
});

/* PUT */

// EDIT registered tables by id
app.put("/table/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    res.status(400).send("You need to send new data to update existing table!");
  }
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedTables: Table[] = JSON.parse(await readStorage('../data/tables.json')) ?? [];

  if(savedTables.length < 1) {
    res.status(400).send("There is no tables!");
  }

  const tableIndex = savedTables.findIndex(t => t.id === +req.params.id)

  if(tableIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const data = JSON.parse(JSON.stringify(req.body));
  const tempTable = savedTables[tableIndex];

  if(data.name) {
    savedTables[tableIndex].name = data.name;
  }
  if(data.numPlaces) {
    savedTables[tableIndex].numPlaces = data.numPlaces;
  }
  if(data.status) {
    savedTables[tableIndex].status = data.status;
  }
  
  const printOld = "ID: " + tempTable.id + " Name: " + tempTable.name + " Number of place settings: " + tempTable.numPlaces 
  + " Status: " + tempTable.status + "\n";

  const printNew = "ID: " + savedTables[tableIndex].id + " Name: " + savedTables[tableIndex].name + " Number of place settings: " 
  + savedTables[tableIndex].numPlaces + " Status: " + savedTables[tableIndex].status + "\n";

  await updateStorage('../data/tables.json', JSON.stringify(savedTables));
  res.status(201).send("Table before edit: " + printOld + " Table after edit: " + printNew);
});

/* DELETE */

// DELETE registered table by id
app.delete("/table/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedTables: Table[] = JSON.parse(await readStorage('../data/tables.json')) ?? [];

  if(savedTables.length < 1) {
    res.status(400).send("There is no tables!");
  }

  const tableIndex = savedTables.findIndex(t => t.id === +req.params.id)

  if(tableIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  savedTables.splice(tableIndex, 1);
  await updateStorage('../data/tables.json', JSON.stringify(savedTables));
  res.status(201).send("Table successfuly removed!");
});

app.listen(3000);
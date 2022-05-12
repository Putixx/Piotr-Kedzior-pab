/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createTable, deleteTable, readAllTables, readTable, readTableByNumOfPlaces, updateTable } from "../services/tableService";

/* SETUP */

const tableRouter = express.Router();

/* POST */

// POST register new table
tableRouter.post("/register", async function (req: Request, res: Response) {
  if (!req.body) {
    return res.status(400).send("To register a new table you need to send it's: name, number of place settings and status!");
  }
  if (!req.body.name) {
    return res.status(400).send("Name is missing!");
  }
  if (!req.body.numPlaces) {
    return res.status(400).send("Number of place settings is missing!");
  }
  if (!req.body.status) {
    return res.status(400).send("Status is missing!");
  }
  if(req.body.status === 'free' || req.body.status === 'taken' || req.body.status === 'unavailable') {
    return res.status(201).send("New table registration succeded! It's ID: " + await createTable(JSON.parse(JSON.stringify(req.body))));
  }
  else {
    return res.status(400).send("Statuses available: free, taken, unavailable!");
  }
});

/* GET */

// GET registered tables with specific number of place settings
tableRouter.get("/find/:numPlaces", async function (req: Request, res: Response) {
  return res.status(200).send("Free tables with specific number of place settings: \n" + await readTableByNumOfPlaces(+req.params.numPlaces));
});

// GET registered tables
tableRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send("List of tables: \n" + await readAllTables());
});

// GET registered table by id
tableRouter.get("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send("Table: " + await readTable(+req.params.id));
});

/* PUT */

// EDIT registered tables by id
tableRouter.put("/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    return res.status(400).send("You need to send new data to update existing table!");
  }
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  if(req.body.status === 'free' || req.body.status === 'taken' || req.body.status === 'unavailable') {
    return res.status(200).send("Table before and after edit: \n" + await updateTable(JSON.parse(JSON.stringify(req.body)), +req.params.id));
  }
  else {
    return res.status(400).send("Statuses available: free, taken, unavailable!");
  }
});

/* DELETE */

// DELETE registered table by id
tableRouter.delete("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  await deleteTable(+req.params.id);
  return res.status(200).send("Table successfuly removed!");
});

export default tableRouter;
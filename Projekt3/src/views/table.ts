/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createTable, deleteTable, readAllTables, readTable, readTableByNumOfPlaces, updateTable } from "../services/tableService";
import { createTableValidation, deleteTableByIDValidation, editTableByIDValidation, getTableByIDValidation } from "../validation/tableValidation";

/* SETUP */

const tableRouter = express.Router();

/* POST */

// POST register new table
tableRouter.post("", async function (req: Request, res: Response) {
  createTableValidation(req.body);

  return res.status(201).send(await createTable(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered tables with specific number of place settings
tableRouter.get("/find/:numPlaces", async function (req: Request, res: Response) {
  return res.status(200).send(await readTableByNumOfPlaces(+req.params.numPlaces));
});

// GET registered tables
tableRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send(await readAllTables());
});

// GET registered table by id
tableRouter.get("/:id", async function (req: Request, res: Response) {
  getTableByIDValidation(+req.params.id);
  
  return res.status(200).send("Table: " + await readTable(+req.params.id));
});

/* PUT */

// EDIT registered tables by id
tableRouter.put("/:id", async function (req: Request, res: Response) {
    editTableByIDValidation(req.body, +req.params.id);

    return res.status(200).send(await updateTable(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered table by id
tableRouter.delete("/:id", async function (req: Request, res: Response) {
  deleteTableByIDValidation(+req.params.id);
  
  return res.status(200).send(await deleteTable(+req.params.id));
});

export default tableRouter;
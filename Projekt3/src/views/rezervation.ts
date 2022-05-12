/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createRezervation, deleteRezervation, readAllRezervations, readRezervation, updateRezervation } from "../services/rezervationService";

/* SETUP */

const rezervationRouter = express.Router();

/* POST */

// POST register new rezervation
rezervationRouter.post("/register", async function (req: Request, res: Response) {
  if (!req.body) {
    return res.status(400).send("To register a new rezervation you need to send it's: table, start time, end time and client!");
  }
  if (!req.body.table) {
    return res.status(400).send("Table is missing!");
  }
  if (!req.body.start) {
    return res.status(400).send("Start time is missing!");
  }
  if (!req.body.end) {
    return res.status(400).send("End time is missing!");
  }
  if (!req.body.client) {
    return res.status(400).send("Client data is missing!");
  }

  return res.status(201).send("New rezervation registration succeded! It's ID: " + await createRezervation(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered rezervations
rezervationRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send("List of rezervations: \n" + await readAllRezervations());
});

// GET registered rezervation by id
rezervationRouter.get("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send("Reservation: " + await readRezervation(+req.params.id));
});

/* PUT */

// EDIT registered rezervation by id
rezervationRouter.put("/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    return res.status(400).send("You need to send new data to update existing rezervation!");
  }
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send("Rezervation before and after edit: " + await updateRezervation(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered rezervation by id
rezervationRouter.delete("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  await deleteRezervation(+req.params.id);
  return res.status(201).send("Rezervation successfuly removed!");
});

export default rezervationRouter;
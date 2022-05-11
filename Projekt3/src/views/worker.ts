/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createWorker, readAllWorkers, readWorker, updateWorker } from "../services/workerService";

/* SETUP */

const workerRouter = express.Router();

/* POST */

// POST register new worker
workerRouter.post("/register", async function (req: Request, res: Response) {
  if (!req.body) {
    return res.status(400).send("To register a new worker you need to send it's: name, surname and occupation!");
  }
  if (!req.body.name) {
    return res.status(400).send("Name is missing!");
  }
  if (!req.body.surname) {
    return res.status(400).send("Surname is missing!");
  }
  if (!req.body.occupation) {
    return res.status(400).send("Occupation is missing!");
  }

  return res.status(201).send("New worker registration succeded! It's ID: " + await createWorker(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered workers
workerRouter.get("/workers", async function (req: Request, res: Response) {
  return res.status(201).send("List of workers: \n" + await readAllWorkers());
});

// GET registered worker by id
workerRouter.get("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send("Worker: " + await readWorker(+req.params.id));
});

/* PUT */

// EDIT registered worker by id
workerRouter.put("/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    return res.status(400).send("You need to send new data to update existing worker!");
  }
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }

  return res.status(200).send("Worker before and after edit: \n" + await updateWorker(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered worker by id
workerRouter.delete("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send("Worker successfuly removed!");
});

export default workerRouter;
/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createWorker, deleteWorker, readAllWorkers, readWorker, updateWorker } from "../services/workerService";
import { createWorkerValidation, deleteWorkerByIDValidation, editWorkerByIDValidation, getWorkerByIDValidation } from "../validation/workerValidation";

/* SETUP */

const workerRouter = express.Router();

/* POST */

// POST register new worker
workerRouter.post("", async function (req: Request, res: Response) {
  createWorkerValidation(req.body);

  return res.status(201).send(await createWorker(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered workers
workerRouter.get("", async function (req: Request, res: Response) {
  return res.status(201).send(await readAllWorkers());
});

// GET registered worker by id
workerRouter.get("/:id", async function (req: Request, res: Response) {
  getWorkerByIDValidation(+req.params.id);
  
  return res.status(200).send(await readWorker(+req.params.id));
});

/* PUT */

// EDIT registered worker by id
workerRouter.put("/:id", async function (req: Request, res: Response) {
  editWorkerByIDValidation(req.body, +req.params.id);

  return res.status(200).send(await updateWorker(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered worker by id
workerRouter.delete("/:id", async function (req: Request, res: Response) {
  deleteWorkerByIDValidation(+req.params.id);
  
  return res.status(200).send(await deleteWorker(+req.params.id));
});

export default workerRouter;
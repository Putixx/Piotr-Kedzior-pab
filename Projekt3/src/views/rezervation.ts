/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createRezervation, deleteRezervation, readAllRezervations, readRezervation, updateRezervation } from "../services/rezervationService";
import { createRezervationValidation, deleteRezervationByIDValidation, editRezervationByIDValidation, getRezervationByIDValidation } from "../validation/rezervationValidation";

/* SETUP */

const rezervationRouter = express.Router();

/* POST */

// POST register new rezervation
rezervationRouter.post("", async function (req: Request, res: Response) {
  createRezervationValidation(req.body);

  return res.status(201).send(await createRezervation(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered rezervations
rezervationRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send(await readAllRezervations());
});

// GET registered rezervation by id
rezervationRouter.get("/:id", async function (req: Request, res: Response) {
  getRezervationByIDValidation(+req.params.id);
  
  return res.status(200).send(await readRezervation(+req.params.id));
});

/* PUT */

// EDIT registered rezervation by id
rezervationRouter.put("/:id", async function (req: Request, res: Response) {
  editRezervationByIDValidation(req.body, +req.params.id);
  
  return res.status(200).send(await updateRezervation(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered rezervation by id
rezervationRouter.delete("/:id", async function (req: Request, res: Response) {
  deleteRezervationByIDValidation(+req.params.id);
  
  return res.status(201).send(await deleteRezervation(+req.params.id));
});

export default rezervationRouter;
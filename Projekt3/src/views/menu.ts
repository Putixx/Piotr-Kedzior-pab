/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createMeal, deleteMeal, readMeal, readMenu, updateMeal } from "../services/menuService";
import { createMealValidation, deleteMealByIDValidation, editMealByIDValidation, getMealByIDValidation } from "../validation/menuValidation";

/* SETUP */

const menuRouter = express.Router();

/* POST */

// POST register new meal
menuRouter.post("", async function (req: Request, res: Response) {
  createMealValidation(req.body);

  return res.status(201).send(await createMeal(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered meals
menuRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send(await readMenu());
});

// GET registered meal by id
menuRouter.get("/:id", async function (req: Request, res: Response) {
  getMealByIDValidation(+req.params.id);

  return res.status(200).send(await readMeal(+req.params.id));
});

/* PUT */

// EDIT registered meal by id
menuRouter.put("/:id", async function (req: Request, res: Response) {
  editMealByIDValidation(req.body, +req.params.id);

  return res.status(200).send(await updateMeal(+req.params.id, JSON.parse(JSON.stringify(req.body))));
});

/* DELETE */

// DELETE registered meal by id
menuRouter.delete("/:id", async function (req: Request, res: Response) {
  deleteMealByIDValidation(+req.params.id);

  return res.status(200).send(await deleteMeal(+req.params.id));
});

export default menuRouter;
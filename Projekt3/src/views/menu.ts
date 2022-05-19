/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createMeal, deleteMeal, readMeal, readMenu, updateMeal } from "../services/menuService";
import { createMealValidation } from "../validation/menuValidation";

/* SETUP */

const menuRouter = express.Router();

/* POST */

// POST register new meal
menuRouter.post("", async function (req: Request, res: Response) {
  return res.status(201).send(createMealValidation(req.body) + await createMeal(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered meals
menuRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send(await readMenu());
});

// GET registered meal by id
menuRouter.get("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send(await readMeal(+req.params.id));
});

/* PUT */

// EDIT registered meal by id
menuRouter.put("/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    return res.status(400).send("You need to send new data to update existing meal!");
  }
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send(await updateMeal(+req.params.id, JSON.parse(JSON.stringify(req.body))));
});

/* DELETE */

// DELETE registered meal by id
menuRouter.delete("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  await deleteMeal(+req.params.id);
  return res.status(200).send("Meal successfuly removed!");
});

export default menuRouter;
/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createMeal, deleteMeal, readMeal, readMenu, updateMeal } from "../services/menuService";

/* SETUP */

const menuRouter = express.Router();

/* POST */

// POST register new meal
menuRouter.post("/register", async function (req: Request, res: Response) {
  if (!req.body) {
    return res.status(400).send("To register a new meal you need to send it's: name, price, and category!");
  }
  if (!req.body.name) {
    return res.status(400).send("Name is missing!");
  }
  if (!req.body.price) {
    return res.status(400).send("Price time is missing!");
  }
  if (!req.body.category) {
    return res.status(400).send("Category is missing!");
  }

  return res.status(201).send("New meal registration succeded! It's ID: " + await createMeal(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered meals
menuRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send("Menu: \n" + await readMenu());
});

// GET registered meal by id
menuRouter.get("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send("Menu: " + await readMeal(+req.params.id));
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
  
  return res.status(200).send("Meal before and after edit: " + await updateMeal(+req.params.id, JSON.parse(JSON.stringify(req.body))));
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
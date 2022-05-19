/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createRestaurant, deleteRestaurant, readAllRestaurants, readRestaurant, readRestaurantsByName, updateRestaurant } from "../services/restaurantService";
import { createRestaurantValidation, deleteRestaurantByIDValidation, editRestaurantByIDValidation, getRestaurantByIDValidation, getRestaurantByNameValidation } from "../validation/restaurantValidation";

/* SETUP */

const restaurantRouter = express.Router();

/* POST */

// POST register new restaurant
restaurantRouter.post("", async function (req: Request, res: Response) {
  createRestaurantValidation(req.body);
  
  return res.status(201).send(await createRestaurant(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered restaurants with same name
restaurantRouter.get("/name/:name", async function (req: Request, res: Response) {
  getRestaurantByNameValidation(req.params.name);

  return res.status(200).send(await readRestaurantsByName(req.params.name));
});

// GET registered restaurant by id
restaurantRouter.get("/:id", async function (req: Request, res: Response) {
  getRestaurantByIDValidation(+req.params.id);

  return res.status(200).send(await readRestaurant(+req.params.id));
});

// GET registered restaurants
restaurantRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send(await readAllRestaurants());
});

/* PUT */

// EDIT registered restaurant by id
restaurantRouter.put("/:id", async function (req: Request, res: Response) {
  editRestaurantByIDValidation(req.body, +req.params.id);
  
  return res.status(200).send(await updateRestaurant(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered restaurant by id
restaurantRouter.delete("/:id", async function (req: Request, res: Response) {
  deleteRestaurantByIDValidation(+req.params.id);
  
  return res.status(200).send(await deleteRestaurant(+req.params.id));
});

export default restaurantRouter;
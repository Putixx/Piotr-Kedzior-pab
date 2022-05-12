/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createRestaurant, deleteRestaurant, readAllRestaurants, readRestaurant, readRestaurantsByName, updateRestaurant } from "../services/restaurantService";

/* SETUP */

const restaurantRouter = express.Router();

/* POST */

// POST register new restaurant
restaurantRouter.post("/register", async function (req: Request, res: Response) {
  if (!req.body) {
    return res.status(400).send("To register a new restaurant you need to send it's: name, address, phone, nip, email and www!");
  }
  if (!req.body.name) {
    return res.status(400).send("Name is missing!");
  }
  if (!req.body.address) {
    return res.status(400).send("Address is missing!");
  }
  if (!req.body.phone) {
    return res.status(400).send("Phone number is missing!");
  }
  if (!req.body.nip) {
    return res.status(400).send("NIP number is missing!");
  }
  if (!req.body.email) {
    return res.status(400).send("E-mail is missing!");
  }
  if (!req.body.www) {
    return res.status(400).send("Website url is missing!");
  }
  
  return res.status(201).send("New restaurant registration succeded! It's ID: " + await createRestaurant(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered restaurants with same name
restaurantRouter.get("/name/:name", async function (req: Request, res: Response) {
  if (!req.params.name) {
    return res.status(400).send("You need to send restaurant name!");
  }

  return res.status(200).send("Restaurants with same name: \n" + await readRestaurantsByName(req.params.name));
});

// GET registered restaurant by id
restaurantRouter.get("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send restaurant ID!");
  }

  return res.status(200).send("Restaurant: \n" + await readRestaurant(+req.params.id));
});

// GET registered restaurants
restaurantRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send("Restaurant list: \n" + await readAllRestaurants());
});

/* PUT */

// EDIT registered restaurant by id
restaurantRouter.put("/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    return res.status(400).send("You need to send new data to update existing restaurant!");
  }
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send("Restaurant before and after edit: \n" + await updateRestaurant(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered restaurant by id
restaurantRouter.delete("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  await deleteRestaurant(+req.params.id);
  return res.status(200).send("Restaurant successfuly removed!");
});

export default restaurantRouter;
/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { Restaurant } from "../models/Restaurant";
import { readStorage, updateStorage } from "../services/storageService";

/* SETUP */

const app = express();
app.use(express.json());

/* POST */

// POST register new restaurant
app.post("/register", async function (req: Request, res: Response) {
  if (!req.body) {
    res.status(401).send("To register a new restaurant you need to send it's: name, address, phone, nip, email and www!");
  }
  if (!req.body.name) {
    res.status(401).send("Name is missing!");
  }
  if (!req.body.address) {
    res.status(401).send("Address is missing!");
  }
  if (!req.body.phone) {
    res.status(401).send("Phone number is missing!");
  }
  if (!req.body.nip) {
    res.status(401).send("NIP number is missing!");
  }
  if (!req.body.email) {
    res.status(401).send("E-mail is missing!");
  }
  if (!req.body.www) {
    res.status(401).send("Website url is missing!");
  }
  const data = JSON.parse(JSON.stringify(req.body));

  const newRestaurant = {
    id: Date.now(),
    name: data.name,
    address: data.address,
    phone: data.phone,
    nip: data.nip,
    email: data.email,
    www: data.www
  };

  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.find(r => r.address === newRestaurant.address)) {
    res.status(400).send("Current address is already taken!");
  }

  savedRestaurants.push(newRestaurant);
  await updateStorage('../data/restaurants.json', JSON.stringify(savedRestaurants));

  res.status(200).send("New restaurant registration succeded! It's ID: " + newRestaurant.id);
});

/* GET */

// GET registered restaurant
app.get("/restaurant/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }


  res.status(201).send("Restaurant data: ");
});

app.listen(3000);





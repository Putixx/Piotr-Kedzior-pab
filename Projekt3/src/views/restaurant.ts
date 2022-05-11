/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { Restaurant } from "../models/Restaurant";
import { readStorage, updateStorage } from "../services/storageService";

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
  
  const newRestaurant: Restaurant = new Restaurant(JSON.parse(JSON.stringify(req.body))); 
  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.find(r => r.address === newRestaurant.address)) {
    return res.status(400).send("Current address is already taken!");
  }

  savedRestaurants.push(newRestaurant);
  await updateStorage('../data/restaurants.json', JSON.stringify(savedRestaurants));

  return res.status(200).send("New restaurant registration succeded! It's ID: " + newRestaurant.id);
});

/* GET */

// GET registered restaurants with same name
restaurantRouter.get("/:name", async function (req: Request, res: Response) {
  if (!req.params.name) {
    return res.status(400).send("You need to send restaurant name!");
  }

  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    return res.status(400).send("There are no such restaurants!");
  }

  const specificRestaurants = savedRestaurants.filter(r => r.name === req.params.name)

  if(!specificRestaurants) {
    return res.status(400).send("There are no such restaurants!");
  }

  let print = "";

  for(let i = 0; i < specificRestaurants.length; i++) {
    print += "ID: " + specificRestaurants[i].id + " Name: " + specificRestaurants[i].name + " Address: " + specificRestaurants[i].address 
    + " Phone: " + specificRestaurants[i].phone  + " NIP: " + specificRestaurants[i].nip + " E-mail: " + specificRestaurants[i].email 
    + " Website: " + specificRestaurants[i].www + "\n";
  }

  return res.status(201).send("Restaurants with same name: \n" + print);
});

// GET registered restaurant by id
restaurantRouter.get("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send restaurant ID!");
  }

  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    return res.status(400).send("There is no such restaurant!");
  }

  const specificRestaurant = savedRestaurants.find(r => r.id === +req.params.id)

  if(specificRestaurant) {
    const print = "ID: " + specificRestaurant.id + " Name: " + specificRestaurant.name + " Address: " + specificRestaurant.address 
    + " Phone: " + specificRestaurant.phone  + " NIP: " + specificRestaurant.nip + " E-mail: " + specificRestaurant.email 
    + " Website: " + specificRestaurant.www + "\n";
  
    return res.status(200).send("Restaurant: \n" + print);
  }
  else {
    return res.status(400).send("There is no such restaurant!");
  }
});

// GET registered restaurants
restaurantRouter.get("/restaurants", async function (req: Request, res: Response) {
  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    return res.status(400).send("There are no restaurants!");
  }

  let print = "";

  for(let i = 0; i < savedRestaurants.length; i++) {
    print += "ID: " + savedRestaurants[i].id + " Name: " + savedRestaurants[i].name + " Address: " + savedRestaurants[i].address 
    + " Phone: " + savedRestaurants[i].phone  + " NIP: " + savedRestaurants[i].nip + " E-mail: " + savedRestaurants[i].email 
    + " Website: " + savedRestaurants[i].www + "\n";
  }

  return res.status(200).send("Restaurant list: \n" + print);
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
  
  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    return res.status(400).send("There are no restaurants!");
  }

  const restaurantIndex = savedRestaurants.findIndex(r => r.id === +req.params.id)

  if(restaurantIndex === -1) {
    return res.status(400).send("Wrong ID!");
  }

  const data = JSON.parse(JSON.stringify(req.body));
  const tempRestaurant = savedRestaurants[restaurantIndex];

  if(data.name) {
    savedRestaurants[restaurantIndex].name = data.name;
  }
  if(data.address) {
    savedRestaurants[restaurantIndex].address = data.address;
  }
  if(data.phone) {
    savedRestaurants[restaurantIndex].phone = data.phone;
  }
  if(data.nip) {
    savedRestaurants[restaurantIndex].nip = data.nip;
  }
  if(data.email) {
    savedRestaurants[restaurantIndex].email = data.email;
  }
  if(data.www) {
    savedRestaurants[restaurantIndex].www = data.www;
  }

  const printOld = "ID: " + tempRestaurant.id + " Name: " + tempRestaurant.name + " Address: " + tempRestaurant.address 
  + " Phone: " + tempRestaurant.phone + " NIP: " + tempRestaurant.nip + " E-mail: " + tempRestaurant.email + " Website: " + tempRestaurant.www + "\n";

  const printNew = "ID: " + savedRestaurants[restaurantIndex].id + " Name: " + savedRestaurants[restaurantIndex].name 
  + " Address: " + savedRestaurants[restaurantIndex].address + " Phone: " + savedRestaurants[restaurantIndex].phone 
  + " NIP: " + savedRestaurants[restaurantIndex].nip + " E-mail: " + savedRestaurants[restaurantIndex].email + " Website: " + savedRestaurants[restaurantIndex].www + "\n";

  await updateStorage('../data/restaurants.json', JSON.stringify(savedRestaurants));
  return res.status(201).send("Restaurant before edit: " + printOld + " Restaurant after edit: " + printNew);
});

/* DELETE */

// DELETE registered restaurant by id
restaurantRouter.delete("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    return res.status(400).send("There are no restaurants!");
  }

  const restaurantIndex = savedRestaurants.findIndex(r => r.id === +req.params.id)

  if(restaurantIndex === -1) {
    return res.status(400).send("Wrong ID!");
  }

  savedRestaurants.splice(restaurantIndex, 1);
  await updateStorage('../data/restaurants.json', JSON.stringify(savedRestaurants));
  return res.status(201).send("Restaurant successfuly removed!");
});

export default restaurantRouter;
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
app.post("/register/restaurant", async function (req: Request, res: Response) {
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

// GET registered restaurants with same name
app.get("/restaurant/:name", async function (req: Request, res: Response) {
  if (!req.params.name) {
    res.status(400).send("You need to send restaurant name!");
  }

  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    res.status(400).send("There is no such restaurant!");
  }

  const specificRestaurants = savedRestaurants.filter(r => r.name === req.params.name)

  if(!specificRestaurants) {
    res.status(400).send("There is no such restaurant!");
  }

  let print = "";

  for(let i = 0; i < specificRestaurants.length; i++) {
    print += "ID: " + specificRestaurants[i].id + " Name: " + specificRestaurants[i].name + " Address: " + specificRestaurants[i].address 
    + " Phone: " + specificRestaurants[i].phone  + " NIP: " + specificRestaurants[i].nip + " E-mail: " + specificRestaurants[i].email 
    + " Website: " + specificRestaurants[i].www + "\n";
  }

  res.status(201).send("Restaurants with same name: \n" + print);
});

// GET registered restaurant by id
app.get("/restaurant/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send restaurant ID!");
  }

  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    res.status(400).send("There is no such restaurant!");
  }

  const specificRestaurant = savedRestaurants.find(r => r.id === +req.params.id)

  if(specificRestaurant) {
    const print = "ID: " + specificRestaurant.id + " Name: " + specificRestaurant.name + " Address: " + specificRestaurant.address 
    + " Phone: " + specificRestaurant.phone  + " NIP: " + specificRestaurant.nip + " E-mail: " + specificRestaurant.email 
    + " Website: " + specificRestaurant.www + "\n";
  
    res.status(201).send("Restaurant: \n" + print);
  }
  else {
    res.status(400).send("There is no such restaurant!");
  }
});

// GET registered restaurants
app.get("/restaurants", async function (req: Request, res: Response) {
  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    res.status(400).send("There is no restaurants!");
  }

  let print = "";

  for(let i = 0; i < savedRestaurants.length; i++) {
    print += "ID: " + savedRestaurants[i].id + " Name: " + savedRestaurants[i].name + " Address: " + savedRestaurants[i].address 
    + " Phone: " + savedRestaurants[i].phone  + " NIP: " + savedRestaurants[i].nip + " E-mail: " + savedRestaurants[i].email 
    + " Website: " + savedRestaurants[i].www + "\n";
  }

  res.status(201).send("Restaurants list: \n" + print);
});

/* PUT */

// EDIT registered restaurant by id
app.put("/restaurant/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    res.status(400).send("You need to send new data to update existing restaurant!");
  }
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    res.status(400).send("There is no restaurants!");
  }

  const restaurantIndex = savedRestaurants.findIndex(r => r.id === +req.params.name)

  if(restaurantIndex === -1) {
    res.status(400).send("Wrong ID!");
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
  res.status(201).send("Restaurant before edit: " + printOld + " Restaurant after edit: " + printNew);
});

/* DELETE */

// DELETE registered restaurant by id
app.delete("/restaurant/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('../data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    res.status(400).send("There is no restaurants!");
  }

  const restaurantIndex = savedRestaurants.findIndex(r => r.id === +req.params.name)

  if(restaurantIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  savedRestaurants.splice(restaurantIndex, 1);
  await updateStorage('../data/restaurants.json', JSON.stringify(savedRestaurants));
  res.status(201).send("Restaurant successfuly removed!");
});

app.listen(3000);
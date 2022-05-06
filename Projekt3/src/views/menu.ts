/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { Meal } from "../models/Meal";
import { readStorage, updateStorage } from "../services/storageService";

/* SETUP */

const app = express();
app.use(express.json());

/* POST */

// POST register new meal
app.post("/register/meal", async function (req: Request, res: Response) {
  if (!req.body) {
    res.status(400).send("To register a new meal you need to send it's: name, price, and category!");
  }
  if (!req.body.name) {
    res.status(400).send("Name is missing!");
  }
  if (!req.body.price) {
    res.status(400).send("Price time is missing!");
  }
  if (!req.body.category) {
    res.status(400).send("Category is missing!");
  }

  const data = JSON.parse(JSON.stringify(req.body));


  const newMeal = {
    id: Date.now(),
    name: data.name,
    price: data.price,
    category: data.category
  };

  const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

  if(savedMeals.find(m => m.name === newMeal.name &&  m.price === newMeal.price &&  m.category === newMeal.category)) {
    res.status(400).send("Current meal is already registered!");
  }

  savedMeals.push(newMeal);
  await updateStorage('./data/menu.json', JSON.stringify(savedMeals));

  res.status(200).send("New meal registration succeded! It's ID: " + newMeal.id);
});

/* GET */

// GET registered meals
app.get("/menu", async function (req: Request, res: Response) {
  const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

  if(savedMeals.length < 1) {
    res.status(400).send("There is no meals in menu!");
  }

  let print = "";

  for(let i = 0; i < savedMeals.length; i++) {
    print += "ID: " + savedMeals[i].id + " Name: " + savedMeals[i].name + " Price: " + savedMeals[i].price 
    + " Category: " + savedMeals[i].category + "\n";
  }

  res.status(201).send("Menu: \n" + print);
});

// GET registered meal by id
app.get("/menu/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

  if(savedMeals.length < 1) {
    res.status(400).send("There is no meals in menu!");
  }

  const mealIndex = savedMeals.findIndex(m => m.id === +req.params.id)

  if(mealIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const print = "ID: " + savedMeals[mealIndex].id + " Name: " + savedMeals[mealIndex].name + " Price: " + savedMeals[mealIndex].price 
  + " Category: " + savedMeals[mealIndex].category + "\n";

  res.status(201).send("Menu: " + print);
});

/* PUT */

// EDIT registered meal by id
app.put("/menu/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    res.status(400).send("You need to send new data to update existing meal!");
  }
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

  if(savedMeals.length < 1) {
    res.status(400).send("There is no meals in menu!");
  }

  const mealIndex = savedMeals.findIndex(r => r.id === +req.params.id)

  if(mealIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const data = JSON.parse(JSON.stringify(req.body));
  const printOld = "ID: " + savedMeals[mealIndex].id + " Name: " + savedMeals[mealIndex].name + " Price: " + savedMeals[mealIndex].price 
  + " Category: " + savedMeals[mealIndex].category + "\n";

  if(data.name) {
    savedMeals[mealIndex].name = data.name;
  }
  if(data.price) {
    savedMeals[mealIndex].price = data.price;
  }
  if(data.category) {
    savedMeals[mealIndex].category = data.category;
  }
  
  const printNew = "ID: " + savedMeals[mealIndex].id + " Name: " + savedMeals[mealIndex].name + " Price: " + savedMeals[mealIndex].price 
  + " Category: " + savedMeals[mealIndex].category + "\n";

  await updateStorage('./data/menu.json', JSON.stringify(savedMeals));
  res.status(201).send("Meal before edit: " + printOld + " Meal after edit: " + printNew);
});

/* DELETE */

// DELETE registered meal by id
app.delete("/menu/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

  if(savedMeals.length < 1) {
    res.status(400).send("There is no meals in menu!");
  }

  const mealIndex = savedMeals.findIndex(m => m.id === +req.params.id)

  if(mealIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  savedMeals.splice(mealIndex, 1);
  await updateStorage('./data/menu.json', JSON.stringify(savedMeals));
  res.status(201).send("Meal successfuly removed!");
});

app.listen(3000);
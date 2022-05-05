/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { Order } from "../models/Order";
import { readStorage, updateStorage } from "../services/storageService";

/* SETUP */

const app = express();
app.use(express.json());

/* POST */

// POST register new order
app.post("/register/order", async function (req: Request, res: Response) {
  if (!req.body) {
    res.status(401).send("To register a new order you need to send it's: worker, meals, status, table and price!");
  }
  if (!req.body.worker) {
    res.status(401).send("Worker is missing!");
  }
  if (!req.body.meals) {
    res.status(401).send("Meals are missing!");
  }
  if (!req.body.status) {
    res.status(401).send("Status is missing!");
  }
  if (!req.body.table) {
    res.status(401).send("Table is missing!");
  }
  if (!req.body.price) {
    res.status(401).send("Price is missing!");
  }

  const data = JSON.parse(JSON.stringify(req.body));

  const newOrder = {
    id: Date.now(),
    worker: data.worker,
    meals: data.meals,
    status: data.status,
    table: data.table,
    price: data.price
  };

  const savedOrders: Order[] = JSON.parse(await readStorage('../data/orders.json')) ?? [];

  if(savedOrders.find(o => o.worker === newOrder.worker &&  o.meals === newOrder.meals &&  o.table === newOrder.table && o.price === newOrder.price)) {
    res.status(400).send("Current order is already registered!");
  }

  savedOrders.push(newOrder);
  await updateStorage('../data/orders.json', JSON.stringify(savedOrders));

  res.status(200).send("New order registration succeded! It's ID: " + newOrder.id);
});

/* GET */

// GET registered orders
app.get("/orders", async function (req: Request, res: Response) {
  const savedOrders: Order[] = JSON.parse(await readStorage('../data/orders.json')) ?? [];

  if(savedOrders.length < 1) {
    res.status(400).send("There is no orders!");
  }

  let print = "";

  for(let i = 0; i < savedOrders.length; i++) {
    print += "ID: " + savedOrders[i].id + " Worker: " + savedOrders[i].worker + " Meals: " + savedOrders[i].meals 
    + " Status: " + savedOrders[i].status + " Table: " + savedOrders[i].table + " Price: " + savedOrders[i].price + "\n";
  }

  res.status(201).send("List of orders: \n" + print);
});

// GET registered order by id
app.get("/order/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedOrders: Order[] = JSON.parse(await readStorage('../data/orders.json')) ?? [];

  if(savedOrders.length < 1) {
    res.status(400).send("There is no orders!");
  }

  const orderIndex = savedOrders.findIndex(o => o.id === +req.params.id)

  if(orderIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const print = "ID: " + savedOrders[orderIndex].id + " Worker: " + savedOrders[orderIndex].worker + " Meals: " + savedOrders[orderIndex].meals 
  + " Status: " + savedOrders[orderIndex].status + " Table: " + savedOrders[orderIndex].table + " Price: " + savedOrders[orderIndex].price + "\n";

  res.status(201).send("Order: " + print);
});

/* PUT */

// EDIT registered order by id
app.put("/order/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    res.status(400).send("You need to send new data to update existing order!");
  }
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedOrders: Order[] = JSON.parse(await readStorage('../data/orders.json')) ?? [];

  if(savedOrders.length < 1) {
    res.status(400).send("There is no orders!");
  }

  const orderIndex = savedOrders.findIndex(o => o.id === +req.params.id)

  if(orderIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const data = JSON.parse(JSON.stringify(req.body));
  const tempTable = savedOrders[orderIndex];

  if(data.worker) {
    savedOrders[orderIndex].worker = data.worker;
  }
  if(data.meals) {
    savedOrders[orderIndex].meals = data.meals;
  }
  if(data.status) {
    savedOrders[orderIndex].status = data.status;
  }
  if(data.table) {
    savedOrders[orderIndex].table = data.table;
  }
  if(data.price) {
    savedOrders[orderIndex].price = data.price;
  }
  
  const printOld = "ID: " + tempTable.id + " Worker: " + tempTable.worker + " Meals: " + tempTable.meals 
  + " Status: " + tempTable.status + " Table: " + tempTable.table + " Price: " + tempTable.price + "\n";

  const printNew = "ID: " + savedOrders[orderIndex].id + " Worker: " + savedOrders[orderIndex].worker + " Meals: " + savedOrders[orderIndex].meals 
  + " Status: " + savedOrders[orderIndex].status + " Table: " + savedOrders[orderIndex].table + " Price: " + savedOrders[orderIndex].price + "\n";

  await updateStorage('../data/orders.json', JSON.stringify(savedOrders));
  res.status(201).send("Order before edit: " + printOld + " Order after edit: " + printNew);
});

/* DELETE */

// DELETE registered order by id
app.delete("/order/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedOrders: Order[] = JSON.parse(await readStorage('../data/orders.json')) ?? [];

  if(savedOrders.length < 1) {
    res.status(400).send("There is no orders!");
  }

  const orderIndex = savedOrders.findIndex(o => o.id === +req.params.id)

  if(orderIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  savedOrders.splice(orderIndex, 1);
  await updateStorage('../data/orders.json', JSON.stringify(savedOrders));
  res.status(201).send("Order successfuly removed!");
});

app.listen(3000);
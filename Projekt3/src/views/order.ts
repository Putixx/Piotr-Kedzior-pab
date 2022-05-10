/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { Order } from "../models/Order";
import { readStorage, updateStorage } from "../services/storageService";

/* SETUP */

const orderRouter = express.Router();

/* POST */

// POST register new order
orderRouter.post("/register/order", async function (req: Request, res: Response) {
  if (!req.body) {
    res.status(400).send("To register a new order you need to send it's: worker, meals, status, table and price!");
  }
  if (!req.body.worker) {
    res.status(400).send("Worker is missing!");
  }
  if (!req.body.meals) {
    res.status(400).send("Meals are missing!");
  }
  if (!req.body.status) {
    res.status(400).send("Status is missing!");
  }
  if (!req.body.table) {
    res.status(400).send("Table is missing!");
  }
  if(req.body.status === 'ordered' || req.body.status === 'inprogress' || req.body.status === 'realized' || req.body.status === 'bill') {
    const data = JSON.parse(JSON.stringify(req.body));
    let orderPrice = 0;

    for(let i = 0; i < data.meals.length; i++) {
        orderPrice += parseFloat(data.meals[i].price);
    }

    const newOrder = {
        id: Date.now(),
        worker: data.worker,
        meals: data.meals,
        status: data.status,
        table: data.table,
        price: data.price ?? orderPrice
    };

    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

    if(savedOrders.find(o => o.worker === newOrder.worker &&  o.meals === newOrder.meals &&  o.table === newOrder.table && o.price === newOrder.price)) {
        res.status(400).send("Current order is already registered!");
    }

    savedOrders.push(newOrder);
    await updateStorage('./data/orders.json', JSON.stringify(savedOrders));

    res.status(200).send("New order registration succeded! It's ID: " + newOrder.id);
    }
    else {
        res.status(400).send("Statuses available: ordered, inprogress, realized, bill!");
    }
});

/* GET */

// GET registered orders
orderRouter.get("/orders", async function (req: Request, res: Response) {
  const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

  if(savedOrders.length < 1) {
    res.status(400).send("There is no orders!");
  }

  let print = "";
  let meals = "";

  for(let i = 0; i < savedOrders.length; i++) {
    for(let j = 0; j < savedOrders[i].meals.length; j++) {
      meals += " Meal name: " + savedOrders[i].meals[j].name + " Meal price: " + savedOrders[i].meals[j].price + " Meal category: " + savedOrders[i].meals[j].category + " ";
    }

    print += "ID: " + savedOrders[i].id + " Worker name: " + savedOrders[i].worker.name + " Worker surname: " + savedOrders[i].worker.surname 
    + " Worker occupation: " + savedOrders[i].worker.occupation + meals + " Status: " + savedOrders[i].status + " Table name: " 
    + savedOrders[i].table.name + " Table number of place settings: " + savedOrders[i].table.numPlaces + " Table status: " 
    + savedOrders[i].table.status + " Price: " + savedOrders[i].price + "\n";
  }

  res.status(201).send("List of orders: \n" + print);
});

// GET registered order by id
orderRouter.get("/order/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

  if(savedOrders.length < 1) {
    res.status(400).send("There is no orders!");
  }

  const orderIndex = savedOrders.findIndex(o => o.id === +req.params.id)

  if(orderIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  let meals = "";

  for(let j = 0; j < savedOrders[orderIndex].meals.length; j++) {
    meals += " Meal name: " + savedOrders[orderIndex].meals[j].name + " Meal price: " + savedOrders[orderIndex].meals[j].price + " Meal category: " + savedOrders[orderIndex].meals[j].category + " ";
  }

  const print = "ID: " + savedOrders[orderIndex].id + " Worker name: " + savedOrders[orderIndex].worker.name + " Worker surname: " + savedOrders[orderIndex].worker.surname 
  + " Worker occupation: " + savedOrders[orderIndex].worker.occupation + meals + " Status: " + savedOrders[orderIndex].status + " Table name: " 
  + savedOrders[orderIndex].table.name + " Table number of place settings: " + savedOrders[orderIndex].table.numPlaces + " Table status: " 
  + savedOrders[orderIndex].table.status + " Price: " + savedOrders[orderIndex].price + "\n";

  res.status(201).send("Order: " + print);
});

// GET registered order by worker
orderRouter.get("/order/:name/:surname", async function (req: Request, res: Response) {
    if (!req.params.name) {
      res.status(400).send("You need to send worker's name!");
    }
    if (!req.params.surname) {
      res.status(400).send("You need to send worker's surname!");
    }
    
    const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];
  
    if(savedOrders.length < 1) {
      res.status(400).send("There is no orders!");
    }
  
    const specificOrders = savedOrders.filter(o => o.worker.name === req.params.name && o.worker.surname === req.params.surname)
  
    if(specificOrders) {
        let print = "";
        let meals = "";
      
        for(let i = 0; i < specificOrders.length; i++) {
          for(let j = 0; j < savedOrders[i].meals.length; j++) {
            meals += " Meal name: " + savedOrders[i].meals[j].name + " Meal price: " + savedOrders[i].meals[j].price + " Meal category: " + savedOrders[i].meals[j].category + " ";
          }
      
          print += "ID: " + savedOrders[i].id + " Worker name: " + savedOrders[i].worker.name + " Worker surname: " + savedOrders[i].worker.surname 
          + " Worker occupation: " + savedOrders[i].worker.occupation + meals + " Status: " + savedOrders[i].status + " Table name: " 
          + savedOrders[i].table.name + " Table number of place settings: " + savedOrders[i].table.numPlaces + " Table status: " 
          + savedOrders[i].table.status + " Price: " + savedOrders[i].price + "\n";
          }

        res.status(201).send("Orders: " + print);
    }
    else {
        res.status(400).send("There is no orders for this worker!");
    }
  });

/* PUT */

// EDIT registered order by id
orderRouter.put("/order/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    res.status(400).send("You need to send new data to update existing order!");
  }
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

  if(savedOrders.length < 1) {
    res.status(400).send("There is no orders!");
  }

  const orderIndex = savedOrders.findIndex(o => o.id === +req.params.id)

  if(orderIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const data = JSON.parse(JSON.stringify(req.body));
  let meals = "";

  for(let j = 0; j < savedOrders[orderIndex].meals.length; j++) {
    meals += " Meal name: " + savedOrders[orderIndex].meals[j].name + " Meal price: " + savedOrders[orderIndex].meals[j].price + " Meal category: " + savedOrders[orderIndex].meals[j].category + " ";
  }

  const printOld = "ID: " + savedOrders[orderIndex].id + " Worker name: " + savedOrders[orderIndex].worker.name + " Worker surname: " + savedOrders[orderIndex].worker.surname 
  + " Worker occupation: " + savedOrders[orderIndex].worker.occupation + meals + " Status: " + savedOrders[orderIndex].status + " Table name: " 
  + savedOrders[orderIndex].table.name + " Table number of place settings: " + savedOrders[orderIndex].table.numPlaces + " Table status: " 
  + savedOrders[orderIndex].table.status + " Price: " + savedOrders[orderIndex].price + "\n";

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

  for(let j = 0; j < savedOrders[orderIndex].meals.length; j++) {
    meals += " Meal name: " + savedOrders[orderIndex].meals[j].name + " Meal price: " + savedOrders[orderIndex].meals[j].price + " Meal category: " + savedOrders[orderIndex].meals[j].category + " ";
  }

  const printNew = "ID: " + savedOrders[orderIndex].id + " Worker name: " + savedOrders[orderIndex].worker.name + " Worker surname: " + savedOrders[orderIndex].worker.surname 
  + " Worker occupation: " + savedOrders[orderIndex].worker.occupation + meals + " Status: " + savedOrders[orderIndex].status + " Table name: " 
  + savedOrders[orderIndex].table.name + " Table number of place settings: " + savedOrders[orderIndex].table.numPlaces + " Table status: " 
  + savedOrders[orderIndex].table.status + " Price: " + savedOrders[orderIndex].price + "\n";

  await updateStorage('./data/orders.json', JSON.stringify(savedOrders));
  res.status(201).send("Order before edit: " + printOld + " Order after edit: " + printNew);
});

/* DELETE */

// DELETE registered order by id
orderRouter.delete("/order/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedOrders: Order[] = JSON.parse(await readStorage('./data/orders.json')) ?? [];

  if(savedOrders.length < 1) {
    res.status(400).send("There is no orders!");
  }

  const orderIndex = savedOrders.findIndex(o => o.id === +req.params.id)

  if(orderIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  savedOrders.splice(orderIndex, 1);
  await updateStorage('./data/orders.json', JSON.stringify(savedOrders));
  res.status(201).send("Order successfuly removed!");
});

export default orderRouter;
/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { Order } from "../models/Order";
import { Rezervation } from "../models/Rezervation";
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
  if(req.body.status === 'ordered' || req.body.status === 'inprogress' || req.body.status === 'realized' || req.body.status === 'bill') {
    const data = JSON.parse(JSON.stringify(req.body));
    let orderPrice = 0;

    for(let i = 0; i < data.meals; i++) {
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

    const savedOrders: Order[] = JSON.parse(await readStorage('../data/orders.json')) ?? [];

    if(savedOrders.find(o => o.worker === newOrder.worker &&  o.meals === newOrder.meals &&  o.table === newOrder.table && o.price === newOrder.price)) {
        res.status(400).send("Current order is already registered!");
    }

    savedOrders.push(newOrder);
    await updateStorage('../data/orders.json', JSON.stringify(savedOrders));

    res.status(200).send("New order registration succeded! It's ID: " + newOrder.id);
    }
    else {
        res.status(401).send("Statuses available: ordered, inprogress, realized, bill!");
    }
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

// GET registered order by worker
app.get("/order/:worker", async function (req: Request, res: Response) {
    if (!req.params.worker) {
      res.status(400).send("You need to send worker!");
    }
    
    const savedOrders: Order[] = JSON.parse(await readStorage('../data/orders.json')) ?? [];
  
    if(savedOrders.length < 1) {
      res.status(400).send("There is no orders!");
    }
  
    const specificOrders = savedOrders.filter(o => JSON.stringify(o.worker) === req.params.worker)
  
    if(specificOrders) {
        let print = "";
      
        for(let i = 0; i < specificOrders.length; i++) {
            print += "ID: " + specificOrders[i].id + " Worker: " + specificOrders[i].worker + " Meals: " + specificOrders[i].meals 
            + " Status: " + specificOrders[i].status + " Table: " + specificOrders[i].table + " Price: " + specificOrders[i].price + "\n";
          }

        res.status(201).send("Orders: " + print);
    }
    else {
        res.status(400).send("There is no orders for this worker!");
    }
  });

  // GET registered order in specific time
app.get("/order/:starttime/:endtime", async function (req: Request, res: Response) {
    if (!req.params.starttime) {
      res.status(400).send("First argument is start time and it's needed!");
    }
    if (!req.params.starttime) {
        res.status(400).send("Second argument is end time and it's needed!");
    }
    
    const savedOrders: Order[] = JSON.parse(await readStorage('../data/orders.json')) ?? [];
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('../data/rezervations.json')) ?? [];
  
    if(savedOrders.length < 1) {
      res.status(400).send("There is no orders!");
    }

    if(savedRezervations.length < 1) {
        res.status(400).send("There is no rezervations!");
    }
  
    const specificRezervations = savedRezervations.filter(r => r.start >= req.params.starttime && r.end <= req.params.starttime);

    if(specificRezervations) {
        let print = "";

        if(specificRezervations.length < savedOrders.length) {
            for(let i = 0; i < specificRezervations.length; i++) {
                if(specificRezervations[i].table === savedOrders[i].table) {
                    print += "ID: " + savedOrders[i].id + " Worker: " + savedOrders[i].worker + " Meals: " + savedOrders[i].meals 
                    + " Status: " + savedOrders[i].status + " Table: " + savedOrders[i].table + " Price: " + savedOrders[i].price + "\n";
                }
              }
    
            res.status(201).send("Orders: " + print);
        }
        
        if(savedOrders.length < specificRezervations.length) {
            for(let i = 0; i < savedOrders.length; i++) {
                if(specificRezervations[i].table === savedOrders[i].table) {
                    print += "ID: " + savedOrders[i].id + " Worker: " + savedOrders[i].worker + " Meals: " + savedOrders[i].meals 
                    + " Status: " + savedOrders[i].status + " Table: " + savedOrders[i].table + " Price: " + savedOrders[i].price + "\n";
                }
              }
    
            res.status(201).send("Orders: " + print);
        }
    }
    else {
        res.status(400).send("There are no orders between start time and end time!");
    }
  });

    // GET income from orders in specific time
app.get("/order/:starttime/:endtime", async function (req: Request, res: Response) {
    if (!req.params.starttime) {
      res.status(400).send("First argument is start time and it's needed!");
    }
    if (!req.params.starttime) {
        res.status(400).send("Second argument is end time and it's needed!");
    }
    
    const savedOrders: Order[] = JSON.parse(await readStorage('../data/orders.json')) ?? [];
    const savedRezervations: Rezervation[] = JSON.parse(await readStorage('../data/rezervations.json')) ?? [];
  
    if(savedOrders.length < 1) {
      res.status(400).send("There is no orders!");
    }

    if(savedRezervations.length < 1) {
        res.status(400).send("There is no rezervations!");
    }
  
    const specificRezervations = savedRezervations.filter(r => r.start >= req.params.starttime && r.end <= req.params.starttime);

    if(specificRezervations) {
        let print = 0;

        if(specificRezervations.length < savedOrders.length) {
            for(let i = 0; i < specificRezervations.length; i++) {
                if(specificRezervations[i].table === savedOrders[i].table) {
                    print += parseFloat(savedOrders[i].price);
                }
              }
    
            res.status(201).send("Orders in specified time income: " + print);
        }
        
        if(savedOrders.length < specificRezervations.length) {
            for(let i = 0; i < savedOrders.length; i++) {
                if(specificRezervations[i].table === savedOrders[i].table) {
                    print += parseFloat(savedOrders[i].price);
                }
              }
    
            res.status(201).send("Orders in specified time income: " + print);
        }
    }
    else {
        res.status(400).send("There are no orders between start time and end time!");
    }
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
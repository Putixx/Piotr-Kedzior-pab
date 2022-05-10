/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { Product } from "../models/Product";
import { readStorage, updateStorage } from "../services/storageService";

/* SETUP */

const warehouseRouter = express.Router();

/* POST */

// POST register new product
warehouseRouter.post("/register", async function (req: Request, res: Response) {
  if (!req.body) {
    res.status(401).send("To register a new product you need to send it's: name, price, quantity and unit of measure!");
  }
  if (!req.body.name) {
    res.status(401).send("Name is missing!");
  }
  if (!req.body.price) {
    res.status(401).send("Price is missing!");
  }
  if (!req.body.quantity) {
    res.status(401).send("Quantity is missing!");
  }
  if (!req.body.unitOfMeasure) {
    res.status(401).send("Unit of measure is missing!");
  }
  if(req.body.unitOfMeasure === 'g' || req.body.unitOfMeasure === 'dg' || req.body.unitOfMeasure === 'kg' || req.body.unitOfMeasure === 't') {
    const data = JSON.parse(JSON.stringify(req.body));

    const newProduct = {
        id: Date.now(),
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        unitOfMeasure: data.unitOfMeasure
    };

  const savedProducts: Product[] = JSON.parse(await readStorage('../data/products.json')) ?? [];

  if(savedProducts.find(p => p.name === newProduct.name && p.price === newProduct.price && p.quantity === newProduct.quantity && p.unitOfMeasure === newProduct.unitOfMeasure)) {
    res.status(400).send("Current product is already registered!");
  }

  savedProducts.push(newProduct);
  await updateStorage('../data/products.json', JSON.stringify(savedProducts));
  res.status(200).send("New Product registration succeded! It's ID: " + newProduct.id);
  }
  else {
    res.status(401).send("Units of measure available: g, dg, kg, t!");
  }
});

/* GET */

// GET registered products
warehouseRouter.get("/products", async function (req: Request, res: Response) {
  const savedProducts: Product[] = JSON.parse(await readStorage('../data/products.json')) ?? [];

  if(savedProducts.length < 1) {
    res.status(400).send("There is no products!");
  }

  let print = "";

  for(let i = 0; i < savedProducts.length; i++) {
    print += "ID: " + savedProducts[i].id + " Name: " + savedProducts[i].name + " Price: " + savedProducts[i].price 
    + " Quantity: " + savedProducts[i].quantity + " Unit of measure: " + savedProducts[i].unitOfMeasure + "\n";
  }

  res.status(201).send("List of products: \n" + print);
});

// GET registered products
warehouseRouter.get("/:sort", async function (req: Request, res: Response) {
    if(!req.params.sort) {
        res.status(400).send("Sort param needed! Possible: ID, name, price, quantity");
    }
    const savedProducts: Product[] = JSON.parse(await readStorage('../data/products.json')) ?? [];
  
    if(savedProducts.length < 1) {
      res.status(400).send("There is no products!");
    }
    let print = "";

    if(req.params.sort.toLocaleLowerCase() === 'id') {
        savedProducts.sort((p1, p2) => 
        {
            if(p1.id > p2.id) {
                return 1;
            }
            if(p1.id < p2.id) {
                return -1;
            }
            return 0;
        });
    }

    if(req.params.sort.toLocaleLowerCase() === 'name') {
        savedProducts.sort((p1, p2) => 
        {
            if(p1.name > p2.name) {
                return 1;
            }
            if(p1.name < p2.name) {
                return -1;
            }
            return 0;
        });
    }

    if(req.params.sort.toLocaleLowerCase() === 'price') {
        savedProducts.sort((p1, p2) => 
        {
            if(p1.price > p2.price) {
                return 1;
            }
            if(p1.price < p2.price) {
                return -1;
            }
            return 0;
        });
    }

    if(req.params.sort.toLocaleLowerCase() === 'quantity') {
        savedProducts.sort((p1, p2) => 
        {
            if(p1.quantity > p2.quantity) {
                return 1;
            }
            if(p1.quantity < p2.quantity) {
                return -1;
            }
            return 0;
        });
    }
    
  
    for(let i = 0; i < savedProducts.length; i++) {
      print += "ID: " + savedProducts[i].id + " Name: " + savedProducts[i].name + " Price: " + savedProducts[i].price 
      + " Quantity: " + savedProducts[i].quantity + " Unit of measure: " + savedProducts[i].unitOfMeasure + "\n";
    }
  
    res.status(201).send("List of products: \n" + print);
  });

// GET registered product by id
warehouseRouter.get("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedProducts: Product[] = JSON.parse(await readStorage('../data/products.json')) ?? [];

  if(savedProducts.length < 1) {
    res.status(400).send("There is no products!");
  }

  const productIndex = savedProducts.findIndex(p => p.id === +req.params.id)

  if(productIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const print = "ID: " + savedProducts[productIndex].id + " Name: " + savedProducts[productIndex].name + " Price: " + savedProducts[productIndex].price 
  + " Quantity: " + savedProducts[productIndex].quantity + " Unit of measure: " + savedProducts[productIndex].unitOfMeasure + "\n";

  res.status(201).send("Product before edit: " + print);
});

/* PUT */

// EDIT registered product by id
warehouseRouter.put("/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    res.status(400).send("You need to send new data to update existing product!");
  }
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedProducts: Product[] = JSON.parse(await readStorage('../data/products.json')) ?? [];

  if(savedProducts.length < 1) {
    res.status(400).send("There is no products!");
  }

  const productIndex = savedProducts.findIndex(p => p.id === +req.params.id)

  if(productIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  const data = JSON.parse(JSON.stringify(req.body));
  const tempTable = savedProducts[productIndex];

  if(data.name) {
    savedProducts[productIndex].name = data.name;
  }
  if(data.price) {
    savedProducts[productIndex].price = data.price;
  }
  if(data.quantity) {
    savedProducts[productIndex].quantity = data.quantity;
  }
  if(data.unitOfMeasure) {
    savedProducts[productIndex].unitOfMeasure = data.unitOfMeasure;
  }
  
  const printOld = "ID: " + tempTable.id + " Name: " + tempTable.name + " Price: " + tempTable.price 
  + " Quantity: " + tempTable.quantity + " Unit of measure: " + tempTable.unitOfMeasure + "\n";

  const printNew = "ID: " + savedProducts[productIndex].id + " Name: " + savedProducts[productIndex].name + " Price: " + savedProducts[productIndex].price 
  + " Quantity: " + savedProducts[productIndex].quantity + " Unit of measure: " + savedProducts[productIndex].unitOfMeasure + "\n";

  await updateStorage('../data/products.json', JSON.stringify(savedProducts));
  res.status(201).send("Product before edit: " + printOld + " Product after edit: " + printNew);
});

/* DELETE */

// DELETE registered product by id
warehouseRouter.delete("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("You need to send ID!");
  }
  
  const savedProducts: Product[] = JSON.parse(await readStorage('../data/products.json')) ?? [];

  if(savedProducts.length < 1) {
    res.status(400).send("There is no products!");
  }

  const productIndex = savedProducts.findIndex(p => p.id === +req.params.id)

  if(productIndex === -1) {
    res.status(400).send("Wrong ID!");
  }

  savedProducts.splice(productIndex, 1);
  await updateStorage('../data/products.json', JSON.stringify(savedProducts));
  res.status(201).send("Product successfuly removed!");
});

export default warehouseRouter;
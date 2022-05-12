/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createProduct, createProductNeed, deleteProduct, readAllProducts, readAllProductsSorted, readProduct, updateProduct } from "../services/warehouseService";

/* SETUP */

const warehouseRouter = express.Router();

/* POST */

// POST register new product
warehouseRouter.post("/register", async function (req: Request, res: Response) {
  if (!req.body) {
    return res.status(400).send("To register a new product you need to send it's: name, price, quantity and unit of measure!");
  }
  if (!req.body.name) {
    return res.status(400).send("Name is missing!");
  }
  if (!req.body.price) {
    return res.status(400).send("Price is missing!");
  }
  if (!req.body.quantity) {
    return res.status(400).send("Quantity is missing!");
  }
  if (!req.body.unitOfMeasure) {
    return res.status(400).send("Unit of measure is missing!");
  }
  if(req.body.unitOfMeasure === 'g' || req.body.unitOfMeasure === 'dg' || req.body.unitOfMeasure === 'kg' || req.body.unitOfMeasure === 't') {
    
    return res.status(201).send("New Product registration succeded! It's ID: " + await createProduct(JSON.parse(JSON.stringify(req.body))));
  }
  else {
    return res.status(400).send("Units of measure available: g, dg, kg, t!");
  }
});

// POST register new product
warehouseRouter.post("/need", async function (req: Request, res: Response) {
  if (!req.body) {
    return res.status(400).send("To register a new needed product you need to send it's: name, price, quantity and unit of measure!");
  }
  if (!req.body.name) {
    return res.status(400).send("Name is missing!");
  }
  if (!req.body.price) {
    return res.status(400).send("Price is missing!");
  }
  if (!req.body.quantity) {
    return res.status(400).send("Quantity is missing!");
  }
  if (!req.body.unitOfMeasure) {
    return res.status(400).send("Unit of measure is missing!");
  }
  if(req.body.unitOfMeasure === 'g' || req.body.unitOfMeasure === 'dg' || req.body.unitOfMeasure === 'kg' || req.body.unitOfMeasure === 't') {
    
    return res.status(201).send("New needed product registration succeded! It's ID: " + await createProductNeed(JSON.parse(JSON.stringify(req.body))));
  }
  else {
    return res.status(400).send("Units of measure available: g, dg, kg, t!");
  }
});

/* GET */

// GET registered products
warehouseRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send("List of products: \n" + await readAllProducts());
});

// GET registered products in sorted order by param
warehouseRouter.get("/:sort", async function (req: Request, res: Response) {
    if(!req.params.sort) {
        return res.status(400).send("Sort param needed! Possible: ID, name, price, quantity");
    }
    
    return res.status(200).send("List of sorted products: \n" + await readAllProductsSorted(req.params.sort));
  });

// GET registered product by id
warehouseRouter.get("/product/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send("Product: " + await readProduct(+req.params.id));
});

/* PUT */

// EDIT registered product by id
warehouseRouter.put("/product/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    return res.status(400).send("You need to send new data to update existing product!");
  }
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send("Product before and after edit: \n" + await updateProduct(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered product by id
warehouseRouter.delete("/product/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  await deleteProduct(+req.params.id);
  return res.status(200).send("Product successfuly removed!");
});

export default warehouseRouter;
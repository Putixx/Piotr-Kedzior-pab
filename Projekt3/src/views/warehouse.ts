/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createProduct, createProductNeed, deleteProduct, readAllProducts, readAllProductsSorted, readProduct, updateProduct } from "../services/warehouseService";
import { createNeedProductValidation, createProductValidation, deleteProductByIDValidation, editProductByIDValidation, getProductByIDValidation, getSortedProductsValidation } from "../validation/warehouseValidation";

/* SETUP */

const warehouseRouter = express.Router();

/* POST */

// POST register new product
warehouseRouter.post("", async function (req: Request, res: Response) {
  createProductValidation(req.body);

  return res.status(201).send(await createProduct(JSON.parse(JSON.stringify(req.body))));
});

// POST register new product
warehouseRouter.post("/need", async function (req: Request, res: Response) {
  createNeedProductValidation(req.body);

  return res.status(201).send(await createProductNeed(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered products
warehouseRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send(await readAllProducts());
});

// GET registered products in sorted order by param
warehouseRouter.get("/:sort", async function (req: Request, res: Response) {
    getSortedProductsValidation(req.params.sort);
    
    return res.status(200).send(await readAllProductsSorted(req.params.sort));
  });

// GET registered product by id
warehouseRouter.get("/product/:id", async function (req: Request, res: Response) {
  getProductByIDValidation(+req.params.id);
  
  return res.status(200).send(await readProduct(+req.params.id));
});

/* PUT */

// EDIT registered product by id
warehouseRouter.put("/product/:id", async function (req: Request, res: Response) {
  editProductByIDValidation(req.body, +req.params.id);
  
  return res.status(200).send(await updateProduct(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered product by id
warehouseRouter.delete("/product/:id", async function (req: Request, res: Response) {
  deleteProductByIDValidation(+req.params.id);
  
  return res.status(200).send(await deleteProduct(+req.params.id));
});

export default warehouseRouter;
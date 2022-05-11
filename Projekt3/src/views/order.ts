/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createOrder, deleteOrder, readAllOrders, readOrder, updateOrder } from "../services/orderServices";

/* SETUP */

const orderRouter = express.Router();

/* POST */

// POST register new order
orderRouter.post("/register", async function (req: Request, res: Response) {
  if (!req.body) {
    return res.status(400).send("To register a new order you need to send it's: worker, meals, status, table and price!");
  }
  if (!req.body.worker) {
    return res.status(400).send("Worker is missing!");
  }
  if (!req.body.meals) {
    return res.status(400).send("Meals are missing!");
  }
  if (!req.body.status) {
    return res.status(400).send("Status is missing!");
  }
  if (!req.body.table) {
    return res.status(400).send("Table is missing!");
  }
  if(req.body.status === 'ordered' || req.body.status === 'inprogress' || req.body.status === 'realized' || req.body.status === 'bill') {
    return res.status(201).send("New order registration succeded! It's ID: " + await createOrder(JSON.parse(JSON.stringify(req.body))));
    }
    else {
        return res.status(400).send("Statuses available: ordered, inprogress, realized, bill!");
    }
});

/* GET */

// GET registered orders
orderRouter.get("/orders", async function (req: Request, res: Response) {
  return res.status(200).send("List of orders: \n" + await readAllOrders());
});

// GET registered order by id
orderRouter.get("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send("Order: " + await readOrder(+req.params.id));
});

/* PUT */

// EDIT registered order by id
orderRouter.put("/:id", async function (req: Request, res: Response) {
  if(!req.body) {
    return res.status(400).send("You need to send new data to update existing order!");
  }
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send("Order before and after edit: " + await updateOrder(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered order by id
orderRouter.delete("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  await deleteOrder(+req.params.id);
  return res.status(200).send("Order successfuly removed!");
});

export default orderRouter;
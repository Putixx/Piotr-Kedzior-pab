/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createOrder, deleteOrder, readAllOrders, readOrder, updateOrder } from "../services/orderServices";
import { createOrderValidation } from "../validation/orderValidation";

/* SETUP */

const orderRouter = express.Router();

/* POST */

// POST register new order
orderRouter.post("", async function (req: Request, res: Response) {
  res.status(201).send(createOrderValidation(req.body) + await createOrder(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered orders
orderRouter.get("", async function (req: Request, res: Response) {
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
  
  return res.status(200).send(await updateOrder(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered order by id
orderRouter.delete("/:id", async function (req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(400).send("You need to send ID!");
  }
  
  return res.status(200).send(await deleteOrder(+req.params.id));
});

export default orderRouter;
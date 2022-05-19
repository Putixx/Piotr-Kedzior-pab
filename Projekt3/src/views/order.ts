/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { createOrder, deleteOrder, readAllOrders, readOrder, updateOrder } from "../services/orderServices";
import { createOrderValidation, deleteOrderByIDValidation, editOrderByIDValidation, getOrderByIDValidation } from "../validation/orderValidation";

/* SETUP */

const orderRouter = express.Router();

/* POST */

// POST register new order
orderRouter.post("", async function (req: Request, res: Response) {
  createOrderValidation(req.body);

  res.status(201).send(await createOrder(JSON.parse(JSON.stringify(req.body))));
});

/* GET */

// GET registered orders
orderRouter.get("", async function (req: Request, res: Response) {
  return res.status(200).send(await readAllOrders());
});

// GET registered order by id
orderRouter.get("/:id", async function (req: Request, res: Response) {
  getOrderByIDValidation(+req.params.id);
  
  return res.status(200).send(await readOrder(+req.params.id));
});

/* PUT */

// EDIT registered order by id
orderRouter.put("/:id", async function (req: Request, res: Response) {
  editOrderByIDValidation(req.body, +req.params.id);
  
  return res.status(200).send(await updateOrder(JSON.parse(JSON.stringify(req.body)), +req.params.id));
});

/* DELETE */

// DELETE registered order by id
orderRouter.delete("/:id", async function (req: Request, res: Response) {
  deleteOrderByIDValidation(+req.params.id);
  
  return res.status(200).send(await deleteOrder(+req.params.id));
});

export default orderRouter;
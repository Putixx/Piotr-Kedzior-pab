/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { reportByWorkerID, reportIncomeByTime, reportOrdersByTime } from "../services/reportService";
import { reportIncomeInTimeValidation, reportOrdersInTimeValidation, reportPerWorkerValidation } from "../validation/reportValidation";

/* SETUP */

const orderRepRouter = express.Router();

/* GET */

// Report per worker
orderRepRouter.get("/:workerid", async function (req: Request, res: Response) {
    reportPerWorkerValidation(+req.params.workerid);
    
    return res.status(200).send(await reportByWorkerID(+req.params.workerid));
});

// Report per orders in specified time-frames
orderRepRouter.get("/orders/:start/:end", async function (req: Request, res: Response) {
    reportOrdersInTimeValidation(new Date(req.params.start), new Date(req.params.end));
    
    return res.status(200).send(await reportOrdersByTime(req.params.start, req.params.end));
});

// Report per orders in specified time-frames
orderRepRouter.get("/income/:start/:end", async function (req: Request, res: Response) {
  reportIncomeInTimeValidation(new Date(req.params.start), new Date(req.params.end));
  
  return res.status(200).send(await reportIncomeByTime(req.params.start, req.params.end));
});

export default orderRepRouter;
/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { reportByWorkerID, reportOrdersByTime } from "../services/reportService";

/* SETUP */

const orderRepRouter = express.Router();

/* GET */

// Report per worker
orderRepRouter.get("/:workerid", async function (req: Request, res: Response) {
    if (!req.params.workerid) {
      return res.status(400).send("You need to send worker's ID!");
    }
    
    return res.status(200).send("Orders: " + await reportByWorkerID(+req.params.workerid));
});

// Report per orders in specified time-frames
orderRepRouter.get("/:start/:end", async function (req: Request, res: Response) {
    if (!req.params.start) {
      return res.status(400).send("You need to send start time!");
    }
    if (!req.params.end) {
        return res.status(400).send("You need to send end time!");
    }
    
    return res.status(200).send("Orders: " + await reportOrdersByTime(req.params.start, req.params.end));
});

export default orderRepRouter;
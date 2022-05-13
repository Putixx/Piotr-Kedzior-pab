/* IMPORT */

import express from "express";
import { Request, Response } from "express";
import { connectDB, syncData } from "../database/databaseService";

/* SETUP */

const databaseRouter = express.Router();

/* POST */

// POST synchronize data
databaseRouter.post("/sync", async function (req: Request, res: Response) {
  
    await connectDB();
    await syncData();
    return res.status(200).send("Data successfully synchronized!");
});

export default databaseRouter;
/* IMPORT */

import express from "express";
import { Request, Response } from "express";

/* SETUP */

const app = express();
app.use(express.json());

/* POST */

// POST register new restaurant
app.post("/register", async function (req: Request, res: Response) {
  if (!req.body) {
    res.status(401).send("To register a new restaurant you need to send it's: name, address, phone, nip, email and www!");
  }
  if (!req.body.name) {
    res.status(401).send("Name is missing!");
  }
  if (!req.body.address) {
    res.status(401).send("Address is missing!");
  }
  if (!req.body.phone) {
    res.status(401).send("Phone number is missing!");
  }
  if (!req.body.nip) {
    res.status(401).send("NIP number is missing!");
  }
  if (!req.body.email) {
    res.status(401).send("E-mail is missing!");
  }
  if (!req.body.www) {
    res.status(401).send("Website url is missing!");
  }

  const data = JSON.parse(JSON.stringify(req.body));

  res.status(200).send("Bearer ");
});

// POST restaurant
app.post("/login/restaurant", async function (req: Request, res: Response) {
  if (!req.body) {
    res.status(400).send("Błędnie wprowadzone wartości!");
  }

  if (!req.body.name) {
    res.status(400).send("Wprowadzona restauracja musi mieć nazwe!");
  }

  if (!req.body.adress) {
    res.status(400).send("Wprowadzona restauracja musi mieć adres!");
  }

  if (!req.body.nip) {
    res.status(400).send("Wprowadzona restauracja musi mieć nip!");
  }

  res.status(201).send("ID wprowadzonej notatki: ");
});

app.listen(3000);





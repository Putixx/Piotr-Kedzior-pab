/* IMPORT BEG */

import express from "express";
import { Request, Response } from "express";

/* IMPORT END */

/* SETUP BEG */

const app = express();
app.use(express.json());

/* SETUP END */

function click(){
  const x = document.getElementById("divid") as HTMLInputElement;
  x.innerHTML = "Witaj";
}



/* POST BEG */

// POST login
app.post("/", async function (req: Request, res: Response) {
  if (!req.body) {
    res.status(401).send("Wystąpił błąd podczas logowania!");
  }
  if (!req.body.login) {
    res.status(401).send("Należy podać login!");
  }
  if (!req.body.password) {
    res.status(401).send("Należy podać hasło!");
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





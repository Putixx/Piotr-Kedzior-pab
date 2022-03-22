import express from 'express'
import {
  Request,
  Response
} from 'express'
import {
  Note
} from '../models/note'


const app = express();
const notes: Note[] = [];

app.use(express.json())

app.post('/note', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 

  if (req.body !== null && req.body !== undefined && req.body.title !== undefined && req.body.content !== undefined) {
    const data = JSON.parse(JSON.stringify(req.body));

    notes.push({
      title: data.title,
      content: data.content,
      id: Date.now()
    });
    res.status(201).send("ID wprowadzonej notatki: " + notes[0].id);
  } else {
    res.status(400).send("Błędnie wprowadzone wartości!");
  }

})

app.get('/note/:id', function (req: Request, res: Response) {

  const id = +req.params.id;

  if (id === notes[0].id) {
    res.status(200).send("ID: " + id + " Tytuł: " + notes[0].title + " Zawartość: " + notes[0].content);
  } else {
    res.sendStatus(404);
  }
})

app.put('/note/:id', function (req: Request, res: Response) {

  console.log(req.body) // e.x. req.body.title 

  if (+req.params.id === notes[0].id) {

    const data = JSON.parse(JSON.stringify(req.body));

    notes[0].title = data.title;
    notes[0].content = data.content;

    res.sendStatus(204);
  } else {
    res.status(400).send("Błędnie wprowadzone wartości!");
  }
})


app.delete('/note/:id', function (req: Request, res: Response) {

  if (+req.params.id === notes[0].id) {
    notes.pop();
    res.status(204);
  } else {
    res.status(400).send("Taka notatka nie istnieje!");
  }
})


app.listen(3000);
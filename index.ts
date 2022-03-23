import express from 'express'
import fs from 'fs';
import {
  Request,
  Response
} from 'express'
import {
  Note
} from '../models/note'

async function readStorage(storeFile: string): Promise<string> {

      return fs.promises.readFile(storeFile, 'utf-8');
}

async function updateStorage(storeFile: string, dataToSave:string): Promise<void> {
  try {
      await fs.promises.writeFile(storeFile, dataToSave);
  } catch (err) {
      console.log(err)
  }
}

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
      id: Date.now(),
      createDate: new Date()
    });

    const ind = notes.findIndex(n => n.title === data.title);



    updateStorage('../data/notes.txt', JSON.stringify(notes[ind]))

    res.status(201).send("ID wprowadzonej notatki: " + notes[ind].id);
  } else {
    res.status(400).send("Błędnie wprowadzone wartości!");
  }

})

app.get('/note/:id', function (req: Request, res: Response) {

  const id = +req.params.id;
  const ind = notes.findIndex(n => n.id === id);

  if (notes[ind] !== undefined && notes[ind] !== null) {
    res.status(200).send("ID: " + id + " Tytuł: " + notes[ind].title + " Zawartość: " + notes[ind].content);
  } else {
    res.sendStatus(404);
  }
})

app.get('/notes', async function (req: Request, res: Response) {

  const data = await readStorage('data/notes.txt');

  if (data !== undefined && data !== null) {

    const note = JSON.parse(data);

    res.status(200).send("ID: " + note.id + " Tytuł: " + note.title + " Zawartość: " + note.content);
  } else {
    res.sendStatus(404);
  }
})

app.put('/note/:id', function (req: Request, res: Response) {

  console.log(req.body) // e.x. req.body.title 
  const ind = notes.findIndex(n => n.id === +req.params.id);

  if (notes[ind] !== undefined && notes[ind] !== null) {

    const data = JSON.parse(JSON.stringify(req.body));

    notes[ind].title = data.title;
    notes[ind].content = data.content;

    res.sendStatus(204);
  } else {
    res.status(400).send("Taka notatka nie istnieje!");
  }
})


app.delete('/note/:id', function (req: Request, res: Response) {

  const ind = notes.findIndex(n => n.id === +req.params.id);

  if (notes[ind] !== undefined && notes[ind] !== null) {
    notes.pop();
    res.status(204);
  } else {
    res.status(400).send("Taka notatka nie istnieje!");
  }
})


app.listen(3000);
/* IMPORT BEG */

import express from 'express'
import fs from 'fs';
import {
  Request,
  Response
} from 'express'
import {
  Note
} from '../models/note'
import {
  Tag
} from '../models/tag'

/* IMPORT END */

/* SETUP BEG */

const app = express();
app.use(express.json())
const notes: Note[] = [];
const tags: Tag[] = [];

/* SETUP END */

/* FILE ASYNC READ/WRITE BEG */

// FILE ASYNC READ
async function readStorage(storeFile: string): Promise <string> {

  return fs.promises.readFile(storeFile, 'utf-8');
}

// FILE ASYNC WRITE
async function updateStorage(storeFile: string, dataToSave: string): Promise <void> {
  try {
    await fs.promises.appendFile(storeFile,"\n" + dataToSave);
  } catch (err) {
    console.log(err)
  }
}

/* FILE ASYNC READ/WRITE END */

/* POST BEG */

// POST note
app.post('/note', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 

  if (req.body !== null && req.body !== undefined && req.body.title !== undefined && req.body.content !== undefined) {
    const data = JSON.parse(JSON.stringify(req.body));
    
    notes.push({
      id: Date.now(),
      title: data.title,
      content: data.content,
      createDate: new Date(),
      tags: [ ...data.tags ]
    });

    const ind = notes.findIndex(n => n.title === data.title);
    updateStorage('data/notes.txt', JSON.stringify(notes[ind]))


    res.status(201).send("ID wprowadzonej notatki: " + notes[ind].id);
  } else {
    res.status(400).send("Błędnie wprowadzone wartości!");
  }

})

// POST tag
app.post('/tag', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 

  if (req.body !== null && req.body !== undefined && req.body.name !== undefined) {
    const data = JSON.parse(JSON.stringify(req.body));
    
    if(tags.some(t => t.name.toLowerCase() === data.name.toLowerCase()))
    {
      res.status(400).send("Taki tag już istnieje!");
    }

    tags.push({
      id: Date.now(),
      name: data.name
    });

    const ind = tags.findIndex(n => n.name.toLowerCase() === data.name.toLowerCase());
    updateStorage('data/tags.txt', JSON.stringify(tags[ind]))


    res.status(201).send("ID wprowadzonego tagu: " + tags[ind].id);
  } else {
    res.status(400).send("Błędnie wprowadzone wartości!");
  }

})

/* POST END */

/* GET BEG */

// GET note by id if exists
app.get('/note/:id', function (req: Request, res: Response) {

  const ind = notes.findIndex(n => n.id === +req.params.id);

  if (notes[ind] !== undefined && notes[ind] !== null) {
    res.status(200).send("ID: " + notes[ind].id + " Tytuł: " + notes[ind].title + " Zawartość: " + notes[ind].content + " Data utworzenia: " + notes[ind].createDate + " Tagi: " + notes[ind].tags);
  } else {
    res.sendStatus(404);
  }
})

// GET list of existing notes if there is any
app.get('/notes', async function (req: Request, res: Response) {

  const data = await readStorage('data/notes.txt');

  if (data !== undefined && data !== null) {

    const tab : string[] = data.toString().replace(/\r\n/g,'\n').split("\n");
    const note : Note[] = [];
    
    for(let i = 0; i < tab.length; i++)
    {
        note[i] = JSON.parse(tab[i]);
    }

    res.status(200).send("ID: " + note[0].id  + " Tytuł: " + note[0].title + " Zawartość: " + note[0].content );
  } else {
    res.sendStatus(404);
  }
})

// GET list of existing tags if there is any
app.get('/tags', async function (req: Request, res: Response) {

  const data = await readStorage('data/tags.txt');

  if (data !== undefined && data !== null) {

    const tab : string[] = data.toString().replace(/\r\n/g,'\n').split("\n");
    const tag : Tag[] = [];
    
    for(let i = 0; i < tab.length; i++)
    {
        tag[i] = JSON.parse(tab[i]);
    }

    res.status(200).send("ID: " + tag[0].id  + " Nazwa tagu: " + tag[0].name);
  } else {
    res.sendStatus(404);
  }
})

/* GET END */

/* PUT BEG */

// EDIT note by id if exists
app.put('/note/:id', function (req: Request, res: Response) {

  const ind = notes.findIndex(n => n.id === +req.params.id);

  if (notes[ind] !== undefined && notes[ind] !== null) {

    const data = JSON.parse(JSON.stringify(req.body));

    if(data.title !== undefined && data.title !== null)
    {
      notes[ind].title = data.title;
    }
    if(data.content !== undefined && data.content !== null)
    {
      notes[ind].content = data.content;
    }
    if(data.tags !== undefined && data.tags !== null)
    {
      notes[ind].tags = data.tags;
    }

    res.sendStatus(204);
  } else {
    res.status(400).send("Taka notatka nie istnieje!");
  }
})

/* PUT END */

/* DEL BEG */

// DEL note by id if exists
app.delete('/note/:id', function (req: Request, res: Response) {

  const ind = notes.findIndex(n => n.id === +req.params.id);

  if (notes[ind] !== undefined && notes[ind] !== null) {
    notes.pop();
    res.status(204);
  } else {
    res.status(400).send("Taka notatka nie istnieje!");
  }
})

/* DEL END */

app.listen(3000);
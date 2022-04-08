/* IMPORT BEG */

import express from 'express'
import jwt from 'jsonwebtoken'
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
import {
  User
} from '../models/user'

/* IMPORT END */

/* SETUP BEG */

const app = express();
app.use(express.json())
const secret = 'abcdef';

/* SETUP END */

/* FILE ASYNC READ/WRITE BEG */

// FILE ASYNC READ
async function readStorage(storeFile: string): Promise < string > {
  return fs.promises.readFile(storeFile, 'utf-8');
}

// FILE ASYNC WRITE
async function updateStorage(storeFile: string, dataToSave: string): Promise < void > {
  try {
    await fs.promises.writeFile(storeFile, dataToSave);
  } catch (err) {
    console.log(err)
  }
}

/* FILE ASYNC READ/WRITE END */

/* POST BEG */

// POST note
app.post('/note', async function (req: Request, res: Response) {
  if (req.body) {
    if (req.body.title) {
      if (req.body.content) {
        const data = JSON.parse(JSON.stringify(req.body));
        const notesData = await readStorage('data/notes.json');
        const notesSaved: Note[] = JSON.parse(notesData);

        notesSaved.push({
          id: Date.now(),
          title: data.title,
          content: data.content,
          createDate: new Date(),
          tags: [data.tags]
        });

        const ind = notesSaved.findIndex(n => n.title === data.title);
        updateStorage('data/notes.json', JSON.stringify(notesSaved))

        res.status(201).send("ID wprowadzonej notatki: " + notesSaved[ind].id);
      } else {
        res.status(400).send("Wprowadzona notatka musi mieć zawartość!");
      }
    } else {
      res.status(400).send("Wprowadzona notatka musi mieć tytuł!");
    }
  } else {
    res.status(400).send("Błędnie wprowadzone wartości!");
  }
})

// POST tag
app.post('/tag', async function (req: Request, res: Response) {
  if (req.body && req.body.name) {
    const data = JSON.parse(JSON.stringify(req.body));
    const tagsData = await readStorage('data/tags.json');
    const tagsSaved: Tag[] = JSON.parse(tagsData);

    if (tagsSaved.some(t => t.name.toLowerCase() === data.name.toLowerCase())) {
      res.status(400).send("Taki tag już istnieje!");
    }

    tagsSaved.push({
      id: Date.now(),
      name: data.name
    });

    const ind = tagsSaved.findIndex(n => n.name.toLowerCase() === data.name.toLowerCase());
    updateStorage('data/tags.json', JSON.stringify(tagsSaved))


    res.status(201).send("ID wprowadzonego tagu: " + tagsSaved[ind].id);

  } else {
    res.status(400).send("Tag musi mieć nazwę!");
  }
})

// POST login
app.post('/login', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 

  if (req.body !== null && req.body !== undefined && req.body.name !== undefined) {
    const data = JSON.parse(JSON.stringify(req.body));

    if (req.headers.authorization !== null && req.headers.authorization !== undefined) {
      const user = {
        id: Date.now(),
        login: data.login,
        password: data.password
      };

      const token = jwt.sign(req.headers.authorization, secret);
      const payload = jwt.verify(token, secret);

      if (req.headers.authorization === payload) {
        res.status(200).send("Bearer " + token);

      } else {
        res.status(401).send("Wystąpił błąd!");
      }

      res.status(200).send("Bearer " + token);
    }
  } else {
    res.status(401).send("Wystąpił błąd!");
  }

})

/* POST END */

/* GET BEG */

// GET note by id if exists
app.get('/note/:id', async function (req: Request, res: Response) {
  const dataNotes = await readStorage('data/notes.json');

  if (dataNotes && req.params.id) {
    const notesSaved: Note[] = JSON.parse(dataNotes);
    const ind = notesSaved.findIndex(n => n.id === +req.params.id);

    res.status(200).send("ID: " + notesSaved[ind].id + " Tytuł: " + notesSaved[ind].title + " Zawartość: " + notesSaved[ind].content + " Data utworzenia: " + notesSaved[ind].createDate + " Tagi: " + notesSaved[ind].tags);
  } else {
    res.sendStatus(404);
  }
})

// GET list of existing notes if there is any
app.get('/notes', async function (req: Request, res: Response) {
  const dataNotes = await readStorage('data/notes.json');

  if (dataNotes) {
    const notesSaved: Note[] = JSON.parse(dataNotes);

    let print = '';
    for (let i = 0; i < notesSaved.length; i++) {
      print += 'ID: ' + notesSaved[i].id + ' Tytuł: ' + notesSaved[i].title + ' Zawartość: ' + notesSaved[i].content + ' Data wprowadzenia: ' + notesSaved[i].createDate + ' Tagi: ' + notesSaved[i].tags + '\n';
    }

    res.status(200).send(print);
  } else {
    res.sendStatus(404);
  }
})

// GET list of existing tags if there is any
app.get('/tags', async function (req: Request, res: Response) {
  const dataTags = await readStorage('data/tags.json');

  if (dataTags) {
    const tagsSaved: Tag[] = JSON.parse(dataTags);

    let print = '';
    for (let i = 0; i < tagsSaved.length; i++) {
      print += 'ID: ' + tagsSaved[i].id + ' Nazwa: ' + tagsSaved[i].name + '\n';
    }

    res.status(200).send(print);
  } else {
    res.sendStatus(404);
  }
})

/* GET END */

/* PUT BEG */

// EDIT note by id if exists
app.put('/note/:id', async function (req: Request, res: Response) {
  const dataSaved = await readStorage('data/notes.json');

  if (dataSaved && req.params.id) {
    const notesSaved: Note[] = JSON.parse(dataSaved);
    const ind = notesSaved.findIndex(n => n.id === +req.params.id);
    const tempNote = {
      ...notesSaved[ind]
    };
    const dataNew = JSON.parse(JSON.stringify(req.body));

    if (dataNew.title) {
      notesSaved[ind].title = dataNew.title;
    } else {
      res.status(400).send("Błędnie wprowadzony tytuł!");
    }
    if (dataNew.content) {
      notesSaved[ind].content = dataNew.content;
    } else {
      res.status(400).send("Błędnie wprowadzona zawartość!");
    }
    if (dataNew.tags) {
      notesSaved[ind].tags = dataNew.tags;
    } else {
      res.status(400).send("Błędnie wprowadzone tagi!");
    }

    updateStorage('data/notes.json', JSON.stringify(notesSaved))
    const printOld = 'Notatka przed edycją: ID: ' + tempNote.id + ' Tytuł: ' + tempNote.title + ' Zawartość: ' + tempNote.content + ' Data utworzenia: ' + tempNote.createDate + ' Tagi: ' + tempNote.tags + '\n';
    const printNew = 'Notatka po edycji: ID: ' + notesSaved[ind].id + ' Tytuł: ' + notesSaved[ind].title + ' Zawartość: ' + notesSaved[ind].content + ' Data utworzenia: ' + notesSaved[ind].createDate + ' Tagi: ' + notesSaved[ind].tags;

    res.status(200).send(printOld + printNew);
  } else {
    res.status(400).send("Błędnie wprowadzone ID!");
  }
})

/* PUT END */

/* DEL BEG */

// DEL note by id if exists
app.delete('/note/:id', async function (req: Request, res: Response) {
  const dataSaved = await readStorage('data/notes.json');

  if (dataSaved && req.params.id) {
    const notesSaved: Note[] = JSON.parse(dataSaved);
    const ind = notesSaved.findIndex(n => n.id === +req.params.id);

    if (ind !== -1) {
      notesSaved.splice(ind, 1);
      updateStorage('data/notes.json', JSON.stringify(notesSaved))
    }

    res.status(204);
  } else {
    res.status(400).send("Taka notatka nie istnieje!");
  }
})

/* DEL END */

app.listen(3000);
/* IMPORT BEG */

import express from 'express'
import jwt from 'jsonwebtoken'
import {
  Request,
  Response,
  NextFunction
} from 'express'
import {
  readStorage,
  updateStorage
} from '../services/storageService'
import {
  addNewNote,
  editNote
} from '../services/noteService'
import {
  addNewTag,
  tagExists
} from '../services/tagService'
import {
  isRegistered, 
  addNewUser, 
  authLoggedUser
} from '../services/userService'
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

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] ?? ''
  if (!token) {
    return res.sendStatus(401)
  }

  if (await readStorage('data/users.json')) {
    const payload = jwt.verify(token, secret)
    const usersSaved: User[] = JSON.parse(await readStorage('data/users.json'));
    if (usersSaved.some(u => u.id?.toString() === payload)) {
      next()
    } else {
      res.sendStatus(401)
    }
  }
}

/* SETUP END */

/* POST BEG */

// POST note
app.post('/note', auth, async function (req: Request, res: Response) {

  if (!req.body) {
    res.status(400).send("Błędnie wprowadzone wartości!");
  }

  if (!req.body.title) {
    res.status(400).send("Wprowadzona notatka musi mieć tytuł!");
  }

  if (!req.body.content) {
    res.status(400).send("Wprowadzona notatka musi mieć zawartość!");
  }

    const data = JSON.parse(JSON.stringify(req.body));
    await addNewNote(data);
    
    res.status(201).send("ID wprowadzonej notatki: " + data.id);
})

// POST tag
app.post('/tag', auth, async function (req: Request, res: Response) {
  if (!req.body && req.body.name) {
    res.status(400).send("Tag musi mieć nazwę!");
  }
    const data = JSON.parse(JSON.stringify(req.body));
    
    if(await tagExists(data)) {
      res.status(400).send("Taki tag już istnieje!");
    }

    await addNewTag(data);

    res.status(201).send("ID wprowadzonego tagu: " + data.id);
  
})

// POST login
app.post('/login', async function (req: Request, res: Response) {

  if (!req.body) {
    res.status(401).send("Wystąpił błąd podczas logowania!");
  }
  if (req.body.login) {
    res.status(401).send("Należy podać login!");
  }
  if (req.body.password) {
    res.status(401).send("Należy podać hasło!");
  }

  const data = JSON.parse(JSON.stringify(req.body));
    
    if(!await isRegistered(data)) {
      await addNewUser(data);
    }
    
    res.status(200).send(authLoggedUser(data, secret));
})

/* POST END */

/* GET BEG */

// GET note by id if exists
app.get('/note/:id', auth, async function (req: Request, res: Response) {
  const notesSaved: Note[] = JSON.parse(await readStorage('data/notes.json'));
  const ind = notesSaved.findIndex(n => n.id === +req.params.id);

  if (ind !== -1) {
    res.status(200).send("ID: " + notesSaved[ind].id + " Tytuł: " + notesSaved[ind].title + " Zawartość: " + notesSaved[ind].content + " Data utworzenia: " + notesSaved[ind].createDate + " Tagi: " + notesSaved[ind].tags);
  } else {
    res.sendStatus(404);
  }
})

// GET list of existing notes if there is any
app.get('/notes', auth, async function (req: Request, res: Response) {
  if (await readStorage('data/notes.json')) {
    const notesSaved: Note[] = JSON.parse(await readStorage('data/notes.json'));

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
app.get('/tags', auth, async function (req: Request, res: Response) {
  if (await readStorage('data/tags.json')) {
    const tagsSaved: Tag[] = JSON.parse(await readStorage('data/tags.json'));

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
app.put('/note/:id', auth, async function (req: Request, res: Response) {
  const dataNew = JSON.parse(JSON.stringify(req.body));

  if(!dataNew.title) {
    res.status(400).send("Błędnie wprowadzony tytuł!");
  }
  if(!dataNew.content) {
    res.status(400).send("Błędnie wprowadzona zawartość!");
  }
  if(!dataNew.tags) {
    res.status(400).send("Błędnie wprowadzone tagi!");
  }

  const notesSaved: Note[] = JSON.parse(await readStorage('data/notes.json'));
  const ind = notesSaved.findIndex(n => n.id === +req.params.id);

  if(ind === -1) {
    res.status(400).send("Błędnie wprowadzone ID!");
  }

  const print = editNote(ind, dataNew, notesSaved);

  res.status(200).send(print);
})

/* PUT END */

/* DEL BEG */

// DEL note by id if exists
app.delete('/note/:id', auth, async function (req: Request, res: Response) {
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
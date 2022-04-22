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
}  from '../services/storageService'
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

const auth = async (req : Request, res : Response, next : NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] ?? ''
  if(!token) {
    return res.sendStatus(401)
  }

  const payload = jwt.verify(token, secret)

  if(await readStorage('data/users.json'))
  {
    const usersSaved: User[] = JSON.parse(await readStorage('data/users.json'));
    if (usersSaved.some(u => u.id?.toString() === payload)) {
      next()
    }
    else {
      res.sendStatus(401)
    }
  }
}

/* SETUP END */



/* POST BEG */

// POST note
app.post('/note', auth, async function (req: Request, res: Response) {
  if (req.body) {
    if (req.body.title) {
      if (req.body.content) {
        if (await readStorage('data/notes.json')) {
          const data = JSON.parse(JSON.stringify(req.body));
          const notesSaved: Note[] = JSON.parse(await readStorage('data/notes.json'));

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
          const data = JSON.parse(JSON.stringify(req.body));
          const notesSaved: Note[] = [];

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
        }
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
app.post('/tag', auth, async function (req: Request, res: Response) {
  if (req.body && req.body.name) {
    if (await readStorage('data/notes.json')) {
      const data = JSON.parse(JSON.stringify(req.body));
      const tagsSaved: Tag[] = JSON.parse(await readStorage('data/tags.json'));

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
      const data = JSON.parse(JSON.stringify(req.body));
      const tagsSaved: Tag[] = [];

      tagsSaved.push({
        id: Date.now(),
        name: data.name
      });

      const ind = tagsSaved.findIndex(n => n.name.toLowerCase() === data.name.toLowerCase());
      updateStorage('data/tags.json', JSON.stringify(tagsSaved))


      res.status(201).send("ID wprowadzonego tagu: " + tagsSaved[ind].id);
    }
  } else {
    res.status(400).send("Tag musi mieć nazwę!");
  }
})

// POST login
app.post('/login', async function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 

  if (req.body) {
    if (req.body.login) {
      if (req.body.password) {
        if (await readStorage('data/users.json')) {
          const data = JSON.parse(JSON.stringify(req.body));
          const usersSaved: User[] = JSON.parse(await readStorage('data/users.json'));
          

          if (!usersSaved.some(u => u.login === data.login && u.password === data.password)) {
            const userCurrent = {
              id: Date.now(),
              login: data.login,
              password: data.password,
              notesIDs: [data.notesIDs],
              tagsIDs: [data.tagsIDs]
            }
            usersSaved.push(userCurrent);
            updateStorage('data/users.json', JSON.stringify(usersSaved));
          }

          const ind = usersSaved.findIndex(u => u.login === data.login && u.password === data.password)
          const payload = usersSaved[ind].id?.toString() ?? ''
          const token = jwt.sign(payload, secret);

          res.status(200).send("Bearer " + token);
        } else {
          const data = JSON.parse(JSON.stringify(req.body));
          const usersSaved: User[] = [];
          

          if (!usersSaved.some(u => u.login === data.login && u.password === data.password)) {
            const userCurrent = {
              id: Date.now(),
              login: data.login,
              password: data.password,
              notesIDs: [data.notesIDs],
              tagsIDs: [data.tagsIDs]
            }
            usersSaved.push(userCurrent);
            updateStorage('data/users.json', JSON.stringify(usersSaved));
          }

          const ind = usersSaved.findIndex(u => u.login === data.login && u.password === data.password)
          const payload = usersSaved[ind].id?.toString() ?? ''
          const token = jwt.sign(payload, secret);

          res.status(200).send("Bearer " + token);
        }
      } else {
        res.status(401).send("Należy podać hasło!");
      }
    } else {
      res.status(401).send("Należy podać login!");
    }
  } else {
    res.status(401).send("Wystąpił błąd podczas logowania!");
  }

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
app.get('/tags', auth, async function (req: Request, res: Response) {
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
app.put('/note/:id', auth, async function (req: Request, res: Response) {
  const notesSaved: Note[] = JSON.parse(await readStorage('data/notes.json'));
  const ind = notesSaved.findIndex(n => n.id === +req.params.id);

  if (req.body && ind !== -1) {
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
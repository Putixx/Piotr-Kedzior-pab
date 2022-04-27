/* IMPORT BEG */

import express from 'express'
import jwt from 'jsonwebtoken'
import {
  Request,
  Response,
  NextFunction
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
import {
  FileSystemStorage,
  DatabaseStorage
} from '../services/storageService'

/* IMPORT END */

/* SETUP BEG */

const app = express();
app.use(express.json())
const secret = 'abcdef';
let storageOption: FileSystemStorage | DatabaseStorage;

function storageO(): void {
  const config = import('./myConfig.json')
  if (JSON.stringify(config).includes('true')) {
    storageOption = new DatabaseStorage()
  } else {
    storageOption = new FileSystemStorage()
  }
}


const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] ?? ''
  if (!token) {
    return res.sendStatus(401)
  }
  storageO()
    const payload = jwt.verify(token, secret)
    const usersSaved: User[] = JSON.parse(await storageOption.readStorage());
    if (usersSaved.some(u => u.id?.toString() === payload)) {
      next()
    } else {
      res.sendStatus(401)
    }
  
}

/* SETUP END */

/* POST BEG */

// POST login
app.post('/login', async function (req: Request, res: Response) {
  storageO();

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
  const usersSaved: User[] = JSON.parse(await storageOption.readStorage());
  let index = usersSaved.findIndex(u => u.login === data.login && u.password === data.password)

  if (index === -1) {
    const userCurrent = {
      id: Date.now(),
      login: data.login,
      password: data.password,
      notes: [],
      tags: []
    }
    usersSaved.push(userCurrent);
    storageOption.updateStorage(usersSaved);
  }

  index = usersSaved.findIndex(u => u.login === data.login && u.password === data.password)

  //auth user
  const payload = usersSaved[index].id?.toString() ?? '';
  const token = jwt.sign(payload, secret);

  res.status(200).send('Bearer ' + token);
})

// POST note
app.post('/login/note', auth, async function (req: Request, res: Response) {

  if (!req.body) {
    res.status(400).send("Błędnie wprowadzone wartości!");
  }

  if (!req.body.title) {
    res.status(400).send("Wprowadzona notatka musi mieć tytuł!");
  }

  if (!req.body.content) {
    res.status(400).send("Wprowadzona notatka musi mieć zawartość!");
  }
  const token = req.headers.authorization?.split(' ')[1] ?? ''
  const userID = jwt.verify(token, secret)
  const data = JSON.parse(JSON.stringify(req.body));
  const usersSaved: User[] = JSON.parse(await storageOption.readStorage());
  const userIndex = usersSaved.findIndex(u => u.id?.toString() === userID);

  const note: Note = ({
    id: Date.now(),
    title: data.title,
    content: data.content,
    createDate: new Date(),
    isPrivate: data.isPrivate,
    tags: data.tags
  });

  usersSaved[userIndex].notes.push(note);
  storageOption.updateStorage(usersSaved);
  res.status(201).send("ID wprowadzonej notatki: " + note.id);
})

// POST tag
app.post('/login/tag', auth, async function (req: Request, res: Response) {
  if (!req.body && req.body.name) {
    res.status(400).send("Tag musi mieć nazwę!");
  }
  const data = JSON.parse(JSON.stringify(req.body));
  const usersSaved: User[] = JSON.parse(await storageOption.readStorage());
  let isInArray = false;

  for (let i = 0; i < usersSaved.length; i++) {
    for (let j = 0; j < usersSaved[i].tags.length; j++) {
      if (usersSaved[i].tags[j].name.toLocaleLowerCase() === data.name.toLowerCase()) {
        isInArray = true;
      }
    }
  }
  if (isInArray) {
    res.status(400).send("Taki tag już istnieje!");
  }

  const token = req.headers.authorization?.split(' ')[1] ?? ''
  const userID = jwt.verify(token, secret)
  const userIndex = usersSaved.findIndex(u => u.id?.toString() === userID);

  const tag: Tag = ({
    id: Date.now(),
    name: data.name
  });

  usersSaved[userIndex].tags.push(tag);
  storageOption.updateStorage(usersSaved);

  res.status(201).send("Wprowadzono nowy tag o nazwie: " + tag.id);
})

/* POST END */

/* GET BEG */

// GET note by id if exists
app.get('/login/note/:id', auth, async function (req: Request, res: Response) {
  const usersSaved: User[] = JSON.parse(await storageOption.readStorage());
  const token = req.headers.authorization?.split(' ')[1] ?? ''
  const userID = jwt.verify(token, secret)
  const userIndex = usersSaved.findIndex(u => u.id?.toString() === userID);
  const noteIndex = usersSaved[userIndex].notes.findIndex(n => n.id === +req.params.id);

  if (noteIndex !== -1 && userIndex !== -1) {
    res.status(200).send("ID: " + usersSaved[userIndex].notes[noteIndex].id + " Tytuł: " + usersSaved[userIndex].notes[noteIndex].title + " Zawartość: " + usersSaved[userIndex].notes[noteIndex].content + " Data utworzenia: " + usersSaved[userIndex].notes[noteIndex].createDate + " Tagi: " + usersSaved[userIndex].notes[noteIndex].tags);
  } else {
    res.sendStatus(404);
  }
})

// GET list of existing notes if there is any
app.get('/login/notes', auth, async function (req: Request, res: Response) {
  if (await storageOption.readStorage()) {
    const usersSaved: User[] = JSON.parse(await storageOption.readStorage());
    const token = req.headers.authorization?.split(' ')[1] ?? ''
    const userID = jwt.verify(token, secret)
    const userIndex = usersSaved.findIndex(u => u.id?.toString() === userID);

    let print = '';
    for (let i = 0; i < usersSaved[userIndex].notes.length; i++) {
      print += 'ID: ' + usersSaved[userIndex].notes[i].id + ' Tytuł: ' + usersSaved[userIndex].notes[i].title + ' Zawartość: ' + usersSaved[userIndex].notes[i].content + ' Data wprowadzenia: ' + usersSaved[userIndex].notes[i].createDate + ' Tagi: ' + usersSaved[userIndex].notes[i].tags + '\n';
    }

    res.status(200).send(print);
  } else {
    res.sendStatus(404);
  }
})

// GET list of existing tags if there is any
app.get('/tags', auth, async function (req: Request, res: Response) {
  if (await storageOption.readStorage()) {
    const usersSaved: User[] = JSON.parse(await storageOption.readStorage());
    const token = req.headers.authorization?.split(' ')[1] ?? ''
    const userID = jwt.verify(token, secret)
    const userIndex = usersSaved.findIndex(u => u.id?.toString() === userID);

    let print = '';
    for (let i = 0; i < usersSaved[userIndex].tags.length; i++) {
      print += 'ID: ' + usersSaved[userIndex].tags[i].id + ' Nazwa: ' + usersSaved[userIndex].tags[i].name + '\n';
    }

    res.status(200).send(print);
  } else {
    res.sendStatus(404);
  }
})

/* GET END */

/* PUT BEG */

// EDIT note by id if exists
// app.put('/note/:id', auth, async function (req: Request, res: Response) {
//   const dataNew = JSON.parse(JSON.stringify(req.body));

//   if(!dataNew.title) {
//     res.status(400).send("Błędnie wprowadzony tytuł!");
//   }
//   if(!dataNew.content) {
//     res.status(400).send("Błędnie wprowadzona zawartość!");
//   }
//   if(!dataNew.tags) {
//     res.status(400).send("Błędnie wprowadzone tagi!");
//   }

//   const usersSaved: User[] = JSON.parse((await storageOption.readStorage()).toString());
//   const ind = usersSaved.findIndex(n => n.notes.id === +req.params.id);

//   if(ind === -1) {
//     res.status(400).send("Błędnie wprowadzone ID!");
//   }

//   const print = editNote(ind, dataNew, notesSaved, storageOption);

//   res.status(200).send(print);
// })

/* PUT END */

/* DEL BEG */

// DEL note by id if exists
// app.delete('/note/:id', auth, async function (req: Request, res: Response) {
//   const dataSaved = await storageOption.readStorage();

//   if (dataSaved && req.params.id) {
//     const notesSaved: Note[] = JSON.parse(dataSaved.toString());
//     const ind = notesSaved.findIndex(n => n.id === +req.params.id);

//     if (ind !== -1) {
//       notesSaved.splice(ind, 1);
//       storageOption.updateStorage()
//     }

//     res.status(204);
//   } else {
//     res.status(400).send("Taka notatka nie istnieje!");
//   }
// })

/* DEL END */

app.listen(3000);
import express from 'express'
import {Request, Response} from 'express'
import {Note} from '../models/note'


const app = express();
const notes:Note[] = [];

app.use(express.json())

app.post('/note', function (req: Request, res: Response) {
  //console.log(req.body) // e.x. req.body.title 

  if(req.body !== null && req.body !== undefined)
  {
    notes.push( {id: parseInt(req.body.id), title: req.body.title, content: req.body.content});
    res.status(201).send(notes[0].id);
  }
  else
  {
      res.sendStatus(404);
  }
  
})

app.get('/note/:id', function (req: Request, res: Response) {
    
    const id = +req.params.id;

    if(id === notes[0].id)
    {
        res.status(200).send("ID: " + id + " Tytuł: " + notes[0].title + " Zawartość: " + notes[0].content);
    }
    else
    {
        res.sendStatus(404);
    }
  })

app.listen(3000);
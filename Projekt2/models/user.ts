export {User};

import {
    Note
  } from '../models/note'

  import {
    Tag
  } from '../models/tag'

class User
{
    id?:number;
    login:string;
    password:string;
    notesIDs:Note[];
    tagsIDs:Tag[];

    constructor(t : User)
    {
        this.id = t.id;
        this.login = t.login;
        this.password = t.password;
        this.notesIDs = t.notesIDs;
        this.tagsIDs = t.tagsIDs;
    }
}
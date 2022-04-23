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
    notes:Note[];
    tags:Tag[];

    constructor(t : User)
    {
        this.id = t.id;
        this.login = t.login;
        this.password = t.password;
        this.notes = t.notes;
        this.tags = t.tags;
    }
}
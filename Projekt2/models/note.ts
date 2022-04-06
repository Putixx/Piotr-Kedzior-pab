export {Note};

import {
    Tag
  } from '../models/tag'

class Note
{
    id?:number;
    title:string;
    content:string;
    createDate?:Date;
    tags?:Tag[];

    constructor(nt : Note)
    {
        this.id = nt.id;
        this.title = nt.title;
        this.content = nt.content;
        this.createDate = nt.createDate;
        this.tags = nt.tags;
    }
}
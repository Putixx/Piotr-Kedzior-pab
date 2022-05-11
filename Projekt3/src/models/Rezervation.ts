import {Table} from './Table'

export class Rezervation
{
    id:number;
    table:Table;
    start:Date;
    end:Date;
    client:string;

    constructor(t : Rezervation)
    {
        this.id = t.id ?? Date.now();
        this.table = t.table;
        this.start = t.start;
        this.end = t.end;
        this.client = t.client;
    }
}
import {Table} from './Table'

export {Rezervation};


class Rezervation
{
    id:number;
    table:Table;
    start:string;
    end:string;
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
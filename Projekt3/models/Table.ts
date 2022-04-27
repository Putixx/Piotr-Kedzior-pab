export {Table};


class Table
{
    id?:number;
    name:string;
    numPlaces:number;
    status:string; // wolny/zajęty/niedostępny

    constructor(t : Table)
    {
        this.id = t.id ?? Date.now();
        this.name = t.name;
        this.numPlaces = t.numPlaces;
        this.status = t.status;
    }
}
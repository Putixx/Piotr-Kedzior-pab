export {Table};

enum TableStatus { free = 'free', taken = 'taken', unavailable = 'unavailable'}

class Table
{
    id:number;
    name:string;
    numPlaces:number;
    status:TableStatus; 

    constructor(t : Table)
    {
        this.id = t.id ?? Date.now();
        this.name = t.name;
        this.numPlaces = t.numPlaces;
        this.status = t.status;
    }
}
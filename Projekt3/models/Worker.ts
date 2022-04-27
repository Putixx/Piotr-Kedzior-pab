export {Worker};


class Worker
{
    id?:number;
    name:string;
    surname:string;
    occupation:string;

    constructor(t : Worker)
    {
        this.id = t.id ?? Date.now();
        this.name = t.name;
        this.surname = t.surname;
        this.occupation = t.occupation;
    }
}
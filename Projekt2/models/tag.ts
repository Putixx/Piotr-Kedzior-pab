export {Tag};

class Tag
{
    id?:number;
    name:string;

    constructor(t : Tag)
    {
        this.id = t.id;
        this.name = t.name;
    }
}
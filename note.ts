export {Note};

class Note
{
    title:string;
    content:string;
    createDate?:string;
    tags?:string[];
    id?:number;

    constructor(nt : Note)
    {
        this.title = nt.title;
        this.content = nt.content;
        this.createDate = nt.createDate;
        this.tags = nt.tags;
        this.id = nt.id;
    }
}
export {Note};

class Note
{
    id?:number;
    title:string;
    content:string;
    createDate?:Date;
    tags?:string[];

    constructor(nt : Note)
    {
        this.id = nt.id;
        this.title = nt.title;
        this.content = nt.content;
        this.createDate = nt.createDate;
        this.tags = nt.tags;
    }
}
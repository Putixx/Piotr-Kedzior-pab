export {User};

class User
{
    id?:number;
    login:string;
    password:string;
    notesIDs:number[];

    constructor(t : User)
    {
        this.id = t.id;
        this.login = t.login;
        this.password = t.password;
        this.notesIDs = t.notesIDs;
    }

   public IsAuthorized() : boolean {


       return
   } 
}
export {User};

class User
{
    id?:number;
    login:string;
    password:string;

    constructor(t : User)
    {
        this.id = t.id;
        this.login = t.login;
        this.password = t.password;
    }

   public IsAuthorized() {
       
   } 
}
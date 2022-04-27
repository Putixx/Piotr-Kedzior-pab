export {Restaurant};


class Restaurant
{
    id?:number;
    name:string;
    adress:string;
    phone:string;
    nip:string;
    email:string;
    www:string;

    constructor(t : Restaurant)
    {
        this.id = t.id ?? Date.now();
        this.name = t.name;
        this.adress = t.adress;
        this.phone = t.phone;
        this.nip = t.nip;
        this.email = t.email;
        this.www = t.www;
    }
}
export class Restaurant
{
    id:number;
    name:string;
    address:string;
    phone:string;
    nip:string;
    email:string;
    www:string;

    constructor(t : Restaurant)
    {
        this.id = t.id ?? Date.now();
        this.name = t.name;
        this.address = t.address;
        this.phone = t.phone;
        this.nip = t.nip;
        this.email = t.email;
        this.www = t.www;
    }
}
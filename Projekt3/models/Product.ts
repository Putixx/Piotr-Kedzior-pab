export {Product};


class Product
{
    id?:number;
    name:string;
    price:string;
    quantity:string;
    unitOfMessure:string;

    constructor(t : Product)
    {
        this.id = t.id ?? Date.now();
        this.name = t.name;
        this.price = t.price;
        this.quantity = t.quantity;
        this.unitOfMessure = t.unitOfMessure;
    }
}
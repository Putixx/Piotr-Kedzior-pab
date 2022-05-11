enum UnitOfMeasure { gram = 'g', dekagram = 'dg', kilogram = 'kg', tona = 't'}

export class Product
{
    id:number;
    name:string;
    price:string;
    quantity:string;
    unitOfMeasure:UnitOfMeasure;

    constructor(t : Product)
    {
        this.id = t.id ?? Date.now();
        this.name = t.name;
        this.price = t.price;
        this.quantity = t.quantity;
        this.unitOfMeasure = t.unitOfMeasure;
    }
}
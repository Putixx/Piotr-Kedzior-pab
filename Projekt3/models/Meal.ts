export {Meal};


class Meal
{
    id:number;
    name:string;
    price:string;
    category:string;

    constructor(t : Meal)
    {
        this.id = t.id ?? Date.now();
        this.name = t.name;
        this.price = t.price;
        this.category = t.category;
    }
}
import {Table} from './Table'
import {Worker} from './Worker'
import {Meal} from './Meal'

export {Order};


class Order
{
    id:number;
    worker:Worker;
    meals:Meal[];
    status:string;
    table:Table;
    price:string;

    constructor(t : Order)
    {
        this.id = t.id ?? Date.now();
        this.worker = t.worker;
        this.meals = t.meals ?? [];
        this.status = t.status;
        this.table = t.table;
        this.price = t.price;
    }
}
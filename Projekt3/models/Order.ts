import {Table} from './Table'
import {Worker} from './Worker'
import {Meal} from './Meal'

export {Order};

enum OrderStatus { ordered = 'ordered', inprogress = 'inprogress', realized = 'realized', bill = 'bill'}

class Order
{
    id:number;
    worker:Worker;
    meals:Meal[];
    status:OrderStatus;
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
import {Table} from './tableModel'
import {Worker} from './workerModel'
import {Meal} from './mealModel'

enum OrderStatus { ordered = 'ordered', inprogress = 'inprogress', realized = 'realized', bill = 'bill'}

export class Order
{
    id:number;
    worker:Worker;
    meals:Meal[];
    status:OrderStatus;
    table:Table;
    price:number;

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
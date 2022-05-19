/* IMPORT */

import { Order } from "../models/orderModel";

/* FUNCTIONS */

// Create new order
export function createOrderValidation(data: Order): string {
    if (!data) {
        return "To register a new order you need to send it's: worker, meals, status, table and price!";
      }
      if (!data.worker) {
        return "Worker is missing!";
      }
      if (!data.meals) {
        return "Meals are missing!";
      }
      if (!data.status) {
        return "Status is missing!";
      }
      if (!data.table) {
        return "Table is missing!";
      }
      if(data.status === 'ordered' || data.status === 'inprogress' || data.status === 'realized' || data.status === 'bill') {
        return "New order registration succeded! \n";
        }
        else {
            return "Statuses available: ordered, inprogress, realized, bill!";
        }
}

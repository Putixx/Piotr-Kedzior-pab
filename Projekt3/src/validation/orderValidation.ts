/* IMPORT */



/* FUNCTIONS */

// Create new order
export function createOrderValidation(data: any): void {
    if (!data) {
        throw new Error("To register a new order you need to send it's: worker, meals, status, table and price!");
      }
      if (!data.worker) {
        throw new Error("Worker is missing!");
      }
      if (!data.meals) {
        throw new Error("Meals are missing!");
      }
      if (!data.status) {
        throw new Error("Status is missing!");
      }
      if (!data.table) {
        throw new Error("Table is missing!");
      }
      if(data.status === 'ordered' || data.status === 'inprogress' || data.status === 'realized' || data.status === 'bill') {
        console.log("createOrderValidation success!");
        }
        else {
            throw new Error("Statuses available: ordered, inprogress, realized, bill!");
        }
}


// Get by id
export function getOrderByIDValidation(id: number): void {
  if (!id) {
    throw new Error("You need to send ID!");
  }

  console.log('getOrderByIDValidation success!');
}

// Put by id
export function editOrderByIDValidation(data: any, id: number): void {
  if(!data) {
    throw new Error("You need to send new data to update existing order!");
  }
  if (!id) {
    throw new Error("You need to send ID!");
  }

  console.log('editOrderByIDValidation success!');
}

// Delete by id
export function deleteOrderByIDValidation(id: number): void {
  if (!id) {
    throw new Error("You need to send ID!");
  }

  console.log('deleteOrderByIDValidation success!');
}
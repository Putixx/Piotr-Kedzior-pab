/* IMPORT */



/* FUNCTIONS */

// Create new table
export function createTableValidation(data: any): void {
    if (!data) {
        throw new Error("To register a new table you need to send it's: name, number of place settings and status!");
      }
      if (!data.name) {
        throw new Error("Name is missing!");
      }
      if (!data.numPlaces) {
        throw new Error("Number of place settings is missing!");
      }
      if (!data.status) {
        throw new Error("Status is missing!");
      }
      if(data.status === 'free' || data.status === 'taken' || data.status === 'unavailable') {
        console.log("createRezervationValidation success!");
      }
      else {
        throw new Error("Statuses available: free, taken, unavailable!");
      }
}

// GET registered table by id
export function getTableByIDValidation(id: number): void {
    if (!id) {
        throw new Error("You need to send ID!");
      }
      
      console.log("getTableByIDValidation success!");
}

// edit registered table by id
export function editTableByIDValidation(data: any, id: number): void {
    if(!data) {
        throw new Error("You need to send new data to update existing table!");
      }
    if (!id) {
        throw new Error("You need to send ID!");
      }
      
      console.log("editTableByIDValidation success!");
}

// delete registered table by id
export function deleteTableByIDValidation(id: number): void {
    if (!id) {
        throw new Error("You need to send ID!");
      }
      
      console.log("deleteTableByIDValidation success!");
}
/* IMPORT */



/* FUNCTIONS */

// Create new rezervation
export function createRezervationValidation(data: any): void {
    if (!data) {
        throw new Error("To register a new rezervation you need to send it's: table, start time, end time and client!");
      }
      if (!data.table) {
        throw new Error("Table is missing!");
      }
      if (!data.start) {
        throw new Error("Start time is missing!");
      }
      if (!data.end) {
        throw new Error("End time is missing!");
      }
      if (!data.client) {
        throw new Error("Client data is missing!");
      }
      
    console.log("createRezervationValidation success!");
}

// GET registered rezervation by id
export function getRezervationByIDValidation(id: number): void {
    if (!id) {
        throw new Error("You need to send ID!");
      }
      
    console.log("getRezervationValidation success!");
}

// EDIT registered rezervation by id
export function editRezervationByIDValidation(data: any, id: number): void {
    if(!data) {
        throw new Error("You need to send new data to update existing rezervation!");
      }
    if (!id) {
        throw new Error("You need to send ID!");
      }
      
    console.log("editRezervationByIDValidation success!");
}

// delete registered rezervation by id
export function deleteRezervationByIDValidation(id: number): void {
    if (!id) {
        throw new Error("You need to send ID!");
      }
      
    console.log("deleteRezervationByIDValidation success!");
}
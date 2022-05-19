/* IMPORT */



/* FUNCTIONS */

// Create new worker
export function createWorkerValidation(data: any): void {
    if (!data) {
        throw new Error("To register a new worker you need to send it's: name, surname and occupation!");
      }
      if (!data.name) {
        throw new Error("Name is missing!");
      }
      if (!data.surname) {
        throw new Error("Surname is missing!");
      }
      if (!data.occupation) {
        throw new Error("Occupation is missing!");
      }
      
    console.log("createWorkerValidation success!");
}

// GET registered worker by id
export function getWorkerByIDValidation(id: number): void {
    if(!id) {
        throw new Error("You need to send ID!");
    }
        
    console.log("getWorkerByIDValidation success!");
}

// EDIT registered worker by id
export function editWorkerByIDValidation(data: any, id: number): void {
    if(!data) {
        throw new Error("You need to send new data to update existing worker!");
      }
    if(!id) {
        throw new Error("You need to send ID!");
    }
        
    console.log("editWorkerByIDValidation success!");
}

// DELETE registered worker by id
export function deleteWorkerByIDValidation(id: number): void {
    if(!id) {
        throw new Error("You need to send ID!");
    }
        
    console.log("deleteWorkerByIDValidation success!");
}
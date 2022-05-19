/* IMPORT */



/* FUNCTIONS */

// Create new restaurant
export function createRestaurantValidation(data: any): void {
    if (!data) {
        throw new Error("To register a new restaurant you need to send it's: name, address, phone, nip, email and www!");
      }
      if (!data.name) {
        throw new Error("Name is missing!");
      }
      if (!data.address) {
        throw new Error("Address is missing!");
      }
      if (!data.phone) {
        throw new Error("Phone number is missing!");
      }
      if (!data.nip) {
        throw new Error("NIP number is missing!");
      }
      if (!data.email) {
        throw new Error("E-mail is missing!");
      }
      if (!data.www) {
        throw new Error("Website url is missing!");
      }

      console.log('reportPerWorkerValidation success!');
}

// GET registered restaurants with same name
export function getRestaurantByNameValidation(name: string): void {
    if (!name) {
        throw new Error("You need to send restaurant name!");
      }

      console.log('getRestaurantByNameValidation success!');
}

// GET registered restaurant by id
export function getRestaurantByIDValidation(id: number): void {
    if (!id) {
        throw new Error("You need to send restaurant ID!");
      }

      console.log('getRestaurantByIDValidation success!');
}

// EDIT registered restaurant by id
export function editRestaurantByIDValidation(data: any, id: number): void {
    if(!data) {
        throw new Error("You need to send new data to update existing restaurant!");
      }
    if (!id) {
        throw new Error("You need to send restaurant ID!");
      }

      console.log('editRestaurantByIDValidation success!');
}

// delete registered restaurant by id
export function deleteRestaurantByIDValidation(id: number): void {
    if (!id) {
        throw new Error("You need to send restaurant ID!");
      }

      console.log('deleteRestaurantByIDValidation success!');
}
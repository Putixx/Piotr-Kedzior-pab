/* IMPORT */



/* FUNCTIONS */

// Create new product
export function createProductValidation(data: any): void {
    if (!data) {
        throw new Error("To register a new product you need to send it's: name, price, quantity and unit of measure!");
      }
      if (!data.name) {
        throw new Error("Name is missing!");
      }
      if (!data.price) {
        throw new Error("Price is missing!");
      }
      if (!data.quantity) {
        throw new Error("Quantity is missing!");
      }
      if (!data.unitOfMeasure) {
        throw new Error("Unit of measure is missing!");
      }
      if(data.unitOfMeasure === 'g' || data.unitOfMeasure === 'dg' || data.unitOfMeasure === 'kg' || data.unitOfMeasure === 't') {
        
        console.log("createProductValidation success!");
      }
      else {
        throw new Error("Units of measure available: g, dg, kg, t!");
      }
}

// Create need product
export function createNeedProductValidation(data: any): void {
    if (!data) {
        throw new Error("To register a new product you need to send it's: name, price, quantity and unit of measure!");
      }
      if (!data.name) {
        throw new Error("Name is missing!");
      }
      if (!data.price) {
        throw new Error("Price is missing!");
      }
      if (!data.quantity) {
        throw new Error("Quantity is missing!");
      }
      if (!data.unitOfMeasure) {
        throw new Error("Unit of measure is missing!");
      }
      if(data.unitOfMeasure === 'g' || data.unitOfMeasure === 'dg' || data.unitOfMeasure === 'kg' || data.unitOfMeasure === 't') {
        
        console.log("createNeedProductValidation success!");
      }
      else {
        throw new Error("Units of measure available: g, dg, kg, t!");
      }
}

// GET registered products in sorted order by param
export function getSortedProductsValidation(sort: string): void {
    if(!sort) {
        throw new Error("Sort param needed! Possible: ID, name, price, quantity");
    }
        
    console.log("getSortedProductsValidation success!");
}

// GET registered product by id
export function getProductByIDValidation(id: number): void {
    if(!id) {
        throw new Error("You need to send ID!");
    }
        
    console.log("getProductByIDValidation success!");
}

// GET registered products in sorted order by param
export function editProductByIDValidation(data: any, id: number): void {
    if(!data) {
        throw new Error("You need to send new data to update existing product!");
      }
    if(!id) {
        throw new Error("You need to send ID!");
    }
        
    console.log("editProductByIDValidation success!");
}

// DELETE registered product by id
export function deleteProductByIDValidation(id: number): void {
    if(!id) {
        throw new Error("You need to send ID!");
    }
        
    console.log("deleteProductByIDValidation success!");
}
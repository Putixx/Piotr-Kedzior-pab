/* IMPORT */

import { Product } from "../models/productModel";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new product
export async function createProduct(data: Product): Promise<JSON> {
    const newProduct = new Product(data);
    const savedProducts: Product[] = JSON.parse(await readStorage('./data/products.json')) ?? [];

    if(savedProducts.find(p => p.name === newProduct.name && p.price === newProduct.price && p.quantity === newProduct.quantity && p.unitOfMeasure === newProduct.unitOfMeasure)) {
        throw new Error("Current product is already registered!");
    }

    savedProducts.push(newProduct);
    await updateStorage('./data/products.json', JSON.stringify(savedProducts));
    return JSON.parse(JSON.stringify(newProduct));
}

// Create new product needed
export async function createProductNeed(data: Product): Promise<number> {
    const newProduct = new Product(data);
    const savedProducts: Product[] = JSON.parse(await readStorage('./data/productsToOrder.json')) ?? [];

    savedProducts.push(newProduct);
    await updateStorage('./data/productsToOrder.json', JSON.stringify(savedProducts));
    return JSON.parse(JSON.stringify(newProduct));
}

// Read all products
export async function readAllProducts(): Promise<JSON> {
    const savedProducts: Product[] = JSON.parse(await readStorage('./data/products.json')) ?? [];

    if(savedProducts.length < 1) {
      throw new Error("There are no products!");
    }
    
    return JSON.parse(JSON.stringify(savedProducts));
}

// Read all products sorted by param
export async function readAllProductsSorted(sortOrder: string): Promise<string> {
    const savedProducts: Product[] = JSON.parse(await readStorage('./data/products.json')) ?? [];
  
    if(savedProducts.length < 1) {
      throw new Error("There are no products!");
    }

    if(sortOrder.toLocaleLowerCase() === 'id') {
        savedProducts.sort((p1, p2) => 
        {
            if(p1.id > p2.id) {
                return 1;
            }
            if(p1.id < p2.id) {
                return -1;
            }
            return 0;
        });
    }

    if(sortOrder.toLocaleLowerCase() === 'name') {
        savedProducts.sort((p1, p2) => 
        {
            if(p1.name > p2.name) {
                return 1;
            }
            if(p1.name < p2.name) {
                return -1;
            }
            return 0;
        });
    }

    if(sortOrder.toLocaleLowerCase() === 'price') {
        savedProducts.sort((p1, p2) => 
        {
            if(p1.price > p2.price) {
                return 1;
            }
            if(p1.price < p2.price) {
                return -1;
            }
            return 0;
        });
    }

    if(sortOrder.toLocaleLowerCase() === 'quantity') {
        savedProducts.sort((p1, p2) => 
        {
            if(p1.quantity > p2.quantity) {
                return 1;
            }
            if(p1.quantity < p2.quantity) {
                return -1;
            }
            return 0;
        });
    }

    return JSON.parse(JSON.stringify(savedProducts));
}

// Read product specified by ID
export async function readProduct(searchID: number): Promise<JSON> {
    const savedProducts: Product[] = JSON.parse(await readStorage('./data/products.json')) ?? [];

    if(savedProducts.length < 1) {
        throw new Error("There are no products!");
    }

    const productIndex = savedProducts.findIndex(p => p.id === searchID)

    if(productIndex === -1) {
        throw new Error("Wrong ID!");
    }

    return JSON.parse(JSON.stringify(savedProducts[productIndex]));
}

// Update existing product specified by ID
export async function updateProduct(data: Product, searchID: number): Promise<JSON> {
    const savedProducts: Product[] = JSON.parse(await readStorage('./data/products.json')) ?? [];

    if(savedProducts.length < 1) {
        throw new Error("There are no products!");
    }

    const productIndex = savedProducts.findIndex(p => p.id === searchID)

    if(productIndex === -1) {
        throw new Error("Wrong ID!");
    }

    if(data.name) {
        savedProducts[productIndex].name = data.name;
    }
    if(data.price) {
        savedProducts[productIndex].price = data.price;
    }
    if(data.quantity) {
        savedProducts[productIndex].quantity = data.quantity;
    }
    if(data.unitOfMeasure) {
        savedProducts[productIndex].unitOfMeasure = data.unitOfMeasure;
    }
    
    await updateStorage('./data/products.json', JSON.stringify(savedProducts));
    return JSON.parse(JSON.stringify(savedProducts[productIndex]));
}

// Delete existing product specified by ID
export async function deleteProduct(searchID: number): Promise<void> {
    const savedProducts: Product[] = JSON.parse(await readStorage('./data/products.json')) ?? [];

    if(savedProducts.length < 1) {
        throw new Error("There are no products!");
    }

    const productIndex = savedProducts.findIndex(p => p.id === searchID)

    if(productIndex === -1) {
        throw new Error("Wrong ID!");
    }

    const deletedProduct = savedProducts[productIndex];
    savedProducts.splice(productIndex, 1);
    await updateStorage('./data/products.json', JSON.stringify(savedProducts));
    return JSON.parse(JSON.stringify(deletedProduct));
}
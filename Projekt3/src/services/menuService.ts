/* IMPORT */

import { Meal } from "../models/mealModel";
import { Product, UnitOfMeasure } from "../models/productModel";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new meal
export async function createMeal(data: Meal): Promise<JSON> {
    const newMeal = new Meal(data);
    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];
    const savedProducts: Product[] = JSON.parse(await readStorage('./data/products.json')) ?? [];

    if(!savedProducts.find(p => p.name === newMeal.name &&  p.price === newMeal.price && p.quantity > 0)) {
      const savedProduct = savedProducts.find(p => p.name === newMeal.name &&  p.price === newMeal.price && p.quantity === 0);
      if(savedProduct) {
        const savedProductsToOrder: Product[] = JSON.parse(await readStorage('./data/productsToOrder.json')) ?? [];
        savedProduct.quantity = 10;
        if(savedProductsToOrder.find(p => p.name === newMeal.name &&  p.price === newMeal.price && p.quantity === 10) !== savedProduct) {
          savedProductsToOrder.push(savedProduct);
          await updateStorage('./data/productsToOrder.json', JSON.stringify(savedProductsToOrder));
          return JSON.parse(JSON.stringify(savedProduct));
        }
        else {
          const productIndex = savedProductsToOrder.findIndex(p => p.name === newMeal.name &&  p.price === newMeal.price && p.quantity === 10);
          if(productIndex !== -1) {
            savedProductsToOrder[productIndex].quantity += 10;
            await updateStorage('./data/productsToOrder.json', JSON.stringify(savedProductsToOrder));
            return JSON.parse(JSON.stringify(savedProductsToOrder[productIndex]));
          }
        }
      }
      else {
        const newProductToOrder = {
          id: Date.now(),
          name: data.name,
          price: data.price,
          quantity: 10,
          unitOfMeasure: UnitOfMeasure['kilogram']
        }
        
        const savedProductsToOrder: Product[] = JSON.parse(await readStorage('./data/productsToOrder.json')) ?? [];

        if(!savedProductsToOrder.find(p => p.name === newProductToOrder.name &&  p.price === newProductToOrder.price && p.quantity === 10)) {
          savedProductsToOrder.push(newProductToOrder);
          await updateStorage('./data/productsToOrder.json', JSON.stringify(savedProductsToOrder));
          return JSON.parse(JSON.stringify(newProductToOrder));
        }
        else {
          const productIndex = savedProductsToOrder.findIndex(p => p.name === newMeal.name &&  p.price === newMeal.price && p.quantity === 10);
          if(productIndex !== -1) {
            savedProductsToOrder[productIndex].quantity += 10;
            await updateStorage('./data/productsToOrder.json', JSON.stringify(savedProductsToOrder));
            return JSON.parse(JSON.stringify(savedProductsToOrder[productIndex]));
          }
        }
      }
    }
    
      if(savedMeals.find(m => m.name === newMeal.name &&  m.price === newMeal.price &&  m.category === newMeal.category)) {
        throw new Error("Current meal is already registered!");
    }

    savedMeals.push(newMeal);
    await updateStorage('./data/menu.json', JSON.stringify(savedMeals));
    return JSON.parse(JSON.stringify(newMeal));
}

// Read whole menu
export async function readMenu(): Promise<JSON> {
    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

    if(savedMeals.length < 1) {
      throw new Error("There are no meals in menu!");
    }

    return JSON.parse(JSON.stringify(savedMeals));
}

// Read existing meal from menu specified by ID
export async function readMeal(searchID: number): Promise<JSON> {
    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

    if(savedMeals.length < 1) {
      throw new Error("There are no meals in menu!");
    }
  
    const mealIndex = savedMeals.findIndex(m => m.id === searchID)
  
    if(mealIndex === -1) {
      throw new Error("Wrong ID!");
    }

    return JSON.parse(JSON.stringify(savedMeals[mealIndex]));
}

// Update existing meal from menu specified by ID
export async function updateMeal(searchID: number, data: Meal): Promise<JSON> {
    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

    if(savedMeals.length < 1) {
         throw new Error("There are no meals in menu!");
    }
  
    const mealIndex = savedMeals.findIndex(r => r.id === searchID)
  
    if(mealIndex === -1) {
        throw new Error("Wrong ID!");
    }
  
    if(data.name) {
      savedMeals[mealIndex].name = data.name;
    }
    if(data.price) {
      savedMeals[mealIndex].price = data.price;
    }
    if(data.category) {
      savedMeals[mealIndex].category = data.category;
    }
  
    await updateStorage('./data/menu.json', JSON.stringify(savedMeals));
    return JSON.parse(JSON.stringify(savedMeals[mealIndex]));
}

// Delete existing meal from menu specified by ID
export async function deleteMeal(searchID: number): Promise<JSON> {
    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

  if(savedMeals.length < 1) {
    throw new Error("There are no meals in menu!");
  }

  const mealIndex = savedMeals.findIndex(m => m.id === searchID)

  if(mealIndex === -1) {
    throw new Error("Wrong ID!");
  }
  const deletedMeal = savedMeals[mealIndex];
  savedMeals.splice(mealIndex, 1);
  await updateStorage('./data/menu.json', JSON.stringify(savedMeals));
  return JSON.parse(JSON.stringify(deletedMeal));
}
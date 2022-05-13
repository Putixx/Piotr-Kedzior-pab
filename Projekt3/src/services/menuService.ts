/* IMPORT */

import { Meal } from "../models/mealModel";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new meal
export async function createMeal(data: Meal): Promise<number> {
    const newMeal = new Meal(data);
    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

    if(savedMeals.find(m => m.name === newMeal.name &&  m.price === newMeal.price &&  m.category === newMeal.category)) {
        throw new Error("Current meal is already registered!");
    }

    savedMeals.push(newMeal);
    await updateStorage('./data/menu.json', JSON.stringify(savedMeals));

    return newMeal.id;
}

// Read whole menu
export async function readMenu(): Promise<string> {
    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

    if(savedMeals.length < 1) {
      throw new Error("There are no meals in menu!");
    }
  
    let print = "";
  
    for(let i = 0; i < savedMeals.length; i++) {
      print += "ID: " + savedMeals[i].id + " Name: " + savedMeals[i].name + " Price: " + savedMeals[i].price 
      + " Category: " + savedMeals[i].category + "\n";
    }

    return print;
}

// Read existing meal from menu specified by ID
export async function readMeal(searchID: number): Promise<string> {
    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

    if(savedMeals.length < 1) {
      throw new Error("There are no meals in menu!");
    }
  
    const mealIndex = savedMeals.findIndex(m => m.id === searchID)
  
    if(mealIndex === -1) {
      throw new Error("Wrong ID!");
    }
  
    const print = "ID: " + savedMeals[mealIndex].id + " Name: " + savedMeals[mealIndex].name + " Price: " + savedMeals[mealIndex].price 
    + " Category: " + savedMeals[mealIndex].category + "\n";

    return print;
}

// Update existing meal from menu specified by ID
export async function updateMeal(searchID: number, data: Meal): Promise<string> {
    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

    if(savedMeals.length < 1) {
         throw new Error("There are no meals in menu!");
    }
  
    const mealIndex = savedMeals.findIndex(r => r.id === searchID)
  
    if(mealIndex === -1) {
        throw new Error("Wrong ID!");
    }
  
    const printOld = "ID: " + savedMeals[mealIndex].id + " Name: " + savedMeals[mealIndex].name + " Price: " + savedMeals[mealIndex].price 
    + " Category: " + savedMeals[mealIndex].category + "\n";
  
    if(data.name) {
      savedMeals[mealIndex].name = data.name;
    }
    if(data.price) {
      savedMeals[mealIndex].price = data.price;
    }
    if(data.category) {
      savedMeals[mealIndex].category = data.category;
    }
    
    const printNew = "ID: " + savedMeals[mealIndex].id + " Name: " + savedMeals[mealIndex].name + " Price: " + savedMeals[mealIndex].price 
    + " Category: " + savedMeals[mealIndex].category + "\n";
  
    await updateStorage('./data/menu.json', JSON.stringify(savedMeals));
    return printOld + printNew
}

// Delete existing meal from menu specified by ID
export async function deleteMeal(searchID: number): Promise<void> {
    const savedMeals: Meal[] = JSON.parse(await readStorage('./data/menu.json')) ?? [];

  if(savedMeals.length < 1) {
    throw new Error("There are no meals in menu!");
  }

  const mealIndex = savedMeals.findIndex(m => m.id === searchID)

  if(mealIndex === -1) {
    throw new Error("Wrong ID!");
  }

  savedMeals.splice(mealIndex, 1);
  await updateStorage('./data/menu.json', JSON.stringify(savedMeals));
}
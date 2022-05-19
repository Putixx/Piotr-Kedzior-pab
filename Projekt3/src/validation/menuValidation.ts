/* IMPORT */

import { Meal } from "../models/mealModel";

/* FUNCTIONS */

// Create new meal
export function createMealValidation(data: Meal): void {
    if (!data) {
        throw new Error("To register a new meal you need to send it's: name, price, and category!");
      }
      else if (!data.name) {
        throw new Error("Name is missing!");
      }
      else if (!data.price) {
        throw new Error("Price is missing!");
      }
      else if (!data.category) {
        throw new Error("Category is missing!");
      }
      else {
        console.log("Meal validation succeded!");
      }
}

// Get by id
export function getMealByIDValidation(id: number): void {
  if (!id) {
    throw new Error("You need to send ID!");
  }

  console.log("getMealByIDValidation success!");
}

// Put by id
export function editMealByIDValidation(data: any, id: number): void {
  if(!data) {
    throw new Error("You need to send new data to update existing meal!");
  }
  if (!id) {
    throw new Error("You need to send ID!");
  }

  console.log("editMealByIDValidation success!");
}

// Delete by id
export function deleteMealByIDValidation(id: number): void {
  if (!id) {
    throw new Error("You need to send ID!");
  }

  console.log("deleteMealByIDValidation success!");
}
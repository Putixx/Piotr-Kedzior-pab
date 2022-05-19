/* IMPORT */


/* FUNCTIONS */

// Create new meal
export function createMealValidation(data: any): string {
    if (!data) {
        return "To register a new meal you need to send it's: name, price, and category!";
      }
      if (!data.name) {
        return "Name is missing!";
      }
      if (!data.price) {
        return "Price time is missing!";
      }
      if (!data.category) {
        return "Category is missing!";
      }

    return "New meal registration succeded! It's ID: ";
}
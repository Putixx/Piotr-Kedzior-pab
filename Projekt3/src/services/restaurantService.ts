/* IMPORT */

import { Restaurant } from "../models/restaurantModel";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new restaurant
export async function createRestaurant(data: Restaurant): Promise<JSON> {
    const newRestaurant: Restaurant = new Restaurant(data); 
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];
  
    if(savedRestaurants.find(r => r.address === newRestaurant.address)) {
      throw new Error("Current address is already taken!");
    }
  
    savedRestaurants.push(newRestaurant);
    await updateStorage('./data/restaurants.json', JSON.stringify(savedRestaurants));

    return JSON.parse(JSON.stringify(newRestaurant));
}

// Read all restaurants with specific name
export async function readRestaurantsByName(name: string): Promise<JSON> {
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];

    if(savedRestaurants.length < 1) {
      throw new Error("There are no such restaurants!");
    }
  
    const specificRestaurants = savedRestaurants.filter(r => r.name === name)
  
    if(!specificRestaurants) {
        throw new Error("There are no such restaurants!");
    }

    return JSON.parse(JSON.stringify(specificRestaurants));
}

// Read restaurant specified by ID
export async function readRestaurant(searchID: number): Promise<JSON> {
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    throw new Error("There is no such restaurant!");
  }

  const specificRestaurant = savedRestaurants.find(r => r.id === searchID)

  if(specificRestaurant) {
    return JSON.parse(JSON.stringify(specificRestaurant));
  }
  else {
    throw new Error("There is no such restaurant!");
  }
}

// Read all restaurants
export async function readAllRestaurants(): Promise<JSON> {
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];

    if(savedRestaurants.length < 1) {
        throw new Error("There are no restaurants!");
    }

    return JSON.parse(JSON.stringify(savedRestaurants));
}

// Update existing restaurant specified by ID
export async function updateRestaurant(data: Restaurant, searchID: number): Promise<string> {
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];

    if(savedRestaurants.length < 1) {
        throw new Error("There are no restaurants!");
    }

    const restaurantIndex = savedRestaurants.findIndex(r => r.id === searchID)

    if(restaurantIndex === -1) {
        throw new Error("Wrong ID!");
    }

    if(data.name) {
        savedRestaurants[restaurantIndex].name = data.name;
    }
    if(data.address) {
        savedRestaurants[restaurantIndex].address = data.address;
    }
    if(data.phone) {
        savedRestaurants[restaurantIndex].phone = data.phone;
    }
    if(data.nip) {
        savedRestaurants[restaurantIndex].nip = data.nip;
    }
    if(data.email) {
        savedRestaurants[restaurantIndex].email = data.email;
    }
    if(data.www) {
        savedRestaurants[restaurantIndex].www = data.www;
    }

    await updateStorage('./data/restaurants.json', JSON.stringify(savedRestaurants));
    return JSON.parse(JSON.stringify(savedRestaurants[restaurantIndex]));
}

// Delete restaurant specified by ID
export async function deleteRestaurant(searchID: number): Promise<JSON> {
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];

    if(savedRestaurants.length < 1) {
      throw new Error("There are no restaurants!");
    }

    const restaurantIndex = savedRestaurants.findIndex(r => r.id === searchID)

    if(restaurantIndex === -1) {
      throw new Error("Wrong ID!");
    }

    const deletedRestaurant = savedRestaurants[restaurantIndex];
    savedRestaurants.splice(restaurantIndex, 1);
    await updateStorage('./data/restaurants.json', JSON.stringify(savedRestaurants));
    return JSON.parse(JSON.stringify(deletedRestaurant));
}
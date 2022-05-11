/* IMPORT */

import { Restaurant } from "../models/Restaurant";
import { readStorage, updateStorage } from "../services/storageService";

/* FUNCTIONS */

// Create new restaurant
export async function createRestaurant(data: Restaurant): Promise<number> {
    const newRestaurant: Restaurant = new Restaurant(data); 
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];
  
    if(savedRestaurants.find(r => r.address === newRestaurant.address)) {
      throw new Error("Current address is already taken!");
    }
  
    savedRestaurants.push(newRestaurant);
    await updateStorage('./data/restaurants.json', JSON.stringify(savedRestaurants));

    return newRestaurant.id;
}

// Read all restaurants with specific name
export async function readRestaurantsByName(name: string): Promise<string> {
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];

    if(savedRestaurants.length < 1) {
      throw new Error("There are no such restaurants!");
    }
  
    const specificRestaurants = savedRestaurants.filter(r => r.name === name)
  
    if(!specificRestaurants) {
        throw new Error("There are no such restaurants!");
    }
  
    let print = "";
  
    for(let i = 0; i < specificRestaurants.length; i++) {
      print += "ID: " + specificRestaurants[i].id + " Name: " + specificRestaurants[i].name + " Address: " + specificRestaurants[i].address 
      + " Phone: " + specificRestaurants[i].phone  + " NIP: " + specificRestaurants[i].nip + " E-mail: " + specificRestaurants[i].email 
      + " Website: " + specificRestaurants[i].www + "\n";
    }

    return print;
}

// Read restaurant specified by ID
export async function readRestaurant(searchID: number): Promise<string> {
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];

  if(savedRestaurants.length < 1) {
    throw new Error("There is no such restaurant!");
  }

  const specificRestaurant = savedRestaurants.find(r => r.id === searchID)

  if(specificRestaurant) {
    const print = "ID: " + specificRestaurant.id + " Name: " + specificRestaurant.name + " Address: " + specificRestaurant.address 
    + " Phone: " + specificRestaurant.phone  + " NIP: " + specificRestaurant.nip + " E-mail: " + specificRestaurant.email 
    + " Website: " + specificRestaurant.www + "\n";
  
    return print;
  }
  else {
    throw new Error("There is no such restaurant!");
  }
}

// Read all restaurants
export async function readAllRestaurants(): Promise<string> {
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];

    if(savedRestaurants.length < 1) {
        throw new Error("There are no restaurants!");
    }

    let print = "";

    for(let i = 0; i < savedRestaurants.length; i++) {
        print += "ID: " + savedRestaurants[i].id + " Name: " + savedRestaurants[i].name + " Address: " + savedRestaurants[i].address 
        + " Phone: " + savedRestaurants[i].phone  + " NIP: " + savedRestaurants[i].nip + " E-mail: " + savedRestaurants[i].email 
        + " Website: " + savedRestaurants[i].www + "\n";
    }

    return print;
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

    const printOld = "ID: " + savedRestaurants[restaurantIndex].id + " Name: " + savedRestaurants[restaurantIndex].name + " Address: " 
    + savedRestaurants[restaurantIndex].address + " Phone: " + savedRestaurants[restaurantIndex].phone + " NIP: " 
    + savedRestaurants[restaurantIndex].nip + " E-mail: " + savedRestaurants[restaurantIndex].email + " Website: " + savedRestaurants[restaurantIndex].www + "\n";

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


    const printNew = "ID: " + savedRestaurants[restaurantIndex].id + " Name: " + savedRestaurants[restaurantIndex].name 
    + " Address: " + savedRestaurants[restaurantIndex].address + " Phone: " + savedRestaurants[restaurantIndex].phone 
    + " NIP: " + savedRestaurants[restaurantIndex].nip + " E-mail: " + savedRestaurants[restaurantIndex].email + " Website: " + savedRestaurants[restaurantIndex].www + "\n";

    await updateStorage('./data/restaurants.json', JSON.stringify(savedRestaurants));
    return printOld + printNew;
}

// Delete restaurant specified by ID
export async function deleteRestaurant(searchID: number): Promise<void> {
    const savedRestaurants: Restaurant[] = JSON.parse(await readStorage('./data/restaurants.json')) ?? [];

    if(savedRestaurants.length < 1) {
      throw new Error("There are no restaurants!");
    }

    const restaurantIndex = savedRestaurants.findIndex(r => r.id === searchID)

    if(restaurantIndex === -1) {
      throw new Error("Wrong ID!");
    }

    savedRestaurants.splice(restaurantIndex, 1);
    await updateStorage('./data/restaurants.json', JSON.stringify(savedRestaurants));
}
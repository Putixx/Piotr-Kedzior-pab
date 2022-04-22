/* IMPORT BEG */

import jwt from 'jsonwebtoken'
import {
    readStorage,
    updateStorage
} from '../services/storageService'
import {
    User
} from '../models/user'

/* IMPORT END */

/* EXPORT BEG */

export {
    isRegistered,
    addNewUser,
    authLoggedUser
};

/* EXPORT END */

// checks if user is already in storage file
async function isRegistered(data: any): Promise < boolean > {
    const usersSaved: User[] = JSON.parse(await readStorage('data/users.json'));
    if (usersSaved.some(u => u.login === data.login && u.password === data.password)) {
        return true;
    } else {
        return false;
    }
}

// adds new user to storage file
async function addNewUser(data: any): Promise < void > {
    const usersSaved: User[] = JSON.parse(await readStorage('data/users.json')) ?? [];

    const userCurrent = {
        id: Date.now(),
        login: data.login,
        password: data.password,
        notesIDs: [data.notesIDs],
        tagsIDs: [data.tagsIDs]
    }
    usersSaved.push(userCurrent);
    updateStorage('data/users.json', JSON.stringify(usersSaved));

}

//gets newly added user id
async function getNewUserID(data: any): Promise < number > {
    const usersSaved: User[] = JSON.parse(await readStorage('data/users.json'));
    return usersSaved.findIndex(u => u.login === data.login && u.password === data.password)
}

//authorize logged user
async function authLoggedUser(data: any, secret: string): Promise < string > {
    const id = getNewUserID(data);
    const payload = id.toString() ?? ''
    const token = jwt.sign(payload, secret);
    return 'Bearer ' + token;
}
/* IMPORT BEG */

import jwt from 'jsonwebtoken'
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
async function isRegistered(data: any, storageOption: any): Promise < boolean > {
    const usersSaved: User[] = JSON.parse((await storageOption.readStorage()).toString());

    if (usersSaved.some(u => u.login === data.login && u.password === data.password)) {
        return true;
    } else {
        return false;
    }
}

// adds new user to storage file
async function addNewUser(data: any, storageOption: any): Promise < void > {
    const usersSaved: User[] = JSON.parse((await storageOption.readStorage()).toString());

    const userCurrent = {
        id: Date.now(),
        login: data.login,
        password: data.password,
        notes: [data.notes],
        tags: [data.tags]
    }
    usersSaved.push(userCurrent);
    storageOption.updateStorage(usersSaved);
}

//gets newly added user id
async function getNewUserID(data: any, storageOption: any): Promise < number > {
    const usersSaved: User[] = JSON.parse((await storageOption.readStorage()).toString());
    return usersSaved.findIndex(u => u.login === data.login && u.password === data.password)
}

//authorize logged user
async function authLoggedUser(data: any, secret: string, storageOption: any): Promise < string > {
    const id = getNewUserID(data, storageOption);
    const payload = id.toString() ?? ''
    const token = jwt.sign(payload, secret);
    return 'Bearer ' + token;
}
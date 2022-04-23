/* IMPORT BEG */

import {
  Tag
} from '../models/tag'
import { User } from '../models/user';

/* IMPORT END */

/* EXPORT BEG */

export {
  addNewTag,
  tagExists
};

/* EXPORT END */

// adds new tag to storage file
async function addNewTag(data: any, userID: any, storageOption: any): Promise < void > {
  const usersSaved: User[] = JSON.parse(await storageOption.readStorage());
  const ind = usersSaved.findIndex(u => u.id === userID);

    const tag: Tag = ({
        id: Date.now(),
        name: data.name
    });

    usersSaved[ind].tags.push(tag);
    storageOption.updateStorage(usersSaved);
}

// checks if given tag already exists
async function tagExists(data: any, storageOption: any): Promise < boolean > {
  const usersSaved: User[] = JSON.parse(await storageOption.readStorage());
  let isInArray = false;

  for(let i = 0; i < usersSaved.length; i++)
  {
    for(let j = 0; j < usersSaved[i].tags.length; j++)
    {
      if(usersSaved[i].tags[j].name.toLocaleLowerCase() === data.name.toLowerCase()) {
        isInArray = true;
      }
    }
  }
  
  return isInArray;
}
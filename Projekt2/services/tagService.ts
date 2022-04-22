/* IMPORT BEG */

import {
  readStorage,
  updateStorage
} from '../services/storageService'
import {
  Tag
} from '../models/tag'

/* IMPORT END */

/* EXPORT BEG */

export {
  addNewTag,
  tagExists
};

/* EXPORT END */

// adds new tag to storage file
async function addNewTag(data: any): Promise < void > {
  const tagsSaved: Tag[] = JSON.parse(await readStorage('data/tags.json')) ?? [];

  tagsSaved.push({
    id: Date.now(),
    name: data.name
  });
  updateStorage('data/tags.json', JSON.stringify(tagsSaved))
}

// checks if given tag already exists
async function tagExists(data: any): Promise < boolean > {
  const tagsSaved: Tag[] = JSON.parse(await readStorage('data/tags.json')) ?? [];

  if (tagsSaved.some(t => t.name.toLowerCase() === data.name.toLowerCase())) {
    return true;
  }
  return false;
}
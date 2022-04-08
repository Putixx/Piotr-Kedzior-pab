import fs from 'fs';
export {readStorage, updateStorage};

/* FILE ASYNC READ/WRITE BEG */

// FILE ASYNC READ
async function readStorage(storeFile: string): Promise < string > {
    return fs.promises.readFile(storeFile, 'utf-8');
  }
  
  // FILE ASYNC WRITE
  async function updateStorage(storeFile: string, dataToSave: string): Promise < void > {
    try {
      await fs.promises.writeFile(storeFile, dataToSave);
    } catch (err) {
      console.log(err)
    }
  }
  
  /* FILE ASYNC READ/WRITE END */
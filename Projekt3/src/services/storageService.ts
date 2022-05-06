import fs from 'fs';

/* FILE ASYNC READ/WRITE BEG */

// FILE ASYNC READ
export async function readStorage(storeFile: string): Promise < string > {
    return fs.promises.readFile(storeFile, 'utf-8');
}

// FILE ASYNC WRITE
export async function updateStorage(storeFile: string, dataToSave: string): Promise < void > {
    try {
        await fs.promises.writeFile(storeFile, dataToSave);
    } catch (err) {
        console.log(err)
    }
}
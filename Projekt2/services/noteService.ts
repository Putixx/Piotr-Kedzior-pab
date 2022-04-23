/* IMPORT BEG */

import {
    Note
} from '../models/note'
import { User } from '../models/user';

/* IMPORT END */

/* EXPORT BEG */

export {
    addNewNote,
    //editNote
};

/* EXPORT END */

// adds new note to storage file
async function addNewNote(data: any, userID: any, storageOption: any): Promise < void > {
    const usersSaved: User[] = JSON.parse(await storageOption.readStorage());
    const ind = usersSaved.findIndex(u => u.id === userID);

    const note: Note = ({
        id: Date.now(),
        title: data.title,
        content: data.content,
        createDate: new Date(),
        isPrivate: data.isPrivate,
        tags: [data.tags]
    });

    usersSaved[ind].notes.push(note);
    storageOption.updateStorage(usersSaved);
}

// edits existing note in storage file
// function editNote(noteID: number, userID: any, dataNew: any, notesSaved: Note[], storageOption: any): string {
//     if (noteID !== -1) {
//         const tempNote = {
//             ...notesSaved[noteID]
//         };

//         if (dataNew.title) {
//             notesSaved[ind].title = dataNew.title;
//         }
//         if (dataNew.content) {
//             notesSaved[ind].content = dataNew.content;
//         }
//         if (dataNew.tags) {
//             notesSaved[ind].tags = dataNew.tags;
//         }

//         storageOption.updateStorage('data/notes.json', JSON.stringify(notesSaved))
//         const printOld = 'Notatka przed edycją: ID: ' + tempNote.id + ' Tytuł: ' + tempNote.title + ' Zawartość: ' + tempNote.content + ' Data utworzenia: ' + tempNote.createDate + ' Tagi: ' + tempNote.tags + '\n';
//         const printNew = 'Notatka po edycji: ID: ' + notesSaved[ind].id + ' Tytuł: ' + notesSaved[ind].title + ' Zawartość: ' + notesSaved[ind].content + ' Data utworzenia: ' + notesSaved[ind].createDate + ' Tagi: ' + notesSaved[ind].tags;
//         return printOld + printNew;
//     } else {
//         return '';
//     }
// }
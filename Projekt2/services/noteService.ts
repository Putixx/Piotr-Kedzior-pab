/* IMPORT BEG */

import {
    readStorage,
    updateStorage
} from '../services/storageService'
import {
    Note
} from '../models/note'

/* IMPORT END */

/* EXPORT BEG */

export {
    addNewNote,
    editNote
};

/* EXPORT END */

// adds new note to storage file
async function addNewNote(data: any): Promise < void > {
    const notesSaved: Note[] = JSON.parse(await readStorage('data/notes.json')) ?? [];

    notesSaved.push({
        id: Date.now(),
        title: data.title,
        content: data.content,
        createDate: new Date(),
        isPrivate: data.isPrivate,
        tags: [data.tags]
    });
    updateStorage('data/notes.json', JSON.stringify(notesSaved))
}

// edits existing note in storage file
function editNote(ind: number, dataNew: any, notesSaved: Note[]): string {
    if (ind !== -1) {
        const tempNote = {
            ...notesSaved[ind]
        };

        if (dataNew.title) {
            notesSaved[ind].title = dataNew.title;
        }
        if (dataNew.content) {
            notesSaved[ind].content = dataNew.content;
        }
        if (dataNew.tags) {
            notesSaved[ind].tags = dataNew.tags;
        }

        updateStorage('data/notes.json', JSON.stringify(notesSaved))
        const printOld = 'Notatka przed edycją: ID: ' + tempNote.id + ' Tytuł: ' + tempNote.title + ' Zawartość: ' + tempNote.content + ' Data utworzenia: ' + tempNote.createDate + ' Tagi: ' + tempNote.tags + '\n';
        const printNew = 'Notatka po edycji: ID: ' + notesSaved[ind].id + ' Tytuł: ' + notesSaved[ind].title + ' Zawartość: ' + notesSaved[ind].content + ' Data utworzenia: ' + notesSaved[ind].createDate + ' Tagi: ' + notesSaved[ind].tags;
        return printOld + printNew;
    } else {
        return '';
    }
}
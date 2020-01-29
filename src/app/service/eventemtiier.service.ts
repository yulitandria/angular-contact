import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Contact } from '../model/contact.model';
import { EditableContact } from '../model/editablecontact.model';

@Injectable({
    providedIn: 'root'
})
export class EventEmitterService {

    invokeShowDialogFunction = new EventEmitter();
    subsVar: Subscription;

    constructor() { }

    onShowDialogButtonClick(contactEditable?: EditableContact) {
        this.invokeShowDialogFunction.emit(contactEditable);
    }
} 
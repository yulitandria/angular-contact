import { Contact } from './contact.model';

export interface EditableContact {
    isGonnaEdit:boolean; 
    contact?:Contact;
  }
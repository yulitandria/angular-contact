import { Component, OnInit, Directive, Input, Output, ViewChildren, QueryList, EventEmitter } from '@angular/core';
import { Contact } from '../model/contact.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '../service/app.service';
import { EventEmitterService } from '../service/eventemtiier.service';
import { EditableContact } from '../model/editablecontact.model';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html'
})
export class ContactlistComponent implements OnInit {
  loadedContacts: Contact[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private contactService: ContactService, private eventEmitterService: EventEmitterService) {}

  ngOnInit() {
    this.errorSub = this.contactService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.contactService.fetchContacts().subscribe(
      posts => {
        this.isFetching = false;
        this.loadedContacts = posts;
      },
      error => {
        this.isFetching = false;
        this.error = error.message;
      }
    );

    if (this.eventEmitterService.loadSubsVar==undefined) {    
      this.eventEmitterService.loadSubsVar = this.eventEmitterService.    
      invokeLoadContact.subscribe(() => {    
        this.onFetchContacts();   
      });    
    } 
  }
  
  onFetchContacts() {
    // Send Http request
    this.isFetching = true;
    this.contactService.fetchContacts().subscribe(
      contacts => {
        this.isFetching = false;
        this.loadedContacts = contacts;
      },
      error => {
        this.isFetching = false;
        this.error = error.message;
        console.log(error);
      }
    );
  }

  onDeleteContact(id:string) {
    // Send Http request
    if(confirm('Are you sure want to delete contact ?')){
      this.contactService.deleteContact(id).subscribe(() => {
        this.onFetchContacts();
      });
    }
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

  onAddContactClicked(){
    console.log('add clicked')
    //alert('clicked')
    //document.body.appendChild(document.createElement('app-addcontactmodal')) 
    let newContact: EditableContact = {isGonnaEdit:false};
    this.eventEmitterService.onShowDialogButtonClick(newContact);
  }

  onEditContactClicked(contact: Contact){
    console.log('edit button clicked');
    console.log(contact)
    let newContact: EditableContact = {
      isGonnaEdit: true,
      contact: contact
    };
    this.eventEmitterService.onShowDialogButtonClick(newContact);
  }
}



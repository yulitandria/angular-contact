import { Component, OnInit, Directive, Input, Output, ViewChildren, QueryList, EventEmitter } from '@angular/core';
import { Contact } from '../model/contact.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '../service/app.service';
import { EventEmitterService } from '../service/eventemtiier.service';
import { EditableContact } from '../model/editablecontact.model';

//--------------------------------------------------
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

//--------------------------------------------------

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

  //---------------------------------------------------------------------------

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  onSort({column, direction}: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '') {
      this.loadedContacts  = this.loadedContacts ;
    } else {
      this.loadedContacts = [...this.loadedContacts].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}



import { Component, OnInit } from '@angular/core';
import { Contact } from '../model/contact.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '../service/app.service';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html'
})
export class ContactlistComponent implements OnInit {
  loadedContacts: Contact[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private contactService: ContactService) {}

  ngOnInit() {
    this.errorSub = this.contactService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.contactService.fetchPosts().subscribe(
      posts => {
        this.isFetching = false;
        this.loadedContacts = posts;
      },
      error => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }
  

  onCreatePost(contactData: Contact) {
    // Send Http request
    this.contactService.createAndStorePost(contactData.fullName, contactData.phoneNumber, contactData.address);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.contactService.fetchPosts().subscribe(
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

  onClearPosts() {
    // Send Http request
    this.contactService.deletePosts().subscribe(() => {
      this.loadedContacts = [];
    });
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { Contact } from '../model/contact.model';


@Injectable({ providedIn: 'root' })
export class ContactService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStoreContact(name: string, phone: string, address:string) {
    const contactData: Contact = { fullName: name, phoneNumber: phone, address:address };
    console.log('POST DATA')
    console.log(contactData)
    this.http
      .post<{ name: string }>(
        'https://cdc-web-frontend.herokuapp.com/contacts',
        contactData,
        {
          observe: 'response'
        }
      )
      .subscribe(
        responseData => {
          console.log(responseData);
        },
        error => {
          this.error.next(error.message);
        }
      );
  }

  putAndEditContact(name: string, phone: string, address:string, id:string) {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('id', id);
    const contactData: Contact = { fullName: name, phoneNumber: phone, address:address };
    console.log('PUT DATA '+id)
    console.log(contactData)
    console.log(searchParams)
    this.http
      .put<{ name: string }>(
        'https://cdc-web-frontend.herokuapp.com/contacts/'+id,
        contactData,
        {
          observe: 'response',
          params: searchParams
        }
      )
      .subscribe(
        responseData => {
          console.log(responseData);
        },
        error => {
          this.error.next(error.message);
        }
      );
  }

  fetchContacts() {
    return this.http
      .get<{ [key: string]: Contact }>(
        'https://cdc-web-frontend.herokuapp.com/contacts',
        {
          //headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          responseType: 'json'
        }
      )
      .pipe(
        map(responseData => {
          const contactsArray: Contact[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              contactsArray.push({ ...responseData[key]});
            }
          }
          return contactsArray;
        }),
        catchError(errorRes => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deleteContact(id:string) {
    return this.http
      .delete('https://cdc-web-frontend.herokuapp.com/contacts/'+id, {
        observe: 'events',
        responseType: 'json'
      })
      .pipe(
        tap(event => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            // ...
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}

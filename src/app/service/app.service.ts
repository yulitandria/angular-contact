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

  fetchContacts() {
    //let searchParams = new HttpParams();
    //searchParams = searchParams.append('print', 'pretty');
    return this.http
      .get<{ [key: string]: Contact }>(
        'https://cdc-web-frontend.herokuapp.com/contacts',
        {
          //headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          //params: searchParams,
          responseType: 'json'
        }
      )
      .pipe(
        map(responseData => {
          const contactsArray: Contact[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              contactsArray.push({ ...responseData[key], id: key });
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

  deleteContact() {
    return this.http
      .delete('https://ng-complete-guide-c56d3.firebaseio.com/posts.json', {
        observe: 'events',
        responseType: 'text'
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { HttpClientModule } from '@angular/common/http';
import { AddcontactmodalComponent } from './addcontactmodal/addcontactmodal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContactlistComponent,
    AddcontactmodalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,ReactiveFormsModule, HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

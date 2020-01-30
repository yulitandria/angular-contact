import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { AddcontactmodalComponent } from './addcontactmodal/addcontactmodal.component';


const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'list', component: ContactlistComponent},{path:'', component: ContactlistComponent},
  {path:'test', component: AddcontactmodalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

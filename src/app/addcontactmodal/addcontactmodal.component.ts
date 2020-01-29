import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { EventEmitterService } from '../service/eventemtiier.service';
import { Contact } from '../model/contact.model';
import { EditableContact } from '../model/editablecontact.model';
import { ContactService } from '../service/app.service';

@Component({
  selector: 'app-addcontactmodal',
  templateUrl: './addcontactmodal.component.html',
  styleUrls: ['./addcontactmodal.component.css']
})
export class AddcontactmodalComponent implements OnInit {
  addContactForm: FormGroup;
  isEdit: boolean = false;

  constructor(    private contactService: ContactService,
    private eventEmitterService: EventEmitterService    
  ) { }    
  

  ngOnInit() {
    this.addContactForm = new FormGroup({
      'fullName': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
      'phoneNumber': new FormControl(null, [Validators.required]),
      'address': new FormControl(null, [Validators.required])
    });
    // this.addContactForm.valueChanges.subscribe(
    //   (value) => console.log(value)
    // );
    this.addContactForm.statusChanges.subscribe(
      (status) => console.log(status)
    );
    
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeShowDialogFunction.subscribe((contactEditable: EditableContact) => {    
        this.showDialog(contactEditable.isGonnaEdit,contactEditable.contact);   
      });    
    } 
  }

  @ViewChild('modal_1', { static: true }) modal_1: TemplateRef<any>;
  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc: ViewContainerRef;
  backdrop: any
  
  showDialog(isGonnaEdit:boolean, contact?:Contact) {
    this.isEdit = isGonnaEdit;
    let view = this.modal_1.createEmbeddedView(null);
    this.vc.insert(view);
    this.modal_1.elementRef.nativeElement.previousElementSibling.classList.remove('fade');
    this.modal_1.elementRef.nativeElement.previousElementSibling.classList.add('modal-open');
    this.modal_1.elementRef.nativeElement.previousElementSibling.style.display = 'block';
    this.backdrop = document.createElement('DIV')
    this.backdrop.className = 'modal-backdrop show';
    document.body.appendChild(this.backdrop)
    if(isGonnaEdit){
      this.addContactForm.patchValue({
          'fullName': contact.fullName,
          'phoneNumber': contact.phoneNumber,
          'address': contact.address
        });
    }
  }

  closeDialog() {
    this.addContactForm.reset();
    this.vc.clear()
    document.body.removeChild(this.backdrop)
  }

  onSubmit() {
    console.log(this.addContactForm);
    let valueForm = this.addContactForm.value;
    //this.addContactForm.reset();
    if(this.isEdit){
      //create contact
      this.contactService.createAndStoreContact(valueForm.fullName, valueForm.phoneNumber, valueForm.address);
    }else{
      //edit contact

    }
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.addContactForm.get('hobbies')).push(control);
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    return null;
  }

}

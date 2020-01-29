import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-addcontactmodal',
  templateUrl: './addcontactmodal.component.html',
  styleUrls: ['./addcontactmodal.component.css']
})
export class AddcontactmodalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.addContactForm = new FormGroup({
      'fullName': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
      'phoneNumber': new FormControl(null, [Validators.required]),
      'address': new FormControl(null)
    });
    // this.addContactForm.valueChanges.subscribe(
    //   (value) => console.log(value)
    // );
    this.addContactForm.statusChanges.subscribe(
      (status) => console.log(status)
    );
    // this.addContactForm.setValue({
    //   'userData': {
    //     'username': 'Max',
    //     'email': 'max@test.com'
    //   },
    //   'gender': 'male',
    //   'hobbies': []
    // });
    // this.addContactForm.patchValue({
    //   'userData': {
    //     'username': 'Anna',
    //   }
    // });
    this.showDialog();
  }

  @ViewChild('modal_1', { static: true }) modal_1: TemplateRef<any>;
  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc: ViewContainerRef;
  backdrop: any
  
  showDialog() {
    let view = this.modal_1.createEmbeddedView(null);
    this.vc.insert(view);
    this.modal_1.elementRef.nativeElement.previousElementSibling.classList.remove('fade');
    this.modal_1.elementRef.nativeElement.previousElementSibling.classList.add('modal-open');
    this.modal_1.elementRef.nativeElement.previousElementSibling.style.display = 'block';
    this.backdrop = document.createElement('DIV')
    this.backdrop.className = 'modal-backdrop show';
    document.body.appendChild(this.backdrop)
  }

  closeDialog() {
    this.vc.clear()
    document.body.removeChild(this.backdrop)
  }



  genders = ['male', 'female'];
  addContactForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  onSubmit() {
    console.log(this.addContactForm);
    this.addContactForm.reset();
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.addContactForm.get('hobbies')).push(control);
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

}

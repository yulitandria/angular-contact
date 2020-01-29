import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcontactmodalComponent } from './addcontactmodal.component';

describe('AddcontactmodalComponent', () => {
  let component: AddcontactmodalComponent;
  let fixture: ComponentFixture<AddcontactmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcontactmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcontactmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

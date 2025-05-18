import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileDateCreatedFilterComponent } from './my-profile-date-created-filter.component';

describe('MyProfileDateCreatedFilterComponent', () => {
  let component: MyProfileDateCreatedFilterComponent;
  let fixture: ComponentFixture<MyProfileDateCreatedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileDateCreatedFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileDateCreatedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

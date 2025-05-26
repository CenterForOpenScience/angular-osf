import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileInstitutionFilterComponent } from './my-profile-institution-filter.component';

describe('MyProfileInstitutionFilterComponent', () => {
  let component: MyProfileInstitutionFilterComponent;
  let fixture: ComponentFixture<MyProfileInstitutionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileInstitutionFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileInstitutionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
